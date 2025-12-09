# AWS Bedrock Integration for MiniFi

## Overview

Add Amazon Bedrock as an AI provider option alongside OpenAI for the MiniFi coaching system.

## Available AWS Models

### Recommended Models:
1. **Claude 3.5 Sonnet** (Anthropic) - Best for coaching
2. **Claude 3 Haiku** (Anthropic) - Fast and cost-effective
3. **Llama 3.1 70B** (Meta) - Open source alternative
4. **Mistral Large** - European alternative

## Quick Setup

### 1. Install AWS SDK

```bash
cd backend
pip install boto3
```

Update `requirements.txt`:
```txt
boto3>=1.34.0
```

### 2. Configure AWS Credentials

```bash
# Option A: AWS CLI
aws configure

# Option B: Environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Update `.env`

```bash
# AI Provider Selection
AI_PROVIDER=bedrock  # or "openai"

# OpenAI (existing)
OPENAI_API_KEY=your_openai_key

# AWS Bedrock
AWS_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-3-5-sonnet-20241022-v2:0
```

## Implementation

### Create Bedrock Service

Create `backend/services/bedrock_service.py`:

```python
import boto3
import json
import os
from typing import Optional

class BedrockService:
    def __init__(self):
        self.client = boto3.client(
            service_name='bedrock-runtime',
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.model_id = os.getenv(
            'AWS_BEDROCK_MODEL',
            'anthropic.claude-3-5-sonnet-20241022-v2:0'
        )
    
    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int = 800,
        temperature: float = 0.8
    ) -> str:
        """Generate text using AWS Bedrock"""
        
        # Claude 3 format
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "system": system_prompt,
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        })
        
        try:
            response = self.client.invoke_model(
                modelId=self.model_id,
                body=body
            )
            
            response_body = json.loads(response['body'].read())
            return response_body['content'][0]['text']
            
        except Exception as e:
            print(f"❌ Bedrock error: {e}")
            raise
```

### Update Coach Service

Modify `backend/services/coach_service.py`:

```python
import os
from typing import Dict, List, Any
from openai import AsyncOpenAI
from models import CoachRequest, CoachResponse

# Add Bedrock import
try:
    from services.bedrock_service import BedrockService
    BEDROCK_AVAILABLE = True
except ImportError:
    BEDROCK_AVAILABLE = False

class CoachService:
    def __init__(self):
        self.ai_provider = os.getenv("AI_PROVIDER", "openai").lower()
        
        # OpenAI setup
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = None
        if self.openai_key:
            self.openai_client = AsyncOpenAI(api_key=self.openai_key)
        
        # Bedrock setup
        self.bedrock_client = None
        if BEDROCK_AVAILABLE and self.ai_provider == "bedrock":
            self.bedrock_client = BedrockService()
    
    async def _generate_ai_advice(self, request: CoachRequest) -> CoachResponse:
        """Generate AI advice using selected provider"""
        
        system_prompt = self._create_system_prompt(
            request.player_level, 
            self._extract_coach_personality(request)
        )
        user_prompt = self._create_user_prompt(request)
        
        # Route to appropriate provider
        if self.ai_provider == "bedrock" and self.bedrock_client:
            advice_text = await self.bedrock_client.generate_text(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                max_tokens=800,
                temperature=0.8
            )
        elif self.openai_client:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=800,
                temperature=0.8
            )
            advice_text = response.choices[0].message.content
        else:
            return await self._get_mock_advice(request)
        
        return await self._parse_advice_response(advice_text, request)
```

### Update Coach Chat

Modify `backend/services/coach_chat.py`:

```python
import os
from services.bedrock_service import BedrockService

class CoachChatService:
    def __init__(self):
        self.ai_provider = os.getenv("AI_PROVIDER", "openai").lower()
        
        # OpenAI setup
        self.openai_client = None
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            self.openai_client = AsyncOpenAI(api_key=openai_key)
        
        # Bedrock setup
        self.bedrock_client = None
        if self.ai_provider == "bedrock":
            self.bedrock_client = BedrockService()
    
    async def generate_reply(self, payload: CoachReplyRequest) -> CoachReplyResponse:
        if not self.openai_client and not self.bedrock_client:
            return CoachReplyResponse(reply=self.mock_reply(payload))
        
        system = self.build_system_prompt(
            payload.selectedCoach.style, 
            payload.selectedCoach.name
        )
        context = self.build_context_text(payload)
        user_block = f"COACH: {payload.selectedCoach.style}\n\n{context}\n\n"
        
        if payload.userMessage:
            user_block += f"PLAYER ASKS: {payload.userMessage}"
        else:
            user_block += "Player made a trade. Give quick reaction (2-3 sentences)."
        
        try:
            if self.ai_provider == "bedrock" and self.bedrock_client:
                text = await self.bedrock_client.generate_text(
                    system_prompt=system,
                    user_prompt=user_block,
                    max_tokens=200,
                    temperature=0.8
                )
            else:
                resp = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system},
                        {"role": "user", "content": user_block}
                    ],
                    max_tokens=200,
                    temperature=0.8
                )
                text = resp.choices[0].message.content
            
            return CoachReplyResponse(reply=text or self.mock_reply(payload))
            
        except Exception as e:
            print(f"❌ AI error: {e}")
            return CoachReplyResponse(reply=self.mock_reply(payload))
```

## Cost Comparison

| Provider | Model | Cost per 1M tokens | Speed | Quality |
|----------|-------|-------------------|-------|---------|
| OpenAI | GPT-4o-mini | $0.15 / $0.60 | Fast | Excellent |
| AWS | Claude 3.5 Sonnet | $3.00 / $15.00 | Fast | Excellent |
| AWS | Claude 3 Haiku | $0.25 / $1.25 | Very Fast | Good |
| AWS | Llama 3.1 70B | $0.99 / $0.99 | Fast | Good |

**Recommendation**: Use Claude 3 Haiku for cost-effective coaching.

## Testing

### Test Bedrock Connection

```python
# backend/test_bedrock.py
import asyncio
from services.bedrock_service import BedrockService

async def test():
    service = BedrockService()
    
    response = await service.generate_text(
        system_prompt="You are a helpful financial coach for teens.",
        user_prompt="Explain diversification in simple terms.",
        max_tokens=200
    )
    
    print("✅ Bedrock Response:")
    print(response)

if __name__ == "__main__":
    asyncio.run(test())
```

Run test:
```bash
cd backend
python test_bedrock.py
```

## Environment Configuration

### Development (OpenAI)
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Production (AWS Bedrock)
```bash
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-3-haiku-20240307-v1:0
```

### Hybrid (Fallback)
```bash
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
OPENAI_API_KEY=sk-...  # Fallback if Bedrock fails
```

## Benefits of AWS Bedrock

### ✅ Advantages:
- **Cost-effective**: Claude Haiku is cheaper than GPT-4o-mini
- **Privacy**: Data stays in your AWS account
- **Compliance**: Meets Australian data residency requirements
- **No rate limits**: Pay-as-you-go pricing
- **Multiple models**: Easy to switch between providers

### ⚠️ Considerations:
- Requires AWS account setup
- Need to request model access in Bedrock console
- Slightly more complex setup than OpenAI

## AWS Setup Steps

### 1. Enable Bedrock Access

1. Go to AWS Console → Bedrock
2. Navigate to "Model access"
3. Request access to:
   - Anthropic Claude 3.5 Sonnet
   - Anthropic Claude 3 Haiku
   - Meta Llama 3.1 70B

### 2. Create IAM User

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Configure Credentials

```bash
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Region: us-east-1
# Output: json
```

## Monitoring & Logging

Add to `main.py`:

```python
@app.middleware("http")
async def log_ai_provider(request: Request, call_next):
    if request.url.path.startswith("/coach"):
        provider = os.getenv("AI_PROVIDER", "openai")
        print(f"🤖 Using AI provider: {provider}")
    response = await call_next(request)
    return response
```

## Deployment

### Docker with AWS Credentials

```dockerfile
# Dockerfile
FROM python:3.11-slim

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app
COPY . /app
WORKDIR /app

# AWS credentials via environment
ENV AWS_REGION=us-east-1
ENV AI_PROVIDER=bedrock

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# .env.production
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
AWS_BEDROCK_MODEL=anthropic.claude-3-haiku-20240307-v1:0
```

## Summary

**Quick Implementation:**
1. Install boto3
2. Create `bedrock_service.py`
3. Update `coach_service.py` and `coach_chat.py`
4. Set `AI_PROVIDER=bedrock` in `.env`
5. Configure AWS credentials

**Result**: MiniFi can now use AWS Bedrock models for AI coaching! 🚀

**Recommended for Production**: Claude 3 Haiku (cost-effective, fast, good quality)

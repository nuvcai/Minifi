# GitLab Project Setup for Tick Jiang

## Quick Setup (5 minutes)

### Option 1: Via GitLab Web Interface

1. **Go to GitLab**
   - Visit: https://gitlab.com
   - Sign in with your account

2. **Create New Project**
   - Click "New project" button (top right)
   - Select "Create blank project"

3. **Project Details**
   ```
   Project name: NUVC Financial Literacy App
   Project slug: nuvc-financial-literacy-app
   Visibility: Private (or Public if you want)
   Initialize with README: ✓ (checked)
   ```

4. **Click "Create project"**

---

### Option 2: Via Command Line (After creating on GitLab)

```bash
cd "/Users/nuai/Library/Mobile Documents/com~apple~CloudDocs/HACKATHORN"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: NUVC Financial Literacy App

- AI-powered investment education for Australian teens
- Family office coaching approach
- Mobile-optimized trading dashboard
- Backend with FastAPI + OpenAI
- Frontend with Next.js + TypeScript"

# Add GitLab remote (replace with your actual URL)
git remote add origin https://gitlab.com/tick-jiang/nuvc-financial-literacy-app.git

# Push to GitLab
git branch -M main
git push -u origin main
```

---

## Recommended Project Settings

### Project Information
```
Name: NUVC Financial Literacy App
Description: AI-Powered Investment Education Platform for Australian Teenagers (12-18)
Topics: fintech, education, ai, nextjs, fastapi, investment, financial-literacy
```

### Visibility
- **Private**: For development
- **Public**: When ready to showcase

### Features to Enable
- ✓ Issues
- ✓ Wiki
- ✓ Snippets
- ✓ CI/CD (for automated testing)

---

## .gitignore Setup

Already exists, but verify it includes:

```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc

# Environment
.env
.env.local
.env.production

# Build
.next/
dist/
build/

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## Initial Commit Structure

```
NUVC Financial Literacy App/
├── README.md                          # Project overview
├── backend/                           # FastAPI backend
│   ├── main.py                       # API endpoints
│   ├── services/                     # Business logic
│   │   ├── coach_service.py         # AI coaching
│   │   └── coach_chat.py            # Real-time chat
│   └── requirements.txt              # Python dependencies
├── app/                              # Next.js frontend
├── components/                       # React components
├── styles/                           # CSS files
├── public/                           # Static assets
├── package.json                      # Node dependencies
└── Documentation/
    ├── BACKEND_IMPROVEMENTS.md
    ├── AI_COACH_IMPROVEMENTS.md
    ├── MOBILE_TRADING_IMPROVEMENTS.md
    └── UPDATE_SUMMARY.md
```

---

## GitLab CI/CD (Optional)

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build

# Backend tests
test:backend:
  stage: test
  image: python:3.11
  script:
    - cd backend
    - pip install -r requirements.txt
    - python -m py_compile main.py
    - python -m py_compile services/coach_service.py
  only:
    - main
    - merge_requests

# Frontend tests
test:frontend:
  stage: test
  image: node:18
  script:
    - npm install
    - npm run build
  only:
    - main
    - merge_requests
```

---

## Collaboration Setup

### Add Tick Jiang as Maintainer

1. Go to Project → Settings → Members
2. Invite user: `tick.jiang` (or email)
3. Role: Maintainer
4. Click "Invite"

### Branch Protection

1. Go to Settings → Repository → Protected branches
2. Protect `main` branch:
   - Allowed to merge: Maintainers
   - Allowed to push: No one
   - Require merge request: ✓

---

## Quick Commands Reference

```bash
# Clone the repo
git clone https://gitlab.com/tick-jiang/nuvc-financial-literacy-app.git

# Create a new branch
git checkout -b feature/new-feature

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitLab
git push origin feature/new-feature

# Create merge request on GitLab web interface
```

---

## Project README Template

Copy this to your GitLab README:

```markdown
# 🏆 NUVC Financial Literacy App

> **Empowering Australian Teens (12-18) with AI-Powered Investment Education**

## 🎯 Overview

An innovative educational platform teaching teenagers to invest like family offices through:
- 📚 Historical financial missions (1990-2025)
- 🤖 AI-powered coaching with distinct personalities
- 📊 Real-time trading simulation
- 🎮 Gamified learning with XP and rewards
- 📱 Mobile-optimized experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- OpenAI API key

### Installation

**Backend:**
\`\`\`bash
cd backend
pip install -r requirements.txt
./start_backend.sh
\`\`\`

**Frontend:**
\`\`\`bash
npm install
npm run dev
\`\`\`

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🏗️ Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python + OpenAI
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI**: GPT-4o-mini for coaching

## 📚 Documentation

- [Backend Improvements](BACKEND_IMPROVEMENTS.md)
- [AI Coach Guide](AI_COACH_IMPROVEMENTS.md)
- [Mobile UX Guide](MOBILE_TRADING_IMPROVEMENTS.md)
- [Update Summary](UPDATE_SUMMARY.md)

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Merge Request

## 📄 License

Private - NextGen AI Hackathon 2025

## 👥 Team

- **Tick Jiang** - Project Lead
- Built for NextGen AI Hackathon 2025
```

---

## Next Steps After Creating Project

1. ✅ Create project on GitLab
2. ✅ Push initial code
3. ✅ Add team members
4. ✅ Set up branch protection
5. ✅ Enable CI/CD (optional)
6. ✅ Add project description and topics
7. ✅ Create first issue/milestone

---

## Troubleshooting

### Issue: Permission denied
```bash
# Use HTTPS with token
git remote set-url origin https://oauth2:YOUR_TOKEN@gitlab.com/tick-jiang/nuvc-financial-literacy-app.git
```

### Issue: Large files
```bash
# Remove large files from git
git rm --cached backend/legacy_guardians.db
echo "*.db" >> .gitignore
git commit -m "Remove database files"
```

### Issue: Merge conflicts
```bash
git pull origin main
# Resolve conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## Contact

For access or questions, contact: tick.jiang@example.com

---

*Setup Guide Created: 2025-12-01*

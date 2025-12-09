"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   MiniFi - Financial Literacy Platform                                       ║
║   MVP Version for AWS AI Hackathon 2025                                      ║
║                                                                              ║
║   ✨ VIBE-CODED BY TICK.AI ✨                                                ║
║                                                                              ║
║   Copyright (c) 2025 NUVC.AI / Tick.AI. All Rights Reserved.                ║
║   PROPRIETARY - NO COMMERCIAL USE WITHOUT LICENSE                            ║
║                                                                              ║
║   https://nuvc.ai | legal@nuvc.ai                                           ║
║   Built with Amazon Q Developer & Kiro CLI                                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from contextlib import asynccontextmanager
import logging
from services.investment_metrics_service import InvestmentMetricsService
from services.leaderboard_service import LeaderboardService
from services.coach_service import CoachService
from services.yield_sim_service import YieldSimService
from services.rebalance_service import RebalanceService
from services.optimization_service import OptimizationService
from services.simulation_service import SimulationService
from services.price_service import PriceService
from services.coach_chat import CoachChatService
from services.email_service import EmailService
from services.newsletter_service import (
    newsletter_service, 
    cron_weekly_newsletter, 
    cron_reengagement_check
)
from models import (
    PriceRequest, SimulationRequest, OptimizationRequest,
    RebalanceRequest, YieldSimRequest, CoachRequest, CoachResponse,
    LeaderboardSubmit, LeaderboardResponse, RewardRedeemRequest, RewardRedeemResponse, CoachReplyRequest, CoachReplyResponse
)
from database import get_db, init_db
from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sqlite3
import yfinance as yf
import json
import os
import uuid
from functools import lru_cache
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO if os.getenv("DEBUG") != "true" else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Load environment variables from .env file
load_dotenv()

# Import our modules


def safe_float(value):
    """Convert value to safe float for JSON serialization"""
    if pd.isna(value) or np.isnan(value) or np.isinf(value):
        return 0.0
    return float(value)


def safe_json_serializer(obj):
    """Custom JSON serializer to handle NaN and infinite values"""
    if pd.isna(obj) or np.isnan(obj) or np.isinf(obj):
        return 0.0
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    if isinstance(obj, (np.floating, np.float64)):
        return safe_float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, pd.Series):
        return obj.tolist()
    if isinstance(obj, pd.DataFrame):
        return obj.to_dict('records')
    return obj


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - replaces deprecated on_event handlers"""
    # Startup
    logger.info("🚀 Starting MiniFi API server...")
    init_db()
    logger.info("✅ Database initialized")
    yield
    # Shutdown
    logger.info("👋 Shutting down MiniFi API server...")

app = FastAPI(
    title="NUVC Financial Literacy API",
    description="AI-Powered Investment Education Platform for Australian Teenagers",
    version="1.0.0",
    lifespan=lifespan
)

# Request ID and Copyright tracking middleware
@app.middleware("http")
async def add_request_headers(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    # Request tracking
    response.headers["X-Request-ID"] = request_id
    # NUVC.AI Copyright watermark
    response.headers["X-Powered-By"] = "MiniFi MVP - Vibe-coded by Tick.AI"
    response.headers["X-Copyright"] = "(c) 2025 NUVC.AI / Tick.AI. All Rights Reserved."
    response.headers["X-Version"] = "MVP - AWS AI Hackathon 2025"
    response.headers["X-License"] = "Proprietary - No Commercial Use Without License"
    return response

# CORS middleware for frontend integration
# Note: In production, restrict to specific domains only
ALLOWED_ORIGINS = [
    "https://minifi-app.vercel.app",  # Primary production
    "https://minifi.vercel.app",
    "https://minifi-tick-ai.vercel.app",
    "https://minifi.games",  # Custom domain
    "https://www.minifi.games",  # Custom domain with www
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]

# Add localhost only in development
if os.getenv("DEBUG") == "true" or os.getenv("NODE_ENV") != "production":
    ALLOWED_ORIGINS.extend([
        "http://localhost:3000",
        "http://localhost:8501",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.(vercel\.app|minifi\.games)",  # Allow all Vercel preview deployments and minifi.games subdomains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle ValueError (including NaN serialization errors)"""
    if "Out of range float values are not JSON compliant" in str(exc):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Data serialization error",
                "message": "Invalid numeric values detected in response data",
                "details": "Please try again or contact support if the issue persists"
            }
        )
    return JSONResponse(
        status_code=400,
        content={"error": "Bad Request", "message": str(exc)}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "details": str(exc) if os.getenv("DEBUG") == "true" else "Please try again later"
        }
    )

# ID to yfinance ticker mapping
ID_TO_SYMBOL = {
    "apple": "AAPL",
    "microsoft": "MSFT",
    "nvidia": "NVDA",
    "tesla": "TSLA",
    "sp500": "SPY",   # S&P500 ETF
    "etf": "VT",      # Vanguard Total World ETF
    # Crypto supported by Yahoo Finance spot ETFs, e.g., BTC-USD, ETH-USD
    "bitcoin": "BTC-USD",
    "ethereum": "ETH-USD",
}


# Root path


@app.get("/")
async def root():
    return {
        "message": "NextGen AI Hackathon API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "available_routes": [
            "/",
            "/docs",
            "/health",
            "/seed/events",
            "/prices",
            "/quotes",
            "/coach",
            "/simulate"
        ],
        "timestamp": datetime.now().isoformat()
    }

# Health check


@app.get("/health")
async def health_check(db: sqlite3.Connection = Depends(get_db)):
    """Comprehensive health check"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "unknown",
            "openai": "unknown"
        },
        "version": "1.0.0"
    }
    
    # Check database
    try:
        cursor = db.cursor()
        cursor.execute("SELECT 1")
        health_status["services"]["database"] = "connected"
    except Exception as db_error:
        logger.error(f"Database health check failed: {db_error}")
        health_status["services"]["database"] = "disconnected"
        health_status["status"] = "degraded"
    
    # Check OpenAI
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key and len(openai_key) > 10:
        health_status["services"]["openai"] = "configured"
    else:
        health_status["services"]["openai"] = "missing"
        health_status["status"] = "degraded"
    
    return health_status

# Core endpoints


@app.get("/seed/events")
async def get_events():
    """Get historical financial events from CSV"""
    try:
        events_df = pd.read_csv("data/events.csv")
        return events_df.to_dict("records")
    except FileNotFoundError:
        # Return default events if CSV not found
        return [
            {
                "year": 1990,
                "title": "Japanese Bubble Economy Collapse",
                "description": "The bursting of Japan's real estate and stock market bubbles",
                "available_assets": ["NIKKEI", "GOLD", "BONDS"],
                "market_volatility": "high",
                "open_trading": True
            },
            {
                "year": 2000,
                "title": "Dot-com Bubble Burst",
                "description": "Tech stocks plummeted, Nasdaq fell 78%",
                "available_assets": ["QQQ", "GOLD", "BONDS"],
                "market_volatility": "high",
                "open_trading": True
            }
        ]


# Price data cache
price_cache: Dict[str, tuple] = {}
CACHE_TTL = timedelta(hours=1)

def get_cached_price_data(cache_key: str) -> Optional[Dict]:
    """Get cached price data if still valid"""
    if cache_key in price_cache:
        data, timestamp = price_cache[cache_key]
        if datetime.now() - timestamp < CACHE_TTL:
            return data
    return None

def set_price_cache(cache_key: str, data: Dict):
    """Cache price data with timestamp"""
    price_cache[cache_key] = (data, datetime.now())


@app.get("/prices")
async def get_prices(
    tickers: str,
    period: str = "1y",
    db: sqlite3.Connection = Depends(get_db)
):
    """Get historical prices with caching"""
    cache_key = f"{tickers}_{period}"
    
    # Check cache first
    cached_data = get_cached_price_data(cache_key)
    if cached_data:
        return {
            **cached_data,
            "cached": True,
            "timestamp": datetime.now().isoformat()
        }
    
    # Generate fresh data
    ticker_list = tickers.split(",")

    # Generate mock data spanning from 1990 to current year
    start_year = 1990
    current_year = datetime.now().year
    dates = pd.date_range(
        start=f"{start_year}-01-01", end=f"{current_year}-12-31", freq="D")
    data = {}

    for ticker in ticker_list:
        np.random.seed(hash(ticker) % 2**32)

        # Create realistic multi-decade trend with market cycles
        years = current_year - start_year + 1
        base_price = 100

        # Create different trends for different assets
        if ticker == "VTI":  # Stock market - long term growth with cycles
            # 200% growth over 30+ years
            trend = np.linspace(0, 2.0, len(dates))
            # Add market cycles (boom and bust)
            # 7-year cycle
            cycle1 = 0.3 * \
                np.sin(2 * np.pi * np.arange(len(dates)) / (365 * 7))
            # 3-year cycle
            cycle2 = 0.1 * \
                np.sin(2 * np.pi * np.arange(len(dates)) / (365 * 3))
            noise = np.random.randn(len(dates)) * 0.02
            prices = base_price * (1 + trend + cycle1 + cycle2 + noise)

        elif ticker == "BND":  # Bonds - steady growth
            # 80% growth over 30+ years
            trend = np.linspace(0, 0.8, len(dates))
            noise = np.random.randn(len(dates)) * 0.005
            prices = base_price * (1 + trend + noise)

        elif ticker == "GLD":  # Gold - volatile but upward
            # 120% growth over 30+ years
            trend = np.linspace(0, 1.2, len(dates))
            volatility = 0.3 * \
                np.sin(2 * np.pi * np.arange(len(dates)) / (365 * 5))
            noise = np.random.randn(len(dates)) * 0.03
            prices = base_price * (1 + trend + volatility + noise)

        else:  # Default for other assets
            # 150% growth over 30+ years
            trend = np.linspace(0, 1.5, len(dates))
            noise = np.random.randn(len(dates)) * 0.02
            prices = base_price * (1 + trend + noise)

        # Ensure prices don't go negative
        prices = np.maximum(prices, base_price * 0.1)

        # Ensure all prices are safe for JSON
        prices = [safe_float(price) for price in prices]

        ticker_data = []
        for i, date in enumerate(dates):
            ticker_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": safe_float(prices[i] * 0.99),
                "high": safe_float(prices[i] * 1.01),
                "low": safe_float(prices[i] * 0.98),
                "close": safe_float(prices[i]),
                "volume": int(np.random.uniform(1000000, 5000000))
            })

        data[ticker] = ticker_data

    result = {
        "data": data,
        "cached": False,
        "timestamp": datetime.now().isoformat()
    }
    
    # Cache the result
    set_price_cache(cache_key, result)
    
    return result


@app.post("/simulate")
async def simulate_investment(request: SimulationRequest):
    """Simulate investment returns with cash flow breakdown"""
    # Generate realistic simulation results with extended timeline
    initial_capital = request.initial_capital

    # Simulate different scenarios based on asset allocation
    asset_weights = request.asset_weights

    # Calculate expected returns based on asset mix
    total_return = 0
    if "VTI" in asset_weights:
        total_return += asset_weights["VTI"] * 0.08  # 8% for stocks
    if "BND" in asset_weights:
        total_return += asset_weights["BND"] * 0.04  # 4% for bonds
    if "GLD" in asset_weights:
        total_return += asset_weights["GLD"] * 0.06  # 6% for gold

    # Add some randomness
    total_return += np.random.normal(0, 0.02)

    # Ensure total_return is safe for calculations
    total_return = safe_float(total_return)

    final_value = initial_capital * (1 + total_return)

    # Generate performance chart data (yearly from 1990 to current)
    years = list(range(1990, datetime.now().year + 1))
    performance_chart = []

    for year in years:
        # Simulate growth over time with some volatility
        years_elapsed = year - 1990
        total_years = len(years)

        # Add some market cycles
        cycle_factor = 1 + 0.2 * \
            np.sin(2 * np.pi * years_elapsed / 7)  # 7-year cycle
        growth_factor = (1 + total_return) ** (years_elapsed /
                                               total_years) * cycle_factor
        value = initial_capital * growth_factor

        performance_chart.append({
            "date": f"{year}-01-01",
            # Ensure minimum value and safe float
            "value": safe_float(max(value, initial_capital * 0.1))
        })

    return {
        "final_value": safe_float(final_value),
        "total_return": safe_float(total_return),
        "annualized_return": safe_float(total_return),
        "volatility": safe_float(0.15 + np.random.normal(0, 0.05)),
        "sharpe_ratio": safe_float(max(0.1, total_return / 0.15)),
        "max_drawdown": safe_float(-0.1 - abs(np.random.normal(0, 0.05))),
        "performance_chart": performance_chart
    }


@app.post("/optimize")
async def optimize_portfolio(request: OptimizationRequest):
    """Optimize portfolio using Sharpe ratio"""
    optimization_service = OptimizationService()
    return await optimization_service.optimize(request)


@app.post("/rebalance")
async def rebalance_portfolio(request: RebalanceRequest):
    """Auto-rebalance portfolio to target weights"""
    rebalance_service = RebalanceService()
    return await rebalance_service.rebalance(request)


@app.post("/yield-sim")
async def simulate_yield(request: YieldSimRequest):
    """Simulate passive income from bonds, REITs, crypto"""
    yield_service = YieldSimService()
    return await yield_service.simulate(request)


@app.post("/coach")
async def get_coach_advice(request: CoachRequest):
    """Get personalized AI coach advice"""
    coach_service = CoachService()
    return await coach_service.get_advice(request)


@app.post("/leaderboard/submit")
async def submit_score(
    request: LeaderboardSubmit,
    db: sqlite3.Connection = Depends(get_db)
):
    """Submit player score to leaderboard"""
    leaderboard_service = LeaderboardService()
    return await leaderboard_service.submit_score(request, db)


@app.get("/leaderboard/top")
async def get_leaderboard(
    season: str = "current",
    limit: int = 10,
    db: sqlite3.Connection = Depends(get_db)
):
    """Get top players from leaderboard"""
    leaderboard_service = LeaderboardService()
    return await leaderboard_service.get_top_players(season, limit, db)

# Real historical data endpoints


@app.get("/investment-metrics/{ticker}")
async def get_investment_metrics(
    ticker: str,
    start_date: str,
    end_date: str,
    initial_investment: float = 100000
):
    """Get real investment metrics from historical data"""
    investment_metrics_service = InvestmentMetricsService()
    return await investment_metrics_service.calculate_investment_metrics(
        ticker=ticker,
        start_date=start_date,
        end_date=end_date,
        initial_investment=initial_investment
    )


@app.get("/historical-performance/{ticker}/{event_year}")
async def get_historical_performance(
    ticker: str,
    event_year: int
):
    """Get performance for a specific historical event"""
    investment_metrics_service = InvestmentMetricsService()
    return await investment_metrics_service.calculate_historical_performance(
        ticker=ticker,
        event_year=event_year
    )


@app.get("/asset-comparison")
async def get_asset_comparison(
    assets: str,
    start_date: str,
    end_date: str
):
    """Compare performance of multiple assets"""
    asset_list = assets.split(",")
    investment_metrics_service = InvestmentMetricsService()
    return await investment_metrics_service.get_asset_performance_comparison(
        assets=asset_list,
        start_date=start_date,
        end_date=end_date
    )


@app.get("/quotes")
def get_quotes(request: Request, ids: List[str] = Query(None)):
    if not ids:
        raw = request.query_params.get("ids", "")
        ids = [x for x in raw.split(",") if x] if raw else []

    # Validate and filter to allowed tickers only
    valid_ids = [i.lower().strip() for i in ids if i.lower().strip() in ID_TO_SYMBOL]
    syms = {i: ID_TO_SYMBOL.get(i) for i in valid_ids if ID_TO_SYMBOL.get(i)}
    if not syms:
        return {"quotes": []}

    logger.info(f"Fetching quotes for symbols: {list(syms.values())}")

    # Use longer period to ensure sufficient data
    try:
        df = yf.download(
            tickers=list(syms.values()),
            period="5d",
            interval="1d",
            group_by="ticker",
            auto_adjust=False,
            progress=False,
            threads=True,
        )
        logger.debug(f"Downloaded data shape: {df.shape}")

        if df.empty:
            logger.warning("No data downloaded, using fallback")
            return {"quotes": _get_fallback_quotes(syms)}

    except Exception as e:
        logger.error(f"Error downloading data: {e}")
        return {"quotes": _get_fallback_quotes(syms)}

    results = []
    for _id, sym in syms.items():
        try:
            logger.debug(f"Processing {_id} -> {sym}")

            # Compatible with both yfinance return structures (multi/single ticker)
            if isinstance(df.columns, pd.MultiIndex):
                if sym in df.columns.levels[0]:
                    close = df[sym]["Close"]
                else:
                    logger.debug(f"Symbol {sym} not found in MultiIndex columns")
                    continue
            else:
                close = df["Close"]

            if close.empty:
                logger.debug(f"No data for {sym}")
                continue

            # Find the last valid price (non-nan)
            valid_prices = close.dropna()
            if valid_prices.empty:
                logger.debug(f"No valid prices for {sym}")
                continue

            latest = safe_float(valid_prices.iloc[-1])

            # Find the second-to-last valid price for change calculation
            if len(valid_prices) > 1:
                prev = safe_float(valid_prices.iloc[-2])
            else:
                prev = latest

            if latest <= 0:
                logger.warning(f"Invalid price for {sym}: {latest}")
                continue

            change = safe_float(((latest - prev) / prev * 100)
                                if prev and prev > 0 else 0.0)

            results.append({
                "id": _id,
                "currentPrice": round(latest, 2),
                "change": round(change, 2),
            })

        except Exception as e:
            logger.error(f"Error processing {_id} ({sym}): {e}")
            continue

    logger.debug(f"Quotes fetched: {len(results)} results")

    # Use fallback data if no data is retrieved
    if not results:
        logger.warning("No results obtained, using fallback")
        return {"quotes": _get_fallback_quotes(syms)}

    return {"quotes": results}


def _get_fallback_quotes(syms: Dict[str, str]) -> List[Dict[str, Any]]:
    """Return fallback quotes when yfinance fails"""
    logger.debug("Using fallback quotes")

    # Mock price data
    fallback_prices = {
        "AAPL": 175.50,
        "MSFT": 380.25,
        "NVDA": 850.75,
        "TSLA": 245.80,
        "SPY": 450.30,
        "VT": 95.45,
        "BTC-USD": 112495.65,
        "ETH-USD": 4502.13,
    }

    results = []
    for _id, sym in syms.items():
        if sym in fallback_prices:
            price = fallback_prices[sym]
            # Simulate small price changes
            change = round((np.random.random() - 0.5) * 2, 2)  # -1% to +1%

            results.append({
                "id": _id,
                "currentPrice": price,
                "change": change,
            })

    return results


coach_chat_service = CoachChatService()


@app.post("/api/coach/reply", response_model=CoachReplyResponse)
async def coach_reply(payload: CoachReplyRequest):
    return await coach_chat_service.generate_reply(payload)


# Initialize services
email_service = EmailService()


@app.post("/rewards/redeem", response_model=RewardRedeemResponse)
async def redeem_reward(request: RewardRedeemRequest):
    """Redeem a reward and send voucher email to user"""
    try:
        logger.info(f"Processing reward redemption for {request.user_email}")
        logger.debug(f"Reward: {request.reward_name} from {request.partner}, Cost: {request.reward_cost} XP")

        # Validate XP balance
        if request.player_xp < request.reward_cost:
            return RewardRedeemResponse(
                success=False,
                message=f"Insufficient XP. You need {request.reward_cost - request.player_xp} more XP to redeem this reward.",
                email_sent=False
            )

        # Send voucher email
        email_result = await email_service.send_voucher_email(
            user_email=request.user_email,
            reward_name=request.reward_name,
            partner=request.partner,
            reward_description=request.reward_description
        )

        if email_result["success"]:
            return RewardRedeemResponse(
                success=True,
                message=email_result["message"],
                coupon_code=email_result["coupon_code"],
                simulated=email_result["simulated"],
                email_sent=True
            )
        else:
            return RewardRedeemResponse(
                success=False,
                message=email_result["message"],
                email_sent=False
            )

    except Exception as e:
        logger.error(f"Error redeeming reward: {e}")
        return RewardRedeemResponse(
            success=False,
            message="Failed to process reward redemption",
            email_sent=False
        )


# =============================================================================
# CRON ENDPOINTS (called by Render Cron Jobs)
# =============================================================================

# Secret token to protect cron endpoints - NO FALLBACK for security
CRON_SECRET = os.getenv("CRON_SECRET")


@app.post("/cron/newsletter")
async def trigger_weekly_newsletter(
    secret: str = Query(None, description="Cron job secret token")
):
    """
    🗓️ RENDER CRON: Weekly Newsletter
    
    Schedule: Every Tuesday at 10am UTC
    Cron Expression: 0 10 * * 2
    
    Usage from Render Cron Job:
    curl -X POST "https://your-api.onrender.com/cron/newsletter?secret=YOUR_SECRET"
    """
    # Validate secret - require in production
    is_production = os.getenv("ENV") == "production"
    if is_production:
        if not CRON_SECRET:
            logger.error("CRON_SECRET not configured in production")
            raise HTTPException(status_code=500, detail="Server configuration error")
        if secret != CRON_SECRET:
            raise HTTPException(status_code=403, detail="Invalid cron secret")
    
    logger.info("Cron job triggered: Weekly Newsletter")
    
    try:
        result = await cron_weekly_newsletter()
        return {
            "status": "success",
            "job": "weekly_newsletter",
            "timestamp": datetime.now().isoformat(),
            "result": result
        }
    except Exception as e:
        logger.error(f"Newsletter cron failed: {e}")
        raise HTTPException(status_code=500, detail="Newsletter cron job failed")


@app.post("/cron/reengagement")
async def trigger_reengagement(
    secret: str = Query(None, description="Cron job secret token")
):
    """
    🗓️ RENDER CRON: Daily Re-engagement Check
    
    Schedule: Daily at 9am UTC
    Cron Expression: 0 9 * * *
    """
    is_production = os.getenv("ENV") == "production"
    if is_production:
        if not CRON_SECRET:
            logger.error("CRON_SECRET not configured in production")
            raise HTTPException(status_code=500, detail="Server configuration error")
        if secret != CRON_SECRET:
            raise HTTPException(status_code=403, detail="Invalid cron secret")
    
    logger.info("Cron job triggered: Re-engagement Check")
    
    try:
        result = await cron_reengagement_check()
        return {
            "status": "success",
            "job": "reengagement",
            "timestamp": datetime.now().isoformat(),
            "result": result
        }
    except Exception as e:
        logger.error(f"Re-engagement cron failed: {e}")
        raise HTTPException(status_code=500, detail="Re-engagement cron job failed")


@app.get("/cron/newsletter/preview")
async def preview_newsletter():
    """Preview this week's newsletter content (no sending)"""
    content = newsletter_service.preview_weekly_digest()
    return {
        "status": "preview",
        "content": content,
        "note": "This is a preview. POST to /cron/newsletter to send."
    }


@app.post("/api/newsletter/subscribe")
async def newsletter_subscribe(email: str, first_name: str = None):
    """Subscribe to newsletter (triggers welcome email)"""
    try:
        result = await newsletter_service.send_welcome_email(email, first_name)
        return {
            "success": True,
            "message": "Welcome to Legacy Guardians! Check your inbox.",
            "result": result
        }
    except Exception as e:
        logger.error(f"Newsletter subscribe failed: {e}")
        raise HTTPException(status_code=500, detail="Newsletter subscription failed")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

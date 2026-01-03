import os, time, random, asyncio, hashlib, secrets
from collections import defaultdict
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
import asyncpg, httpx

# ===================== CONFIG =====================
BOT_TOKEN = os.getenv("BOT_TOKEN","")
DATABASE_URL = os.getenv("DATABASE_URL","")
APP_URL = os.getenv("APP_URL","")

# Admin & Security
ADMIN_IDS = {123456789}          # <-- ضع Telegram IDs
ADMIN_IP_WHITELIST = {"127.0.0.1"}  # <-- IP الأدمن (أضِف IP Render عند الحاجة)

# Prices & Rates (LOCKED)
BX_RATE_TON = 2.0
BX_RATE_USDT = 1.5
BX_TO_TON = 0.2

RTP_CRASH = 0.97
RTP_DICE = 0.96

# Withdraw Limits
MIN_WITHDRAW_TON = 1.0
MAX_WITHDRAW_TON = 100.0
WITHDRAW_COOLDOWN = 3600
DAILY_WITHDRAW_LIMIT = 300.0

# Mining
BNB_MINING_RATE = 0.0003
SOL_MINING_RATE = 0.0030
BNB_LOCK = 86400
SOL_LOCK = 172800

# Market
STON_POOL_ID = "PUT_REAL_POOL_ID_HERE"
STON_POOL_API = "https://api.ston.fi/v1/pools/"
COINGECKO = "https://api.coingecko.com/api/v3/simple/price"

# TON SDK
TON_MNEMONIC = os.getenv("TON_MNEMONIC","").split()
TON_RPC = os.getenv("TON_RPC","")
TON_API_KEY = os.getenv("TON_API_KEY","")

# ===================== APP =====================
app = FastAPI()

# ===================== DB =====================
pool = None
async def db():
    global pool
    if not pool:
        pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    return pool

# ===================== RATE LIMIT =====================
RATE = {"window":60,"max":30}
_hits = defaultdict(list)

def rate_ok(ip):
    now=time.time()
    _hits[ip]=[t for t in _hits[ip] if now-t<RATE["window"]]
    if len(_hits[ip])>=RATE["max"]: return False
    _hits[ip].append(now); return True

@app.middleware("http")
async def limiter(req:Request, call_next):
    ip=req.client.host
    if not rate_ok(ip):
        return HTMLResponse("Too many requests",status_code=429)
    return await call_next(req)

# ===================== UI =====================
@app.get("/", response_class=HTMLResponse)
async def home():
    with open("index.html","r",encoding="utf-8") as f:
        return f.read()

@app.get("/health")
async def health():
    return {"ok":True}

# ===================== MARKET =====================
PRICE_CACHE={"ts":0,"bx_ton":0,"bx_usdt":0,"liq_ton":0,"liq_bx":0,"vol":0}

@app.get("/market")
async def market():
    now=time.time()
    if now-PRICE_CACHE["ts"]>30:
        async with httpx.AsyncClient(timeout=10) as x:
            r1=await x.get(COINGECKO,params={"ids":"the-open-network","vs_currencies":"usd"})
            ton_usdt=r1.json()["the-open-network"]["usd"]
            r2=await x.get(STON_POOL_API+STON_POOL_ID)
            p=r2.json()["pool"]
            bx=float(p["reserves"][0]["balance"])
            ton=float(p["reserves"][1]["balance"])
            bx_ton=ton/bx if bx else 0
            PRICE_CACHE.update({
                "ts":now,
                "bx_ton":round(bx_ton,6),
                "bx_usdt":round(bx_ton*ton_usdt,6),
                "liq_ton":ton,
                "liq_bx":bx,
                "vol":float(p.get("volume24h",0))
            })
    return PRICE_CACHE

# ===================== USERS =====================
@app.post("/user/init")
async def user_init(p:dict):
    async with (await db()).acquire() as c:
        await c.execute("INSERT INTO users(id) VALUES($1) ON CONFLICT DO NOTHING",p["user"])
    return {"ok":True}

@app.get("/wallet/{uid}")
async def wallet(uid:int):
    async with (await db()).acquire() as c:
        u=await c.fetchrow("SELECT bx FROM users WHERE id=$1",uid)
    return {"bx": float(u["bx"]) if u else 0}

# ===================== CASINO =====================
_last_play={}
def can_play(uid):
    now=time.time(); last=_last_play.get(uid,0)
    if now-last<2: return False
    _last_play[uid]=now; return True

@app.get("/casino/crash")
async def crash(uid:int):
    if not can_play(uid): return {"error":"slow down"}
    r=random.random()
    if r<0.03: m=random.uniform(1.01,1.2)
    elif r<0.25: m=random.uniform(1.2,2.0)
    else: m=random.uniform(2.0,6.0)
    return {"crash_at":round(m,2),"rtp":int(RTP_CRASH*100)}

@app.post("/casino/dice")
async def dice(p:dict):
    uid=p["user"]
    if not can_play(uid): return {"error":"slow down"}
    roll=random.randint(1,100)
    win=roll>52
    return {"roll":roll,"win":win,"rtp":int(RTP_DICE*100)}

# ===================== BUY TON =====================
@app.post("/buy/ton")
async def buy_ton(p:dict):
    bx=p["ton"]*BX_RATE_TON
    async with (await db()).acquire() as c:
        await c.execute("UPDATE users SET bx=bx+$1 WHERE id=$2",bx,p["user"])
        await c.execute("UPDATE proof_cache SET total_ton=total_ton+$1,total_bx=total_bx+$2,updated_at=now() WHERE id=1",p["ton"],bx)
    return {"ok":True,"bx":bx}

# ===================== USDT APPROVE =====================
@app.post("/buy/usdt")
async def buy_usdt(p:dict):
    async with (await db()).acquire() as c:
        await c.execute(
            "INSERT INTO usdt_orders(user_id,provider,amount,proof) VALUES($1,$2,$3,$4)",
            p["user"],p["provider"],p["amount"],p.get("proof","")
        )
    return {"pending":True}

@app.post("/admin/usdt/approve")
async def usdt_approve(p:dict, req:Request):
    if p["admin"] not in ADMIN_IDS or req.client.host not in ADMIN_IP_WHITELIST:
        return {"ok":False}
    async with (await db()).acquire() as c:
        r=await c.fetchrow("SELECT user_id,amount FROM usdt_orders WHERE id=$1 AND status='pending'",p["order_id"])
        if not r: return {"ok":False}
        bx=float(r["amount"])*BX_RATE_USDT
        await c.execute("UPDATE users SET bx=bx+$1 WHERE id=$2",bx,r["user_id"])
        await c.execute("UPDATE usdt_orders SET status='approved' WHERE id=$1",p["order_id"])
        await c.execute("UPDATE proof_cache SET total_usdt=total_usdt+$1,total_bx=total_bx+$2,updated_at=now() WHERE id=1",float(r["amount"]),bx)
    return {"ok":True,"bx":bx}

# ===================== WITHDRAW TON =====================
@app.post("/withdraw/ton")
async def withdraw_ton(p:dict):
    uid=p["user"]; ton=float(p["ton"]); addr=p["address"]
    if ton<MIN_WITHDRAW_TON or ton>MAX_WITHDRAW_TON: return {"ok":False,"msg":"limits"}
    async with (await db()).acquire() as c:
        used=await c.fetchval("""SELECT COALESCE(SUM(ton),0) FROM ton_withdrawals
                                 WHERE user_id=$1 AND created_at>now()-interval '24 hours'""",uid)
        if float(used)+ton>DAILY_WITHDRAW_LIMIT: return {"ok":False,"msg":"daily limit"}
        u=await c.fetchrow("SELECT bx FROM users WHERE id=$1",uid)
        need=ton/BX_TO_TON
        if not u or u["bx"]<need: return {"ok":False,"msg":"no bx"}
        await c.execute("UPDATE users SET bx=bx-$1 WHERE id=$2",need,uid)
        await c.execute("INSERT INTO ton_withdrawals(user_id,ton,bx,address) VALUES($1,$2,$3,$4)",uid,ton,need,addr)
    return {"ok":True,"status":"pending"}

# ===================== ADMIN PANEL =====================
@app.get("/admin/pending")
async def admin_pending(admin:int, req:Request):
    if admin not in ADMIN_IDS or req.client.host not in ADMIN_IP_WHITELIST:
        return {"ok":False}
    async with (await db()).acquire() as c:
        w=await c.fetch("SELECT * FROM ton_withdrawals WHERE status='pending'")
        u=await c.fetch("SELECT * FROM usdt_orders WHERE status='pending'")
    return {"withdraws":[dict(x) for x in w],"usdt":[dict(x) for x in u]}

# ===================== PROOF =====================
@app.get("/proof")
async def proof():
    async with (await db()).acquire() as c:
        return dict(await c.fetchrow("SELECT * FROM proof_cache WHERE id=1"))

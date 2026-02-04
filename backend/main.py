from fastapi import FastAPI, Cookie, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
import jwt
import datetime

app = FastAPI()

SECRET_KEY = "SUPER_SECRET_KEY"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Mock Database Dictionary
users_db = {
    "shravanp": {
        "netid": "shravanp",
        "hashed_password": hash_password("password123"),
        "orgs": ["Engineering", "Research Lab"]
    },
    "illini2026": {
        "netid": "illini2026",
        "hashed_password": hash_password("orange_and_blue"),
        "orgs": ["Marching Band", "ACM"]
    }
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/internal/authenticate")
async def authenticate(data: dict = Body(...)):
    netid = data.get("netid")
    password = data.get("password")

    user = users_db.get(netid)
    
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT
    payload = {
        "sub": netid,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return {"token": token}


@app.get("/api/orgs")
async def get_orgs(auth_token: str = Cookie(None)):
    if not auth_token:
        raise HTTPException(status_code=401, detail="No auth cookie found")
    
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms=["HS256"])
        netid = payload["sub"]
        
        user_data = users_db.get(netid)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "user": netid,
            "orgs": user_data["orgs"]
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
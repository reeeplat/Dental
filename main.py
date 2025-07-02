from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS 허용 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중 모두 허용, 운영 시 도메인 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 간단한 유저 DB (실제론 DB 연동)
fake_users_db = {
    "test@example.com": {
        "username": "test@example.com",
        "password": "1234",  # 실제론 해싱 필요
    }
}

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@app.post("/doctor/login", response_model=TokenResponse)
async def login(username: str = Form(...), password: str = Form(...)):
    user = fake_users_db.get(username)
    if not user or user["password"] != password:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    # 실제론 JWT 토큰 생성 등 인증 로직 필요
    fake_token = "dummy-access-token"
    return {"access_token": fake_token, "token_type": "bearer"}

# 루트 경로 추가 (테스트용)
@app.get("/")
async def root():
    return {"message": "서버가 정상 작동 중입니다."}








from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


from routers.auth_router import auth_router, get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.10:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["auth"])

@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    if not user['username']:
        raise HTTPException(status_code=401, detail='Unauthoraized')
    else:
        return {"username": user['username']}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

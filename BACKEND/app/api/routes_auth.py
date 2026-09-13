from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import LoginRequest, Token, StudentProfile
from app.database import DataRepository, DatabaseSession
from app.security import verify_password, create_access_token, get_current_student

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(req: LoginRequest):
    student = DataRepository.get_student_by_username(req.username)
    if not student or not verify_password(req.password, student["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid registration number or password. (Note: Student Regd. No, e.g. '251FA04E03', is their login password)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_payload = {
        "sub": student["user_id"],
        "student_id": student["student_id"],
        "roll_no": student["roll_no"],
        "full_name": student["full_name"],
        "programme_code": student["programme_code"]
    }
    
    token = create_access_token(token_payload)
    return Token(
        access_token=token,
        token_type="bearer",
        expires_in=86400,
        student_id=student["student_id"],
        roll_no=student["roll_no"],
        full_name=student["full_name"],
        programme_code=student["programme_code"]
    )

@router.get("/me", response_model=StudentProfile)
async def get_my_profile(current_student: dict = Depends(get_current_student)):
    session = DatabaseSession(student_id=current_student["student_id"], user_id=current_student["user_id"])
    profile = DataRepository.get_student_profile(session)
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return StudentProfile(**profile)

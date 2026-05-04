from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminBase(BaseModel):
    username: str
    email: EmailStr

class AdminCreate(AdminBase):
    password: str

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class AdminResponse(AdminBase):
    id: int

    class Config:
        from_attributes = True

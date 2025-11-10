from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class ContactStatus(str, Enum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=2000)
    subject: Optional[str] = Field(None, max_length=200)

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: str
    status: ContactStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class ContactInDB(ContactBase):
    id: str
    status: ContactStatus
    created_at: datetime

class ContactUpdate(BaseModel):
    status: Optional[ContactStatus] = None

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
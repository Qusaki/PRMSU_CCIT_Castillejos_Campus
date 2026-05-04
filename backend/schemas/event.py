from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: str
    event_date: datetime
    venue: str

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    venue: Optional[str] = None

class EventResponse(EventBase):
    id: int
    image_urls: List[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

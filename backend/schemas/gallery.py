from datetime import datetime
from pydantic import BaseModel

class GalleryResponse(BaseModel):
    id: int
    filename: str
    file_url: str
    created_at: datetime

    class Config:
        from_attributes = True

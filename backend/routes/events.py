import uuid
import json
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from supabase import create_client, Client

from core.database import get_db
from core.config import settings
from models.admin import Admin
from models.event import Event
from schemas.event import EventResponse, EventUpdate
from routes.auth import get_current_admin

router = APIRouter()

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

@router.get("/", response_model=List[EventResponse])
def get_all_events(db: Session = Depends(get_db)):
    """Public route: Anyone can view the list of events"""
    return db.query(Event).order_by(Event.event_date.desc()).all()

@router.get("/{event_id}", response_model=EventResponse)
def get_single_event(event_id: int, db: Session = Depends(get_db)):
    """Public route: Get metadata of a single event"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=EventResponse)
def create_event(
    title: str = Form(...),
    description: str = Form(...),
    event_date: datetime = Form(...),
    venue: str = Form(...),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin Only: Create a new event with optional images"""
    image_urls = []
    
    if images and images[0].filename != "":
        for image in images:
            if not image.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail=f"File '{image.filename}' is not an image.")
                
            file_extension = image.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            try:
                file_contents = image.file.read()
                # Push file binary directly to Supabase Storage in events bucket
                supabase.storage.from_(settings.supabase_events_bucket).upload(
                    file=file_contents,
                    path=unique_filename,
                    file_options={"content-type": image.content_type}
                )
                
                # Retrieve the absolute Public URL from Supabase
                public_url = supabase.storage.from_(settings.supabase_events_bucket).get_public_url(unique_filename)
                image_urls.append(public_url)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to upload {image.filename}: {str(e)}")

    new_event = Event(
        title=title,
        description=description,
        event_date=event_date,
        venue=venue,
        image_urls=image_urls
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin Only: Update text fields of an event"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    update_data = event_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)
        
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin Only: Delete an event and its associated images from Supabase Storage"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    try:
        # Delete images from Supabase bucket
        if event.image_urls:
            filenames_to_delete = []
            for url in event.image_urls:
                # Extract filename from public URL
                # Example URL: https://xyz.supabase.co/storage/v1/object/public/events/filename.jpg
                filename = url.split("/")[-1]
                filenames_to_delete.append(filename)
                
            if filenames_to_delete:
                supabase.storage.from_(settings.supabase_events_bucket).remove(filenames_to_delete)
        
        # Delete from Database
        db.delete(event)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")
        
    return None

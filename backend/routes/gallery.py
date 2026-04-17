import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from supabase import create_client, Client

from core.database import get_db
from core.config import settings
from models.admin import Admin
from models.gallery import Gallery
from schemas.gallery import GalleryResponse
from routes.auth import get_current_admin

router = APIRouter()

# Initialize the Supabase Python SDK Client
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

@router.get("/", response_model=List[GalleryResponse])
def get_all_images(db: Session = Depends(get_db)):
    """Public route: Anyone can view the list of images"""
    return db.query(Gallery).all()

@router.get("/{image_id}", response_model=GalleryResponse)
def get_single_image(image_id: int, db: Session = Depends(get_db)):
    """Public route: Get metadata of a single image"""
    image = db.query(Gallery).filter(Gallery.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

@router.post("/upload", response_model=List[GalleryResponse])
def upload_images(
    images: List[UploadFile] = File(...), 
    db: Session = Depends(get_db), 
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin Only: Upload multiple images to Supabase Gallery bucket"""
    uploaded_records = []
    
    for image in images:
        # Secure validation: enforce image files only
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"File '{image.filename}' is not an image.")
            
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        try:
            file_contents = image.file.read()
            # Push file binary directly to Supabase Storage
            supabase.storage.from_(settings.supabase_bucket).upload(
                file=file_contents,
                path=unique_filename,
                file_options={"content-type": image.content_type}
            )
            
            # Retrieve the absolute Public URL from Supabase
            public_url = supabase.storage.from_(settings.supabase_bucket).get_public_url(unique_filename)
            
            # Save the metadata into the PostgreSQL Database
            new_gallery_item = Gallery(
                filename=unique_filename,
                file_url=public_url
            )
            db.add(new_gallery_item)
            db.commit()
            db.refresh(new_gallery_item)
            uploaded_records.append(new_gallery_item)
            
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to upload {image.filename}: {str(e)}")
            
    return uploaded_records

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    image_id: int, 
    db: Session = Depends(get_db), 
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin Only: Delete an image permanently from PostgreSQL and Supabase Storage"""
    image = db.query(Gallery).filter(Gallery.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
        
    try:
        # Delete from Supabase bucket
        supabase.storage.from_(settings.supabase_bucket).remove([image.filename])
        
        # Delete from Database
        db.delete(image)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")
        
    return None

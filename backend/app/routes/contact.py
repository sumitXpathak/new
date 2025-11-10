from fastapi import APIRouter, HTTPException, status 
from datetime import datetime
from bson import ObjectId 
from app.models import ContactCreate, ContactResponse, APIResponse, ContactStatus, ContactUpdate
from app.database import db
from app.email_services import email_service

router = APIRouter()

@router.post("/contact", response_model=APIResponse)
async def create_contact(contact: ContactCreate):
    """
    Create a new contact form submission
    """
    try:
        collection = db.get_collection("contacts")
        
        # Prepare contact data
        contact_data = contact.dict()
        contact_data["status"] = ContactStatus.NEW
        contact_data["created_at"] = datetime.utcnow()
        
        # Insert into database
        result = await collection.insert_one(contact_data)
        
        if result.inserted_id:
            # Send notifications
            await email_service.send_contact_notification(contact_data)
            await email_service.send_auto_reply(contact_data)
            
            return APIResponse(
                success=True,
                message="Thank you for your message! I'll get back to you soon.",
                data={"contact_id": str(result.inserted_id)}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save contact message"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/contacts", response_model=dict)
async def get_contacts(skip: int = 0, limit: int = 50):
    """
    Get all contact submissions (for admin use)
    """
    try:
        collection = db.get_collection("contacts")
        
        # Get total count
        total = await collection.count_documents({})
        
        # Get contacts with pagination
        cursor = collection.find().sort("created_at", -1).skip(skip).limit(limit)
        contacts = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for contact in contacts:
            contact["_id"] = str(contact["_id"])
        
        return {
            "success": True,
            "data": {
                "contacts": contacts,
                "total": total,
                "skip": skip,
                "limit": limit
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contacts: {str(e)}"
        )

@router.get("/contacts/{contact_id}", response_model=dict)
async def get_contact(contact_id: str):
    """
    Get a specific contact by ID
    """
    try:
        collection = db.get_collection("contacts")
        
        if not ObjectId.is_valid(contact_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid contact ID"
            )
        
        contact = await collection.find_one({"_id": ObjectId(contact_id)})
        
        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found"
            )
        
        contact["_id"] = str(contact["_id"])
        return {"success": True, "data": contact}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contact: {str(e)}"
        )

@router.patch("/contacts/{contact_id}", response_model=APIResponse)
async def update_contact_status(contact_id: str, update_data: ContactUpdate):
    """
    Update contact status (for admin use)
    """
    try:
        collection = db.get_collection("contacts")
        
        if not ObjectId.is_valid(contact_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid contact ID"
            )
        
        result = await collection.update_one(
            {"_id": ObjectId(contact_id)},
            {"$set": update_data.dict(exclude_unset=True)}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found or no changes made"
            )
        
        return APIResponse(
            success=True,
            message="Contact status updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update contact: {str(e)}"
        )

@router.delete("/contacts/{contact_id}", response_model=APIResponse)
async def delete_contact(contact_id: str):
    """
    Delete a contact submission (for admin use)
    """
    try:
        collection = db.get_collection("contacts")
        
        if not ObjectId.is_valid(contact_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid contact ID"
            )
        
        result = await collection.delete_one({"_id": ObjectId(contact_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found"
            )
        
        return APIResponse(
            success=True,
            message="Contact deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete contact: {str(e)}"
        )
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import httpx
import asyncio


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Lead(BaseModel):
    user_id: str = Field(alias="user id ")
    name: str = Field(alias="name ")
    gym_name: str = Field(alias="gym name ")
    phone_number: str = Field(alias="phone number ")
    status: str = Field(alias="status ")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True

class LeadResponse(BaseModel):
    user_id: str
    name: str
    gym_name: str
    phone_number: str
    status: str
    created_at: datetime

class ApiConfigRequest(BaseModel):
    api_url: str

class ApiConfigResponse(BaseModel):
    success: bool
    message: str
    total_leads: Optional[int] = None

class StatsResponse(BaseModel):
    total_leads: int
    new_leads: int
    qualified_leads: int
    converted_leads: int
    lost_leads: int

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Google Sheets API Configuration
GOOGLE_SHEETS_API_URL = "https://opensheet.elk.sh/1RsvlpFEVERK8myvdbQnlbt6yB2uz6gPHe9PqDpIbEdw/Sheet1"

# Helper function to fetch data from Google Sheets
async def fetch_google_sheets_data(api_url: str = None) -> List[Dict[str, Any]]:
    """Fetch data from Google Sheets API"""
    url = api_url or GOOGLE_SHEETS_API_URL
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if not isinstance(data, list):
                raise HTTPException(status_code=400, detail="Invalid data format from Google Sheets")
            
            return data
    except httpx.HTTPError as e:
        logger.error(f"Error fetching Google Sheets data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch data from Google Sheets: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Helper function to process and store leads
async def process_and_store_leads(raw_data: List[Dict[str, Any]]) -> List[LeadResponse]:
    """Process raw Google Sheets data and store in database"""
    leads = []
    
    for item in raw_data:
        try:
            # Clean and validate data
            lead_data = {
                "user_id": item.get("user id ", "").strip(),
                "name": item.get("name ", "").strip(),
                "gym_name": item.get("gym name ", "").strip(),
                "phone_number": item.get("phone number ", "").strip(),
                "status": item.get("status ", "").strip().lower(),
                "created_at": datetime.utcnow()
            }
            
            # Skip empty records
            if not lead_data["name"] or not lead_data["phone_number"]:
                continue
            
            # Check if lead already exists
            existing_lead = await db.leads.find_one({"user_id": lead_data["user_id"]})
            
            if not existing_lead:
                # Insert new lead
                await db.leads.insert_one(lead_data)
                logger.info(f"Inserted new lead: {lead_data['name']}")
            else:
                # Update existing lead
                await db.leads.update_one(
                    {"user_id": lead_data["user_id"]},
                    {"$set": {
                        "name": lead_data["name"],
                        "gym_name": lead_data["gym_name"],
                        "phone_number": lead_data["phone_number"],
                        "status": lead_data["status"]
                    }}
                )
                logger.info(f"Updated existing lead: {lead_data['name']}")
            
            # Add to response list
            leads.append(LeadResponse(**lead_data))
            
        except Exception as e:
            logger.error(f"Error processing lead data: {item} - Error: {e}")
            continue
    
    return leads

# Helper function to calculate stats
async def calculate_lead_stats() -> StatsResponse:
    """Calculate lead statistics"""
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    qualified_leads = await db.leads.count_documents({"status": {"$in": ["qualified", "contacted"]}})
    converted_leads = await db.leads.count_documents({"status": "converted"})
    lost_leads = await db.leads.count_documents({"status": "lost"})
    
    return StatsResponse(
        total_leads=total_leads,
        new_leads=new_leads,
        qualified_leads=qualified_leads,
        converted_leads=converted_leads,
        lost_leads=lost_leads
    )
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

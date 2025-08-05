from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load .env for GOOGLE_API_KEY
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set in .env")

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

# Use Gemini Flash for both text & vision
model = genai.GenerativeModel("gemini-1.5-flash")

@app.get("/")
def read_root():
    return {"status": "API is running 🚀"}

@app.post("/api/trip-planner")
async def plan_trip(data: TextInput):
    try:
        prompt = f"""
You are an expert Tour Planner. Create a detailed itinerary:
- Location: {data.text}
- Include daily activities, hidden gems, and transportation
- Suggest best time to visit
- Provide hotel and restaurant recommendations
Return in markdown format with clear sections.
"""
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trip planner error: {str(e)}")

@app.post("/api/weather-forecast")
async def forecast_weather(data: TextInput):
    try:
        prompt = f"""
Provide a detailed 7-day weather forecast for: {data.text}
Include:
- Temperature (high/low)
- Precipitation chance
- Humidity
- Wind speed/direction
- UV index
- Sunrise/sunset times
Format as markdown table.
"""
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather forecast error: {str(e)}")

@app.post("/api/accommodation-planner")
async def plan_accommodation(data: TextInput):
    try:
        prompt = f"""
Suggest accommodations and dining for: {data.text}
Provide:
1. Top 3 hotels (mid-range) with:
   - Address
   - Average price
   - Rating
2. Top 3 restaurants with:
   - Cuisine type
   - Price range
   - Must-try dishes
Format in markdown with clear sections.
"""
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Accommodation planner error: {str(e)}")

@app.post("/api/location-finder")
async def location_finder(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        
        contents = await file.read()
        image = {
            "mime_type": file.content_type,
            "data": contents
        }

        prompt = """
You are an expert geolocation analyzer. For the provided image:
1. Identify the location/landmark (be specific)
2. If recognizable, provide:
   - Exact name
   - Country/City
   - GPS coordinates (if possible)
   - Brief historical context
3. If unrecognizable, state "Unknown location"
Format response in markdown.
"""
        response = model.generate_content([prompt, image])
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location finder error: {str(e)}")

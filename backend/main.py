import psycopg2
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from google import genai
import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

class GenerateRequest(BaseModel):
    topic: str
    platform: str
    tone: str
    length: str

class SavePostRequest(BaseModel):
    topic: str
    platform: str
    tone: str
    length: str
    content: str

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/generate-post")
def generate_post(data: GenerateRequest):
    try:
        prompt = f"Generate a {data.platform} post in a {data.tone} tone about {data.topic}. Keep it {data.length}."

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {"response": response.text}

    except Exception as e:
     print(f"API Error: {e}")
    return {
        "response": f"(AI busy) Here's a sample {data.platform} post about {data.topic} in a {data.tone} tone. Keep it {data.length}."
    }

@app.post("/save-post")
def save_post(data: SavePostRequest):
    try:
        cursor.execute(
            "INSERT INTO posts (topic, platform, tone, content) VALUES (%s, %s, %s, %s)",
            (data.topic, data.platform, data.tone, data.content)
        )
        conn.commit()

        return {"message": "Post saved successfully"}

    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save post")

@app.get("/posts")
def get_posts():
    try:
        cursor.execute("SELECT id, topic, platform, tone, content, created_at FROM posts ORDER BY id DESC")
        rows = cursor.fetchall()

        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "topic": row[1],
                "platform": row[2],
                "tone": row[3],
                "content": row[4],
                "created_at": str(row[5])
            })

        return {"posts": posts}

    except Exception as e:
        print(f"DB Fetch Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch posts")
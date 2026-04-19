import psycopg2 #database connection
from fastapi import FastAPI, HTTPException  #Fasstapi framework
from pydantic import BaseModel #data validation
from fastapi.middleware.cors import CORSMiddleware # allow frontend requests without crashing 

from google import genai #GeminiAI
import os #Access environment variables
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware( #enable cors so frontend can talk to backend
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

class GenerateRequest(BaseModel): #request model for generating post
    topic: str
    platform: str
    tone: str
    length: str

class SavePostRequest(BaseModel): #request model for saving post
    topic: str
    platform: str
    tone: str
    length: str
    content: str

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/generate-post") #generate post using GeminiAI
def generate_post(data: GenerateRequest):
    try:
        prompt = f"""
Generate ONE {data.platform} post about "{data.topic}".

Tone: {data.tone}
Length: {data.length}

Length rules (STRICT):
Short - 1-2 lines only
Medium - 3-5 lines
Long - multiple paragraphs

IMPORTANT RULES:
Generate ONLY ONE post
Do NOT generate multiple versions
Do NOT include labels like Short/Medium/Long
Do NOT show examples
Follow the selected length EXACTLY
Return only the final post

Style guidelines:
LinkedIn - professional and structured
Twitter - concise and punchy
Instagram - engaging, may include light emojis

Use placeholders like [Your Name], [Company Name] where appropriate.
Add relevant hashtags at the end.
"""
        #Call GeminiAPI
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        #return generated content
        return {"response": response.text}

    except Exception as e:
     print(f"API Error: {e}")
    return {           #Fallback response if ai fails
        "response": f"(AI busy) Here's a sample {data.platform} post about {data.topic} in a {data.tone} tone. Keep it {data.length}."
    }

@app.post("/save-post")  #save posts to database
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

@app.get("/posts")   #Fetch all saved posts
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
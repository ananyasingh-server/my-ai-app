# AI Content Generator

This is a simple full stack web app that generates social media posts using AI.
Users can enter a topic, choose platform, tone and length and generate a post.
They can also save posts and view them later.

---

## Tech Stack

* Frontend: React.js
* Backend: FastAPI (Python)
* Database: PostgreSQL
* AI: Google Gemini API

---

## Features

* Generate posts using AI
* Choose platform (LinkedIn, Twitter, Instagram)
* Choose tone (Professional, Casual, Funny)
* Choose length (Short, Medium, Long)
* Copy the generated post
* Save the post to database
* View saved posts

---

## Project Structure

```
my-ai-app/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── public/
│   └── src/
│       └── App.js
│
└── README.md
```


## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/ananyasingh-server/my-ai-app.git
cd my-ai-app
```


## Backend Setup

### 2. Go to backend folder

```
cd backend
```

### 3. Create virtual environment

```
python -m venv venv
```

### 4. Activate environment

Windows:

```
venv\Scripts\activate
```

Mac/Linux:

```
source venv/bin/activate
```


### 5. Install dependencies

```
pip install fastapi uvicorn psycopg2 python-dotenv google-generativeai
```

### 6. Create a `.env` file inside backend folder

Add your own API key and database connection:

```
GEMINI_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

(Use your own credentials. They are not included in this project.)

### 7. Run backend

```
uvicorn main:app --reload
```

Backend runs on:
http://127.0.0.1:8000


## Frontend Setup

### 8. Go to frontend folder

```
cd frontend
```

### 9. Install dependencies

```
npm install
```

### 10. Run frontend

```
npm start
```

Frontend runs on:
http://localhost:3000


## API Endpoints

* POST /generate-post → generate AI content
* POST /save-post → save post
* GET /posts → get saved posts


## Notes

* Used prompt engineering to control tone, length and platform
* Inline styling used for quick UI design
* Basic validation added to avoid empty inputs


## Demo

https://drive.google.com/file/d/17N-GdwK1rCC3qFZQQ0q8Xs8AvXTBURB5/view?usp=sharing


## Author

Ananya

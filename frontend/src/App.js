import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("LinkedIn");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  //handles API call to backend and generates AI post
  const handleSubmit = async () => {
    if (!topic.trim()) {
    setError("Please enter a topic");
    return;
  }
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          length,
        }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Failed to connect to backend.");
    }

    setLoading(false);
  };

  //copy the generated content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

//sends the post to backend to store in database
  const handleSave = async () => {
    if (!response) {
    alert("Generate a post first before saving");
    return;
  }
    try {
      const res = await fetch("http://127.0.0.1:8000/save-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          length,
          content: response,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Failed to save post");
    }
  };

//fetches saved posts from backend and displays them
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column", 
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{
              marginBottom: "20px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "600"
       }}>
       AI Content Generator 
       </h2>

        {/* Topic */}
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

{error && (
  <p style={{ color: "red", fontSize: "14px", marginTop: "-10px", marginBottom: "10px" }}>
  {error}
  </p>
)}

        {/* Platform */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <option>LinkedIn</option>
          <option>Twitter</option>
          <option>Instagram</option>
        </select>

        {/* Tone */}
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <option>Professional</option>
          <option>Casual</option>
          <option>Funny</option>
        </select>

        {/* Length */}
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </select>

        {/* Generate */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Generating..." : "Generate Post"}
        </button>

        {/* View Posts Button */}
        <button
          onClick={fetchPosts}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#16a34a",
            transition: "0.2s",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Saved Posts
        </button>

        {/* Output */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            lineHeight: "1.6",
            minHeight: "60px",
            position: "relative",
          }}
        >
          {response && (
            <>
              <button
                onClick={handleCopy}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={handleSave}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "80px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </>
          )}

          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      </div>

      {/*Saved Posts Section*/}
      {posts.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            width: "400px",
          }}
        >
          <h3>Saved Posts</h3>

          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "white",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <strong>{post.platform}</strong> | {post.tone}
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
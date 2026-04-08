import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ask AI</h2>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type something..."
      />

      <button onClick={handleSubmit}>Ask</button>

      <ReactMarkdown>{response}</ReactMarkdown>
    </div>
  );
}

export default App;
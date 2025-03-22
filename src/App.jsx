import { useState, useRef } from "react";
import { marked } from "marked";
import "./App.css";

export default function App() {
  const [markdown, setMarkdown] = useState("# Hello, Markdown!\n\nType some **Markdown** here.\n\n- List item 1\n- List item 2\n\n```\ncode block\n```");
  const previewRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    if (previewRef.current) {
      const previewElement = previewRef.current;
      const scrollPosition = scrollPercentage * (previewElement.scrollHeight - previewElement.clientHeight);
      previewElement.scrollTop = scrollPosition;
    }
  };

  return (
    <div className="container">
      <div className="editor-container">
        <textarea
          className="editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onScroll={handleScroll}
        />
        <div
          ref={previewRef}
          className="preview"
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
      </div>
    </div>
  );
}

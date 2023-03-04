import React, { useState } from "react";

export default function Summarize({ chapters }: { chapters: string[] | null }) {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [summary, setSummary] = useState("");

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setSummary(`Summary of ${chapter} chapter.`);
    // Call API or function to generate summary based on selected chapter
  };

  return (
    <div className="h-full flex flex-col text-white">
      {chapters == null ? (
        <div className="flex-1 overflow-y-scroll">Loading chapters...</div>
      ) : (
        <div className="flex-1 overflow-y-scroll">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              className={`py-2 px-4 rounded-lg mb-2 ${
                selectedChapter === chapter
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
              onClick={() => handleChapterSelect(chapter)}
            >
              {chapter}
            </button>
          ))}
          {summary && (
            <div className="py-2 px-4 rounded-lg max-w-xs mb-2 ml-auto bg-gray-300">
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";

export default function Summarize({
  chapters,
  fileName,
}: {
  chapters: string[] | null;
  fileName: string;
}) {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [botIsTalking, setBotIsTalking] = useState(false);

  const handleChapterSelect = (chapter: string) => {
    setBotIsTalking(true);
    setSelectedChapter(chapter);

    const message: Message = {
      author: "user",
      content: `Summarize chapter ${chapter}. Give me an in-depth overview and explain the main points.`,
    };
    const updatedMessagesArray = [...messages, message];

    setMessages([...messages, message]);

    // Call API or function to generate summary based on selected chapter

    var formdata = new FormData();
    formdata.append("filename", fileName);
    formdata.append(
      "question",
      "Summarize chapter " +
        chapter +
        ". Give me a succinct overview and explain the main points."
    );

    var requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // @ts-ignore
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "generate", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setMessages([
          ...updatedMessagesArray,
          {
            author: "bot",
            content: result,
          },
        ]);
        setBotIsTalking(false);
      })
      .catch((error) => {
        console.log("error", error);
        setBotIsTalking(false);
      });
  };

  return (
    <div className="h-screen flex flex-col text-white">
      {chapters == null ? (
        <div className="flex-1 text-white ">Loading chapters...</div>
      ) : (
        <div>
          {chapters.map((chapter) => (
            <button
              key={chapter}
              disabled={botIsTalking}
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

          <div className="flex-1 h-screen space-y-2 overflow-y-scroll">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {botIsTalking && (
              <div className="py-2 px-4 rounded-lg max-w-xs mb-2 ml-auto bg-blue-500 text-white">
                <p className="text-right">Teach me is replying...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const [showMessage, setShowMessage] = useState(false);

  const isUser = message.author === "user";
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageRef.current;
    if (element) {
      setShowMessage(true);
    }
  }, []);

  return (
    <div
      ref={messageRef}
      className={`py-2 px-4 rounded-lg max-w-xs mb-2 ${
        isUser
          ? "ml-auto bg-gradient-to-br from-blue-400 to-blue-500 text-white"
          : "mr-auto bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500"
      } ${
        showMessage
          ? "opacity-100 transition-opacity duration-500"
          : "opacity-0"
      }`}
    >
      <p className={`${isUser ? "text-right" : ""}`}>{message.content}</p>
    </div>
  );
}

type Message = {
  author: "user" | "bot";
  content: string;
};

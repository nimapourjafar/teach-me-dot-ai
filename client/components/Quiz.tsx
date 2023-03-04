import React, { useState } from "react";

export default function Quiz({ fileName }: { fileName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgTxt, setMsgTxt] = useState("");
  const [botIsTalking, setBotIsTalking] = useState(false);

  const addMessage = (message: Message) => {
    setBotIsTalking(true);
    console.log("message", message);
    setMessages([...messages, message]);

    const updatedMessagesArray = [...messages, message];
    var formdata = new FormData();
    console.log(fileName);
    console.log(message.content);
    formdata.append("filename", fileName);
    formdata.append("question", message.content);

    var requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    // @ts-ignore
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
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-scroll">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="flex flex-row items-center">
        <input
          disabled={botIsTalking}
          className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          type="text"
          placeholder={
            botIsTalking
              ? `Teach me is replying...`
              : `Type a subject to be quizzed on...`
          }
          onChange={(event) => {
            setMsgTxt(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.value = "";
              addMessage({
                author: "user",
                content: msgTxt,
              });
            }
          }}
        />
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded-lg ml-2"
          onClick={() => {
            addMessage({
              author: "user",
              content: msgTxt,
            });
          }}
          disabled={botIsTalking}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.author === "user";
  return (
    <div
      className={`py-2 px-4 rounded-lg max-w-xs mb-2 ${
        isUser ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-300"
      }`}
    >
      <p className={`${isUser ? "text-right" : ""}`}>{message.content}</p>
    </div>
  );
}

function QuizMessage({ quiz }: { quiz: QuizContent }) {
  return <></>;
}

type Message = {
  author: "user" | "bot";
  content: string;
  quiz?: QuizContent;
};

type QuizContent = {
  question: string;
  options: QuizQuestion[];
};

type QuizQuestion = {
  option: string;
  explanation: string;
  isCorrect: boolean;
};

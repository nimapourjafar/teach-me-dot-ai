import React, { useEffect, useRef, useState } from "react";

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
    // @ts-ignore
    formdata.append("quiz_subject", message.content);

    var requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    // @ts-ignore
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "make-quiz", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const parsedResult: QuizContent = JSON.parse(result);
        console.log("parsedResult", parsedResult);
        setMessages([
          ...updatedMessagesArray,
          {
            author: "bot",
            isQuiz: true,
            quiz: parsedResult,
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
                isQuiz: false,
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
              isQuiz: false,
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
  const [showMessage, setShowMessage] = useState(false);
  const isUser = message.author === "user";
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = messageRef.current;
    if (element) {
      setShowMessage(true);
    }
  }, []);

  if (message.isQuiz) {
    // @ts-ignore
    return QuizMessage({ quiz: message.quiz });
  }
  

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
function QuizMessage({ quiz }: { quiz: QuizContent }) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  function handleOptionClick(index: number) {
    if (selectedOptionIndex === null) {
      setSelectedOptionIndex(index);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-medium mb-4">{quiz.question}</h2>
      <ul>
        {/* @ts-ignore */}
        {quiz.options.map((option, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer ${
              selectedOptionIndex !== null ? "opacity-50" : ""
            }`}
            onClick={() => handleOptionClick(index)}
          >
            <div
              className={`flex justify-between items-center ${
                selectedOptionIndex === index ? "bg-green-100" : ""
              }`}
            >
              <span className="mr-2">{option.option}</span>
              {selectedOptionIndex !== null && (
                <span
                  className={`${
                    option.isCorrect ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  {option.isCorrect ? "Correct" : "Incorrect"}
                </span>
              )}
            </div>
            {selectedOptionIndex === index && (
              <p className="mt-2 text-sm text-gray-500">{option.explanation}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type QuizContent = {
  question: string;
  options: QuizQuestion[];
};

type QuizQuestion = {
  option: string;
  explanation: string;
  isCorrect: boolean;
};

type Message = {
  author: "user" | "bot";
  content?: string;
  isQuiz: boolean;
  quiz?: QuizContent;
};

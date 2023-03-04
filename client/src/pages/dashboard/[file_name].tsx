import React, { useState } from "react";
import Chat from "../../../components/Chat";
import Quiz from "../../../components/Quiz";
import Summarize from "../../../components/Summarize";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  const [display, setDisplay] = useState<"chat" | "summarize" | "quiz">("chat");

  const { file_name } = router.query;

  const renderComponent = () => {
    switch (display) {
      case "chat":
        // @ts-ignore
        return <Chat fileName={file_name || ""} />;
      case "summarize":
        return <Summarize />;
      case "quiz":
        return <Quiz />;
      default:
        // @ts-ignore
        return <Chat fileName={file_name || ""} />;
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/4 bg-gray-800 text-gray-100">
        <div className="flex flex-col justify-center">
          <button
            className={`py-2 px-4 ${display === "chat" ? "bg-gray-900" : ""}`}
            onClick={() => setDisplay("chat")}
          >
            Chat
          </button>
          <button
            className={`py-2 px-4 ${
              display === "summarize" ? "bg-gray-900" : ""
            }`}
            onClick={() => setDisplay("summarize")}
          >
            Summarize
          </button>
          <button
            className={`py-2 px-4 ${display === "quiz" ? "bg-gray-900" : ""}`}
            onClick={() => setDisplay("quiz")}
          >
            Quiz
          </button>
        </div>
      </div>
      <div className="w-3/4 p-4">{renderComponent()}</div>
    </div>
  );
};

export default Dashboard;

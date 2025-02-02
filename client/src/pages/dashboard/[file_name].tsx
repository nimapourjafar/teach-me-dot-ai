import React, { useEffect, useState } from "react";
import Chat from "../../../components/Chat";
import Quiz from "../../../components/Quiz";
import Summarize from "../../../components/Summarize";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();
  const [display, setDisplay] = useState<"chat" | "summarize" | "quiz">("chat");
  const [chapters, setChapters] = useState<string[]>([]);
  const { file_name } = router.query;

  useEffect(() => {
    var formdata = new FormData();

    if (file_name == undefined) {
      return;
    }
    if (chapters.length > 0) {
      return;
    }

    // @ts-ignore
    formdata.append("filename", file_name);

    var requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // @ts-ignore
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "get-chapters", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        // @ts-ignore
        setChapters(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
  }, [file_name]);

  const renderComponent = () => {
    switch (display) {
      case "chat":
        // @ts-ignore
        return <Chat fileName={file_name || ""} />;
      case "summarize":
        // @ts-ignore
        return <Summarize chapters={chapters} fileName={file_name || ""} />;
      case "quiz":
        // @ts-ignore
        return <Quiz fileName={file_name || ""} />;
      default:
        // @ts-ignore
        return <Chat fileName={file_name || ""} />;
    }
  };

  return (
    <div className="flex flex-row h-screen overflow-y-clip">
      <div className="w-1/4 bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100">
        <div className="flex flex-col justify-center space-y-2 py-6">
          <button
            className={`py-2 px-4 hover:bg-gray-700 rounded-lg duration-200 ${
              display === "chat" ? "text-gray-300 font-bold" : ""
            }`}
            onClick={() => setDisplay("chat")}
          >
            Chat
          </button>
          <button
            className={`py-2 px-4 hover:bg-gray-700 rounded-lg duration-200 ${
              display === "summarize" ? "text-gray-300 font-bold" : ""
            }`}
            onClick={() => setDisplay("summarize")}
          >
            Summarize
          </button>
          <button
            className={`py-2 px-4 hover:bg-gray-700 rounded-lg duration-200 ${
              display === "quiz" ? "text-gray-300 font-bold" : ""
            }`}
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

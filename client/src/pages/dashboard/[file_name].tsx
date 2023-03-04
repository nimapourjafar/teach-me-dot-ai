import React, { useState } from "react";
import styles from "@/styles/Home.module.css";

const Dashboard = () => {
  const [display, setDisplay] = useState<"chat" | "summarize" | "quiz">("chat");
  return <div>Dashboard</div>;
};

export default Dashboard;

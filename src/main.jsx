import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Todo from "./Todo";

createRoot(document.getElementById("root")).render(<App />);

function App() {
  return <Todo />
}

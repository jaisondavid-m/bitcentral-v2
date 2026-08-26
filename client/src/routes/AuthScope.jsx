import React from "react";
import { StudentContext } from "../context/StudentContext.jsx";

export default function AuthScope({ children }) {
  return <StudentContext>{children}</StudentContext>;
}

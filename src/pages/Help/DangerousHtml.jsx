import React from "react";
import "./index.css";

export default function DangerousHtml({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
}

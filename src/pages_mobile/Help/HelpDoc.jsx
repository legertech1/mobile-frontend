import React from "react";
import { useParams } from "react-router-dom";
import { helpDocs } from "../../utils/helpDocs";

export default function HelpDoc() {
  const { id } = useParams();

  const doc = Object.values(helpDocs).find((doc) => doc.id === id);

  if (!doc) {
    return <div>404</div>;
  }
  let content = doc.content;

  return (
    <div className="">
      <div className="dangerous_html_cont">{content()}</div>
    </div>
  );
}

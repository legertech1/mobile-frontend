import React from "react";
import { Link } from "react-router-dom";
import { helpDocs } from "../../utils/helpDocs";
import Input from "../../components/Shared/Input";
import "./index.css";

export default function HelpCards({ setTab }) {
  const [query, setQuery] = React.useState("");
  let docs = Object.values(helpDocs);

  return (
    <div className="pass_cont">
      <div className="help_input">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search for help"
          className="search_input"
        />
      </div>
      <div className="cards_row">
        {docs
          .filter((tab) => tab.label.toLowerCase().includes(query))
          .map((tab) => (
            <div className="card" onClick={() => setTab(tab.id)}>
              <div className="card_label">{tab.label}</div>
              <div className="card_description">{tab.description}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { helpDocs } from "../../utils/helpDocs";
import Input from "../../components/Shared/Input";
import "./index.css";

export default function HelpCards() {
  const [query, setQuery] = React.useState("");
  let docs = Object.values(helpDocs);

  return (
    <div className="pass_cont">
      <h1 className="heading">How can we help you?</h1>
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
            <Link
              key={tab.id}
              to={tab.id ? `/help-doc/${tab.id}` : tab.link || "/"}
            >
              <div className="card">
                <div className="card_label">{tab.label}</div>
                <div className="card_description">{tab.description}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

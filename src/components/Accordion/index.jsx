import React from "react";
import "./index.css";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const AccordionItem = ({
  title,
  description,
  headerClass,
  isOpen,
  onHeaderClick,
  hideDropdown,
  bodyClass,
}) => {
  const toggleAccordion = () => {
    onHeaderClick && onHeaderClick();
  };

  return (
    <div
      className={`accordion-item ${bodyClass} ${
        isOpen ? "open select-accordian-item" : ""
      }`}
    >
      <div
        className={`accordion-title ${headerClass}`}
        onClick={toggleAccordion}
      >
        {typeof title === "string" ? (
          <p>{title}</p>
        ) : (
          <div className="accordion-title-content">{title}</div>
        )}

        {!hideDropdown && (
          <div className="accordion-icon">
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </div>
        )}
      </div>
      {isOpen && <div className="accordion-description">{description}</div>}
    </div>
  );
};

export default AccordionItem;

import React from "react";
import TableRowsSharpIcon from "@mui/icons-material/TableRowsSharp";
import WindowSharpIcon from "@mui/icons-material/WindowSharp";
import "./index.css";

export default function DisplayType({ setViewMode, viewMode }) {
  return (
    <div className="mobile_display_type">
      <div
        onClick={() => setViewMode("rows")}
        className={viewMode === "rows" ? "icon active" : "icon"}
      >
        <TableRowsSharpIcon />
      </div>
      <div
        onClick={() => setViewMode("grid")}
        className={viewMode === "grid" ? "icon active" : "icon"}
      >
        <WindowSharpIcon />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import apis from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BASE_URL } from "../../utils/constants";

import { useLocation } from "react-router-dom";
function Doc() {
  const [htmlContent, setHtmlContent] = useState("");
  const name = useLocation().pathname.split("/").reverse()[0];
  useEffect(() => {
    // Function to fetch the HTML content
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch(BASE_URL+apis.getDoc + name); // Replace with your URL
        if (response.ok) {
          const text = await response.text();
          setHtmlContent(text);
        } else {
          console.error("Failed to fetch HTML content");
        }
      } catch (error) {
        console.error("Error fetching HTML content:", error);
      }
    };

    fetchHtmlContent();
  }, [name]); // Empty dependency array to run only once after the initial render
  return (
    <div className="_doc">
      <Navbar white={true}></Navbar>
      <div
        className="help_doc_container"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <Footer />
    </div>
  );
}

export default Doc;

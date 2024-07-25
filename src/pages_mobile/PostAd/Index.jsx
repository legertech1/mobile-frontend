import React from "react";
import Navbar from "../../components/Navbar";
import AdForm from "./AdForm";
import { useLocation } from "react-router-dom";
import "./index.css";
import Footer from "../../components/Footer";
import Header from "../../components_mobile/Header";

function PostAd({ edit }) {
  const { state } = useLocation();
  const ad = state?.ad;

  return (
    <>
      <Header white={true} />
      <div className="post_ad_page">
        <AdForm ad={ad} edit={edit} />
      </div>
    </>
  );
}

export default PostAd;

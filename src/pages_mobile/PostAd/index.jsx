import React, { useEffect } from "react";

import AdForm from "./AdForm";
import { useLocation } from "react-router-dom";
import "./index.css";

function PostAd({ edit }) {
  const { state } = useLocation();
  const ad = state?.ad;
  useEffect(() => {
    console.log("///");
    setTimeout(
      () =>
        document
          .querySelector(".___app")
          .scrollTo({ top: 0, behavior: "smooth" }),
      0
    );
  }, []);

  return (
    <>
      <div className="post_ad_page">
        <AdForm ad={ad} edit={edit} />
      </div>
    </>
  );
}

export default PostAd;

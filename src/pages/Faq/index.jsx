import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./index.css";
import AccordionItem from "../../components/Accordion";
import { ArrowDownward } from "@mui/icons-material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
const faqData = [
  {
    title: "How to Register your account and Login.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950925647?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to Register And Login to account"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to use the Search page and Search Filters.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926309?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to search ads and apply filters"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to Post and Edit your Ads.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926030?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to Post and Edit Ads"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to Pause, Resume and Manage your Ads.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926192?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to pause, resume and manage ads"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to Save, View, Delete and Edit Ads.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950925807?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to save, view, delete and edit the ad"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title:
      "How to Relist Ads and use Auto-Relist to instantly relist Ads automatically on Expiry.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950925699?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to Relist Ads and setup Auto-relisting feature"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to change Profile and Business Information.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926107?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to change Personal and Business Detail"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },

  {
    title: "How to Chat and Communicate with the Seller through the Ads.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926378?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to chat or communicate with listing's person"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title:
      "How Pricing and Analytics work and how to use Notification settings. ",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950925888?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to Pricing and Analytics works. How to Setup Notifications"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "Our Payment Gateway and Payment Policy.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926149?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="Who is Borrowbe's Payment Gateway and what are the payment policies"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to change your Country and what does the Country Celection do.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/951145221?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to change country works in profile"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title:
      "How to Add Balance to your Profile and how to make Payments with it.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/951205812?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="Add balance in profile and make a payment with balance"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to Change your Password.",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926461?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to change password"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  {
    title: "How to Delete your account",
    element: (
      <>
        {" "}
        <div>
          <iframe
            src="https://player.vimeo.com/video/950926437?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            title="How to delete account"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </>
    ),
  },
  // Add more FAQ items as needed
];

const Faq = () => {
  const [active, setActive] = useState(-1);
  return (
    <div className="faq_page">
      <Navbar white={true}></Navbar>

      <div className="content">
        <h1 className="main_header">Frequently Asked Questions </h1>
        <div className="accordion">
          {faqData.map((item, index) => (
            <div
              className={"FAQ" + (active == index ? " active" : "")}
              onClick={(e) =>
                active == index ? setActive(-1) : setActive(index)
              }
            >
              <h1>
                {item.title}
                <span>
                  <KeyboardArrowDown />
                </span>
              </h1>
              {item.element}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;

const YoutubeVideoPlayer = ({ videoId }) => {
  return (
    <div className="video-player">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
};

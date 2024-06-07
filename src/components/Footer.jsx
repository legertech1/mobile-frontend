import React, { useState } from "react";
import "./Footer.css";
import LOGO from "../assets/images/MainLogo.svg";
import { helpDocs } from "../utils/helpDocs";
import { Link, useNavigate } from "react-router-dom";
import PolicyOutlined from "@mui/icons-material/PolicyOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import TeamIcon from "@mui/icons-material/GroupOutlined";
import PaymentIcon from "@mui/icons-material/PaymentOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { imageFallback } from "../utils/listingCardFunctions";
import OurPricing from "./OurPricing";
import Modal from "./Modal";
import { AttachMoney, QuestionAnswerOutlined } from "@mui/icons-material";

const Footer = () => {
  const [pricing, setPricing] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="main-footer">
      {pricing && (
        <Modal close={() => setPricing(false)}>
          <OurPricing close={() => setPricing(false)} />
        </Modal>
      )}
      <footer className="footer">
        <div className="footer-section logo-section">
          <img
            onError={imageFallback}
            className="footer_logo"
            src={LOGO}
            alt="Logo"
          />

          <p className="borrowbe-description">
            BorrowBe Inc. operates as a comprehensive classified listing
            platform, empowering users to connect for various transactions,
            including renting, leasing, financing, and services, through their
            thoughtfully crafted advertisements.
          </p>
        </div>
        <div className="footer-section">
          {/* <h2>BorrowBe</h2> */}
          <a className="link_text" onClick={() => setPricing(true)}>
            <AttachMoney />
            <span>Our Pricing</span>
          </a>
          <Link
            className="link_text"
            to={"/help-doc/" + helpDocs.privacyPolicy.id}
          >
            <PolicyOutlined />

            <span>Privacy Policy</span>
          </Link>

          <Link
            className="link_text"
            to={"/help-doc/" + helpDocs.termsOfUse.id}
          >
            <GavelOutlinedIcon />
            <span>Terms of Use</span>
          </Link>
        </div>

        <div className="footer-section">
          {/* <h2>About Us</h2> */}

          <Link
            className="link_text"
            to={"/help-doc/" + helpDocs.ourMission.id}
          >
            <EmojiPeopleOutlinedIcon />
            <span>Our Mission</span>
          </Link>
          <Link className="link_text" to={"/help-doc/" + helpDocs.aboutUs.id}>
            <TeamIcon />
            <span>About Us</span>
          </Link>
          <Link
            className="link_text"
            to={"/help-doc/" + helpDocs.paymentScams.id}
          >
            <PaymentIcon />
            <span>Payment Scams</span>
          </Link>
        </div>

        <div className="footer-section">
          {/* <h2>Support</h2> */}
          <Link className="link_text" to={"/faq"}>
            <QuestionAnswerOutlined />
            <span>FAQ</span>
          </Link>
          <Link className="link_text" to={"/contact-us"}>
            <ContactSupportOutlinedIcon />
            <span>Contact Us</span>
          </Link>

          <a className="link_text" onClick={() => navigate("/help")}>
            <PolicyOutlined />
            Help & Support
          </a>
        </div>
      </footer>
      <div
        style={{
          padding: 0,
          margin: 0,
          paddingBottom: "10px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            padding: 0,
            margin: 0,
            color: "#b6b6b6",
          }}
        >
          © 2023 - 2024 BorrowBe Inc. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;

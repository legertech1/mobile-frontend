import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ContactUsForm from "./ContactUsForm";
import "./index.css";

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <Navbar white={true} topOnly={true}></Navbar>

      <ContactUsForm />
      <Footer />
    </div>
  );
};

export default ContactUs;

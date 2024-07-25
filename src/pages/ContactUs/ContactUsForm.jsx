import React, { useState } from "react";
import Input from "../../components/Shared/Input";
import Dropdown from "../../components/Shared/Dropdown";
import TextArea from "../../components/Shared/TextArea";
import Button from "../../components/Shared/Button";
import "./index.css";
import ContactUs from "../../assets/images/contact_us.svg";
import axios from "axios";
import apis from "../../services/api";
import useNotification from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

export default function ContactUsForm() {
  let notification = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactReason: "",
    adIdAccountId: "",
    subject: "",
    description: "",
  });
  const nameRef = React.useRef(null);

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error for the current field
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const errors = {};

    // Example: Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return notification.error("Invalid email address");
    }
    // Add more validation checks for other fields
    if (!formData.name.trim()) {
      return notification.error("Name is required");
    } else if (formData.name.length < 2) {
      return notification.error("Name must be at least 2 characters long");
    }

    if (!formData.contactReason.trim()) {
      return notification.error("Contact reason is required");
    }

    if (!formData.adIdAccountId.trim()) {
      return notification.error("Ad ID / Account ID is required");
    }

    if (!formData.subject.trim()) {
      return notification.error("Subject is required");
    }

    if (!formData.description.trim()) {
      return notification.error("Description is required");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const navigate = useNavigate();
  const handleSubmit = () => {
    const isValid = validateForm();

    if (isValid) {
      axios
        .post(apis.contactUs, formData)
        .then((result) => {
          notification.success("Your query has been submitted successfully");
          navigate(-1); // Navigate back to previous page
          setFormData({
            name: "",
            email: "",
            contactReason: "",
            adIdAccountId: "",
            subject: "",
            description: "",
          });
        })
        .catch((error) => {
          notification.error("Something went wrong please try again later");
        });
    } else {
      nameRef.current &&
        nameRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };
  return (
    <div className="contact_cont">
      <div className="contact_us_page_wrapper">
        <div className="contact_us_card">
          <div className="contact-us-form">
            <div className="small_cont">
              <label ref={nameRef}>Name:</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  handleChange(
                    "name",
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
              />
            </div>

            <div className="small_cont">
              <label>Email:</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="small_cont">
              <label>Contact Reason:</label>
              <Dropdown
                value={formData.contactReason}
                array={[
                  "Account Issue",
                  "Ad Postings Issue",
                  "Payment Issue",
                  "Improvement or Add Fields",
                  "Error Message",
                  "Pricing",
                  "Report Chat / Ad",
                  "Complaint",
                  "Other",
                ]}
                setValue={(value) => {
                  handleChange("contactReason", value);
                }}
              />
            </div>
            <div className="small_cont">
              <label>Ad ID / Account ID:</label>
              <Input
                type="text"
                name="adIdAccountId"
                value={formData.adIdAccountId}
                onChange={(e) => handleChange("adIdAccountId", e.target.value)}
              />
            </div>

            <div className="fill">
              <label>Subject:</label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
            </div>
            <div className="fill">
              <label>Description:</label>
              <TextArea
                rows={4}
                name="description"
                placeholder={"Write your message here"}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <button className="submit btn_blue_m" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

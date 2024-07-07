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
      errors.email = "Invalid email address";
    }
    // Add more validation checks for other fields
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!formData.contactReason.trim()) {
      errors.contactReason = "Contact reason is required";
    }

    if (!formData.adIdAccountId.trim()) {
      errors.adIdAccountId = "Ad ID / Account ID is required";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateForm();

    if (isValid) {
      axios.post(apis.contactUs,formData).then((result)=>{
        notification.success("Your query has been submitted successfully")
        setFormData({
          name: "",
          email: "",
          contactReason: "",
          adIdAccountId: "",
          subject: "",
          description: "",
        })
      }).catch((error)=>{
        notification.error("Something went wrong please try again later")

      })
 
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
          <h1>Contact Us</h1>

          <div className="contact-us-form">
            <div className="image_cont">
              <img src={ContactUs} alt="" />
            </div>
            <div>
              <div className="small_cont">
                <label ref={nameRef}>Name:</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                />
                {formErrors.name && (
                  <div className="error-message">{formErrors.name}</div>
                )}
              </div>

              <div className="small_cont">
                <label>Email:</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
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
                {formErrors.contactReason && (
                  <div className="error-message">
                    {formErrors.contactReason}
                  </div>
                )}
              </div>
              <div className="small_cont">
                <div
                  style={{
                    marginTop: "18px",
                  }}
                />
                <label>Ad ID / Account ID:</label>
                <Input
                  type="text"
                  name="adIdAccountId"
                  value={formData.adIdAccountId}
                  onChange={(e) =>
                    handleChange("adIdAccountId", e.target.value)
                  }
                />
                {formErrors.adIdAccountId && (
                  <div className="error-message">
                    {formErrors.adIdAccountId}
                  </div>
                )}
              </div>

              <div>
                <label>Subject:</label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
                {formErrors.subject && (
                  <div className="error-message">{formErrors.subject}</div>
                )}
              </div>
              <div>
                <label>Description:</label>
                <TextArea
                  rows={4}
                  name="description"
                  placeholder={"Write your message here"}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                {formErrors.description && (
                  <div
                    className="error-message"
                    style={{
                      marginTop: 10,
                    }}
                  >
                    {formErrors.description}
                  </div>
                )}
              </div>
              <br />
              <Button className="btn_classic" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

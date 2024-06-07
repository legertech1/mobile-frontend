import React, { useState } from "react";
import Input from "../../components_mobile/shared/Input";
import "./index.css";
import Button from "../../components_mobile/shared/Button";
import Dropdown from "../../components_mobile/shared/Dropdown";
import TextArea from "../../components_mobile/shared/TextArea";

const ContactUs = () => {
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

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const errors = {};

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
    } else {
      nameRef.current &&
        nameRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  return (
    <div className="contact_us_page_mobile">
      {/* <ContactUsForm /> */}

      <h2 ref={nameRef} className="heading">
        Contact Us
      </h2>
      <Input
        required={true}
        label="Name:"
        placeholder={"Enter your name"}
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      {formErrors.name && (
        <div className="error_message">{formErrors.name}</div>
      )}
      <Input
        required={true}
        label="Email:"
        placeholder={"Enter your email"}
        value={formData.price}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      {formErrors.email && (
        <div className="error_message">{formErrors.email}</div>
      )}

      <Dropdown
        label={"Contact Reason:"}
        placeholder={"Select Reason"}
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
        setValue={(value) => handleChange("contactReason", value)}
        value={formData.contactReason}
      ></Dropdown>
      {formErrors.contactReason && (
        <div className="error_message">{formErrors.contactReason}</div>
      )}
      <Input
        required={true}
        label="Ad ID / Account ID:"
        placeholder={"Enter ad id or account id"}
        value={formData.adIdAccountId}
        onChange={(e) => handleChange("adIdAccountId", e.target.value)}
      />
      {formErrors.adIdAccountId && (
        <div className="error_message">{formErrors.adIdAccountId}</div>
      )}
      <Input
        required={true}
        label="Subject:"
        placeholder={"Enter subject"}
        value={formData.price}
        onChange={(e) => handleChange("subject", e.target.value)}
      />
      {formErrors.subject && (
        <div className="error_message">{formErrors.subject}</div>
      )}
      <TextArea
        required={true}
        label="Description:"
        placeholder={"Enter description"}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      ></TextArea>
      {formErrors.description && (
        <div className="error_message">{formErrors.description}</div>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default ContactUs;

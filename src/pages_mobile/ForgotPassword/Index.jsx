import React, { useState } from "react";
import Email from "@mui/icons-material/AlternateEmail";
import LOGO from "../../assets/images/MainLogoBlack.svg";
import "../Register/index.css";
import validateEmail from "../../utils/validateEmail";
import axios from "axios";
import FieldError from "../../components/FieldError";
import { Link, useNavigate } from "react-router-dom";
import apis from "../../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: {
      visible: false,
      message: "Please enter a valid email",
    },
  });

  const handleFormData = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = { ...formErrors };
    let hasError = false;
    for (let key in formErrors) {
      if (key === "email") {
        if (!validateEmail(formData.email)) {
          errors.email.visible = true;
          hasError = true;
        } else {
          errors.email.visible = false;
        }
      }
    }
    setFormErrors(errors);

    return hasError;
  };

  const submit = async () => {
    try {
      let hasError = validateForm();
      if (hasError) return;

      await axios.get(apis.forgotPassword + "/" + formData.email);
      navigate("/verify-password-reset");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="mobile_auth">
      <div className="container">
        <Link to="/">
          <img src={LOGO} alt="logo"></img>
        </Link>
        <h3>Reset your password</h3>

        <div className="registration_form">
          <div
            className="inp"
            style={
              formErrors.email.visible ? { borderColor: "var(--red)" } : {}
            }
          >
            <Email></Email>
            <input
              type="email"
              name=""
              id=""
              placeholder="Email"
              onChange={(e) => handleFormData("email", e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "email")}
            />
          </div>
          <FieldError
            error={formErrors.email.message}
            visible={formErrors.email.visible}
          />
          <div className="sign_up_cont">
            <button className="btn_classic" onClick={submit}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

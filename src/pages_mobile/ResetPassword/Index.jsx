import React, { useRef, useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Pass from "@mui/icons-material/Key";

import LOGO from "../../assets/images/MainLogoBlack.svg";
import "../Register/index.css";
import validatePassword from "../../utils/validatePassword";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../../services/api";
import FieldError from "../../components/FieldError";

function ResetPassword() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const inputRefs = {
    password: useRef(),
    password2: useRef(),
  };

  const [formErrors, setFormErrors] = useState({
    password: {
      visible: false,
      message: "Please enter a valid password",
    },
    password2: {
      visible: false,
      message: "Please enter a valid password",
    },
  });
  const handleFormData = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = { ...formErrors };
    let hasError = false;
    for (let key in formErrors) {
      if (key === "password") {
        if (!validatePassword(formData.password)) {
          errors.password.visible = true;
          hasError = true;
        } else {
          errors.password.visible = false;
        }
      } else if (key === "password2") {
        if (!validatePassword(formData.password2)) {
          errors.password2.visible = true;
          hasError = true;
        } else {
          errors.password2.visible = false;
        }
      }
    }
    setFormErrors(errors);

    return hasError;
  };

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "password") {
        inputRefs.password2.current.focus();
      } else if (field === "password2") {
        submit();
      }
    }
  }

  const submit = async () => {
    try {
      let hasError = validateForm();

      if (hasError) return;

      if (formData.password != formData.password2)
        return alert("Passwords do not match");

      await axios.post(apis.resetPassword, {
        token,
        password: formData.password,
      });
      navigate("/reset-password-successful");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="mobile_auth">
      <div className="container">
        {/* <Link to="/"> */}
        <img src={LOGO} alt="logo"></img>
        {/* </Link> */}
        <h3>Set new Password</h3>

        <div className="registration_form">
          <div
            className="inp"
            style={
              formErrors.password.visible ? { borderColor: "var(--red)" } : {}
            }
          >
            <Pass></Pass>
            <input
              type={show ? "text" : "password"}
              name=""
              id=""
              ref={inputRefs.password}
              placeholder="New Password"
              onKeyPress={(e) => handleKeyPress(e, "password")}
              onChange={(e) => handleFormData("password", e.target.value)}
            />

            {!show ? (
              <VisibilityOffIcon onClick={() => setShow(!show)} />
            ) : (
              <VisibilityIcon onClick={() => setShow(!show)} />
            )}
          </div>
          <FieldError
            error={formErrors.password.message}
            visible={formErrors.password.visible}
          />
          <div
            className="inp"
            style={
              formErrors.password2.visible ? { borderColor: "var(--red)" } : {}
            }
          >
            <Pass></Pass>
            <input
              type={show ? "text" : "password"}
              name=""
              id=""
              ref={inputRefs.password2}
              placeholder="Confirm Password"
              onKeyPress={(e) => handleKeyPress(e, "password2")}
              onChange={(e) => handleFormData("password2", e.target.value)}
            />

            {!show ? (
              <VisibilityOffIcon onClick={() => setShow(!show)} />
            ) : (
              <VisibilityIcon onClick={() => setShow(!show)} />
            )}
          </div>
          <FieldError
            error={formErrors.password2.message}
            visible={formErrors.password2.visible}
          />
          <button className="btn_classic" onClick={submit}>
            {" "}
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

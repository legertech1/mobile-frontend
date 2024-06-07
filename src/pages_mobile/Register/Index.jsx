import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Email from "@mui/icons-material/AlternateEmail";
import Pass from "@mui/icons-material/Key";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LOGO from "../../assets/images/MainLogoBlack.svg";
import "./index.css";
import FieldError from "../../components/FieldError";
import validateEmail from "../../utils/validateEmail";
import validatePassword from "../../utils/validatePassword";
import axios from "axios";
import apis from "../../services/api";
import Checkbox from "../../components/Shared/Checkbox";
import useNotification from "../../hooks/useNotification";

function Register() {
  const [show, setShow] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const inputRefs = {
    fullName: useRef(),
    email: useRef(),
    password: useRef(),
  };

  const [formErrors, setFormErrors] = useState({
    fullName: {
      visible: false,
      message: "Please enter your full name",
    },
    email: {
      visible: false,
      message: "Please enter a valid email",
    },
    password: {
      visible: false,
      message: "Please enter a valid password",
    },
  });

  const navigate = useNavigate();

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
      } else if (key === "password") {
        if (!validatePassword(formData.password)) {
          errors.password.visible = true;
          hasError = true;
        } else {
          errors.password.visible = false;
        }
      } else if (key === "fullName") {
        if (!formData.fullName) {
          errors.fullName.visible = true;
          hasError = true;
        } else {
          errors.fullName.visible = false;
        }
      }
    }
    setFormErrors(errors);

    return hasError;
  };

  function handleKeyPress(event, field) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "fullName") {
        inputRefs.email.current.focus();
      }
      if (field === "email") {
        inputRefs.password.current.focus();
      } else if (field === "password") {
        submit();
      }
    }
  }
  let notification = useNotification();

  const submit = async () => {
    let hasError = validateForm();

    if (hasError) return notification.error("Please fill all the fields");

    if (!termsChecked)
      return notification.error("Please accept terms and conditions");

    let names = formData.fullName.trim().split(" ");
    let firstName = names[0][0].toUpperCase() + names[0].slice(1);
    let lastName = "";
    for (let i = 1; i < names.length; i++) {
      lastName += names[i][0].toUpperCase() + names[i].slice(1) + " ";
    }
    lastName = lastName.trim();
    try {
      await axios.post(apis.register, {
        firstName,
        lastName,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
      navigate("/verify");
    } catch (err) {
      notification.error(err.response.data.error);
    }
  };

  return (
    <div className="mobile_auth">
      <div className="container">
        <Link to="/">
          <img src={LOGO} alt="logo"></img>
        </Link>
        <div className="registration_form">
          <div
            className="inp"
            style={
              formErrors.fullName.visible ? { borderColor: "var(--red)" } : {}
            }
          >
            <PersonIcon></PersonIcon>
            <input
              type="text"
              name=""
              id=""
              ref={inputRefs.fullName}
              onKeyPress={(e) => handleKeyPress(e, "fullName")}
              placeholder="Full Name"
              onChange={(e) => handleFormData("fullName", e.target.value)}
            />
          </div>
          <FieldError
            error={formErrors.fullName.message}
            visible={formErrors.fullName.visible}
          />
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
              ref={inputRefs.email}
              onKeyPress={(e) => handleKeyPress(e, "email")}
              id=""
              placeholder="Email"
              onChange={(e) => handleFormData("email", e.target.value)}
            />
          </div>
          <FieldError
            error={formErrors.email.message}
            visible={formErrors.email.visible}
          />

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
              ref={inputRefs.password}
              onKeyPress={(e) => handleKeyPress(e, "password")}
              id=""
              placeholder="Password"
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
          <div className="terms_and_condition_mobile">
            <Checkbox checked={termsChecked} setChecked={setTermsChecked} />
            <p>
              I agree to the{" "}
              <span>
                <Link target="_blank" to={`/help-doc/terms-of-use`}>
                  Terms of Service
                </Link>
              </span>{" "}
              and{" "}
              <span>
                <Link target="_blank" to={`/help-doc/privacy-policy`}>
                  Privacy Policy.
                </Link>
              </span>
            </p>
          </div>

          <button className="btn_classic" onClick={submit}>
            Register{" "}
          </button>
          <div className="links">
            <p>
              Already have an account?{" "}
              <Link to="/login">
                <span>Sign In</span>
              </Link>
            </p>
            <span></span>
          </div>
          <p className="hr_line">
            {" "}
            <hr />
            or continue with <hr />
          </p>
          <div className="sign_in_options">
            <div>
              <button >
                <GoogleIcon></GoogleIcon>
                Google
              </button>
              <button>
                <FacebookIcon></FacebookIcon>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

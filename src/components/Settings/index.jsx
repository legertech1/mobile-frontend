import React, { useState } from "react";
import PasswordIcon from "@mui/icons-material/Password";
import KeyIcon from "@mui/icons-material/Key";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import "./index.css";
import CreatePassword from "./CreatePassword";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import DeleteAccount from "./DeleteAccount";
import { useSelector } from "react-redux";

function Settings({ close }) {
  const [setting, setSetting] = useState("");
  const user = useSelector((state) => state.auth);
  return (
    <div className="_settings_container">
      <div className={"_settings" + (setting ? " hide" : "")}>
        <h1>
          <SettingsOutlinedIcon />
          Account Settings
        </h1>
        <ul>
          {!user?.password && (
            <li onClick={(e) => setSetting("create-password")}>
              <PasswordIcon /> Create Password{" "}
              <span>
                <NavigateNextOutlinedIcon />
              </span>
            </li>
          )}
          {user?.password && (
            <li onClick={(e) => setSetting("change-password")}>
              <KeyIcon /> Change Password{" "}
              <span>
                <NavigateNextOutlinedIcon />
              </span>
            </li>
          )}
          <li onClick={(e) => setSetting("change-email")}>
            <AlternateEmailOutlinedIcon /> Change Email{" "}
            <span>
              <NavigateNextOutlinedIcon />
            </span>
          </li>
          <li onClick={(e) => setSetting("delete-account")} className="delete">
            <PersonOffOutlinedIcon /> Delete Account{" "}
            <span>
              <NavigateNextOutlinedIcon />
            </span>
          </li>
        </ul>
      </div>

      <div
        className={"_setting" + (setting != "create-password" ? " hide" : "")}
      >
        <CreatePassword close={close} />
      </div>
      <div
        className={"_setting" + (setting != "change-password" ? " hide" : "")}
      >
        <ChangePassword close={close} />
      </div>
      <div className={"_setting" + (setting != "change-email" ? " hide" : "")}>
        <ChangeEmail close={close} />
      </div>
      <div
        className={"_setting" + (setting != "delete-account" ? " hide" : "")}
      >
        <DeleteAccount close={close} />
      </div>
    </div>
  );
}

export default Settings;

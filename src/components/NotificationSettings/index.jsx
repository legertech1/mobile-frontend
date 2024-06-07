import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../Shared/Checkbox";
import { useLocalStorage } from "@uidotdev/usehooks";
import { editUserData } from "../../store/authSlice";
import "./index.css";
import apis from "../../services/api";
import axios from "axios";
function NotificationSettings() {
  const user = useSelector((state) => state.auth);
  const [soundConfig, setSoundConfig] = useLocalStorage("sound", {
    notification: true,
    message: true,
  });
  const dispatch = useDispatch();
  return (
    <div className="_n_settings">
      <div className="config">
        <h2>Notification Updates configuration</h2>
        {Object.keys(user?.config?.notificationConfig || {}).map((k) => (
          <li className="config_option">
            {k}{" "}
            <Checkbox
              checked={user?.config?.notificationConfig[k]}
              setChecked={(v) => {
                const config = {
                  ...user?.config,
                  notificationConfig: {
                    ...user?.config?.notificationConfig,
                    [k]: v,
                  },
                };
                dispatch(
                  editUserData({
                    ...user,
                    config,
                  })
                );
                axios.post(apis.updateUserConfig, config);
              }}
            />
          </li>
        ))}
      </div>
      <div className="config">
        <h2>Sound Alert configuration</h2>
        <li className="config_option">
          Play sound on recieving notification{" "}
          <Checkbox
            checked={soundConfig.notification}
            setChecked={(v) =>
              setSoundConfig({ ...soundConfig, notification: v })
            }
          />
        </li>
        <li className="config_option">
          Play sound on recieving message{" "}
          <Checkbox
            checked={soundConfig.message}
            setChecked={(v) => setSoundConfig({ ...soundConfig, message: v })}
          />
        </li>
      </div>
    </div>
  );
}

export default NotificationSettings;

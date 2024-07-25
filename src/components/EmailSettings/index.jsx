import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLocalStorage } from "@uidotdev/usehooks";
import { editUserData } from "../../store/authSlice";
import "../NotificationSettings/index.css";
import apis from "../../services/api";
import axios from "axios";
import Checkbox from "../../components_mobile/shared/Checkbox";
function EmailSettings() {
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  return (
    <div className="_n_settings">
      <div className="config">
        {Object.keys(user?.config?.emailConfig || {}).map((k) => (
          <li className="config_option">
            {k}{" "}
            <Checkbox
              checked={user?.config?.emailConfig[k]}
              setChecked={(v) => {
                const config = {
                  ...user?.config,
                  emailConfig: {
                    ...user?.config?.emailConfig,
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
    </div>
  );
}

export default EmailSettings;

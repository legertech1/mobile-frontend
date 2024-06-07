import React, { useEffect, useState } from "react";
import "./AdPostHandler.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useNotification from "../hooks/useNotification";
import apis from "../services/api";
import {
  DoneAllOutlined,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowUpOutlined,
  Replay,
} from "@mui/icons-material";
import { me } from "../store/authSlice";
import { updateCart } from "../store/cartSlice";
import { getBalance } from "../store/balanceSlice";
import { initialAdState, setFormData } from "../store/adSlice";
import { useNavigate } from "react-router-dom";
function AdPosthandler({ token, onSuccess, close }) {
  const ad = useSelector((state) => state.ad);
  const user = useSelector((state) => state.auth);
  const updates = useSelector((state) => state.updates);
  const [update, setUpdate] = useState(0);
  const [current, setCurrent] = useState(0);
  const [wait, setWait] = useState(false);
  const [error, setError] = useState(null);
  const notification = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function postAd() {
    try {
      const res = await axios.post(apis.postAd, { ad, token });
    } catch (err) {
      notification.error( err?.response?.data || err.message);
      setError(err);
    }
  }
  useEffect(() => {
    if (current == 4)
      setTimeout(() => {
        dispatch(me());
        dispatch(updateCart({}));
        dispatch(getBalance());
        dispatch(setFormData(initialAdState));
        setTimeout(() => navigate("/profile"), 2500);
        onSuccess();
        close();
      }, 1000);
  }, [current]);
  useEffect(() => {
    postAd();
  }, []);
  useEffect(() => {
    if (updates[0]?.type == "post-ad") setUpdate(updates[0].update);
  }, [updates]);
  useEffect(() => {
    if (wait) return;
    if (update > current) {
      setCurrent(current + 1);
      setWait(true);
      setTimeout(() => setWait(false), 400);
    }
  }, [updates, wait]);

  return (
    <div className="ad_post_handler">
      {!error && (
        <div className="main">
          <div className="step">
            {" "}
            <p className={current >= 1 ? "done" : ""}>
              {current >= 1 ? <DoneAllOutlined /> : 1}
            </p>
            <h3>Initiating</h3>
          </div>
          <div className={"divider" + (current >= 1 ? " done" : " ")}></div>
          <div className="step">
            {" "}
            <p className={current >= 2 ? "done" : ""}>
              {" "}
              {current >= 2 ? <DoneAllOutlined /> : 2}
            </p>
            <h3>Verifying details</h3>
          </div>
          <div className={"divider" + (current >= 2 ? " done" : " ")}></div>
          <div className="step">
            {" "}
            <p className={current >= 3 ? "done" : ""}>
              {" "}
              {current >= 3 ? <DoneAllOutlined /> : 3}
            </p>
            <h3>Processing images</h3>
          </div>
          <div className={"divider" + (current >= 3 ? " done" : " ")}></div>
          <div className="step">
            {" "}
            <p className={current >= 4 ? "done" : ""}>
              {" "}
              {current >= 4 ? <DoneAllOutlined /> : 4}
            </p>
            <h3>Finalising</h3>
          </div>
        </div>
      )}
      {error && (
        <div className="post_error">
          <h2>Oops! Something went wrong. Please try again</h2>
          <button
            className="retry btn_red_m"
            onClick={() => {
              setUpdate(0);
              setCurrent(0);
              setWait(false);
              setError(null);
              postAd();
            }}
          >
            <Replay /> Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default AdPosthandler;

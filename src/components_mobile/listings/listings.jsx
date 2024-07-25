import React, { useRef, useState } from "react";
import Listing from "./listing";
import { useGesture } from "@use-gesture/react";
import "./index.css";
import {
  ArrowBack,
  ArrowLeft,
  Delete,
  Edit,
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import Checkbox from "../shared/Checkbox/index";
import { createPortal } from "react-dom";
import { ArrowLeftLong } from "styled-icons/fa-solid";
import ripple from "../../utils/ripple";
import apis from "../../services/api";
import { editUserData } from "../../store/authSlice";
import { update } from "react-spring";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import useNotification from "../../hooks/useNotification";
import { Settings } from "styled-icons/material";
import Modal from "../Modal";
import Config from "./Config";
import { useNavigate } from "react-router-dom";

function Listings({ ads, setAds, loading, num, gestures, update, status }) {
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const confirm = useConfirmDialog();
  const notification = useNotification();

  const navigate = useNavigate();
  const gestureOptions = {
    onTouchStart: (state) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const target = state.event.target;
      if (target.classList.contains("overlay")) {
        timerRef.current = setTimeout(() => {
          setSelected((s) => {
            return [...s, target.id];
          });
        }, 300); // 1000ms = 1 second
      }
    },
    onTouchEnd: (state) => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    },
    onTouchMove: (state) => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    },
    onTouchCancel: (state) => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    },
  };
  function rearrange(arr) {
    if (arr[arr.length - 1]?.meta?.highlighted) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].meta.highlighted) continue;
        else {
          const temp = arr[i];
          arr[i] = arr[arr.length - 1];
          arr[arr.length - 1] = temp;
        }
      }
    }
    return arr;
  }
  const bind = useGesture(gestures ? gestureOptions : false);
  async function batchUpdate(type, ids) {
    try {
      const res = await axios.post(apis.batchUpdate, { type, ids });
      setSelected([]);
      type == "delete"
        ? dispatch(
            editUserData({
              ...user,
              data: { ...user?.data, postedAds: res.data },
            })
          )
        : update(res.data);
    } catch (err) {
      notification.error(err?.response?.data || err.message);
    }
  }
  return (
    <div
      className={"_listings" + (loading ? " loading" : "")}
      {...bind()}
      ref={containerRef}
    >
      {Boolean(ads?.length) &&
        rearrange([...ads])?.map((ad) => (
          <Listing
            ad={ad}
            key={ad._id}
            setAds={setAds}
            selected={selected?.includes(ad._id)}
            setSelected={setSelected}
            status={status}
          ></Listing>
        ))}
      {loading &&
        Array(num || 8)
          .fill(null)
          .map((listing, index) => <Listing empty={true} />)}

      {Boolean(selected.length) &&
        createPortal(
          <div className="_ad_actions">
            <h2>
              <button
                className="back"
                onClick={(e) =>
                  ripple(e, {
                    dur: 1,
                    cb: () => {
                      setSelected([]);
                    },
                  })
                }
              >
                <ArrowBack />
              </button>
              {selected.length} ad{selected.length > 1 ? "s" : ""} selected.
            </h2>
            {selected.length < 2 && <></>}
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    confirm.openDialog(
                      "Are you sure you want to resume " +
                        selected.length +
                        " ads?",
                      () => batchUpdate("resume", selected)
                    );
                  },
                })
              }
            >
              <PlayArrowRounded />
            </button>
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    confirm.openDialog(
                      "Are you sure you want to pause " +
                        selected.length +
                        " ads?",
                      () => batchUpdate("pause", selected)
                    );
                  },
                })
              }
            >
              <PauseRounded />
            </button>
            <button
              className="action"
              onClick={(e) =>
                ripple(e, {
                  dur: 1,
                  cb: () => {
                    confirm.openDialog(
                      "Are you sure you want to delete " +
                        selected.length +
                        " ads?",
                      () => {
                        batchUpdate("delete", selected);
                      }
                    );
                  },
                })
              }
            >
              <Delete />
            </button>
          </div>,
          document.querySelector("#portal")
        )}
    </div>
  );
}

export default Listings;

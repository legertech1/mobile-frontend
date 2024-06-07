import React, { useRef } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import useNotification from "../../hooks/useNotification";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./index.css";

export default function AdMenu({ adId, cb, listing }) {
  const chatActions = useRef();
  const confirm = useConfirmDialog();
  const notification = useNotification();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  return (
    <>
      <span
        className={"ad_menu"}
        onClick={(e) => {
          e.stopPropagation();
          chatActions.current.classList.toggle("active");

          const fn = () => {
            if (!chatActions?.current)
              return document.removeEventListener("click", fn);
            if (Array.from(chatActions.current.classList).includes("active")) {
              chatActions.current.classList.remove("active");
              document.removeEventListener("click", fn);
            }
          };
          document.addEventListener("click", fn);
        }}
      >
        <MoreVertOutlinedIcon />
      </span>
      <div className="ad_menu_show_actions" ref={chatActions}>
        {/* <div className="option">
              <StarOutlineRoundedIcon /> Mark as Importrant
            </div> */}
        <div
          className="option"
          onClick={(e) => {
            e.stopPropagation();

            if (!user) {
              notification.error("Please Login to Edit Ad");
              return;
            }

            chatActions.current.classList.remove("active");

            confirm.openDialog(
              "Are you sure you want to edit your ad?",
              () => {
                navigate(`/edit/${adId}`);
              },
              () => {}
            );
          }}
        >
          <ModeEditOutlineOutlinedIcon /> Edit Ad
        </div>
        {listing?.meta?.status == "active" && (
          <div
            className="option"
            onClick={(e) => {
              e.stopPropagation();

              if (!user) {
                notification.error("Please Login to Pause Ad");
                return;
              }

              chatActions.current.classList.remove("active");

              confirm.openDialog(
                "Are you sure you want to pause your ad?",
                () => {
                  cb && cb("pause", adId);
                },
                () => {}
              );
            }}
          >
            <PauseOutlinedIcon /> Pause Ad
          </div>
        )}
        {listing?.meta?.status == "paused" && (
          <div
            className="option"
            onClick={(e) => {
              e.stopPropagation();

              if (!user) {
                notification.error("Please Login to resume Ad");
                return;
              }

              chatActions.current.classList.remove("active");

              confirm.openDialog(
                "Are you sure you want to resume your ad?",
                () => {
                  cb && cb("resume", adId);
                },
                () => {}
              );
            }}
          >
            <PlayArrowOutlinedIcon /> Resume Ad
          </div>
        )}

        <div
          className="option"
          onClick={(e) => {
            e.stopPropagation();
            chatActions.current.classList.remove("active");
            confirm.openDialog(
              "Are you sure you want to delete your ad?",
              () => {
                cb && cb("delete", adId);
              },
              () => {}
            );
          }}
        >
          {" "}
          <DeleteOutlineOutlinedIcon /> Delete Ad
        </div>
      </div>
    </>
  );
}

import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { Telegram } from "@mui/icons-material";
import useNotification from "../../hooks/useNotification";
function Share({ close, url }) {
  const notify = useNotification();
  if (!url) close();
  return (
    <div className="Share" onClick={close}>
      <a
        className="fb"
        target="_blank"
        href={
          "https://www.facebook.com/sharer/sharer.php?u=https%3A//" +
          url.replace("https://", "")
        }
      >
        <FacebookIcon />
        <p className="text">Facebook</p>
      </a>
      <a
        className="tw"
        target="_blank"
        href={
          "https://twitter.com/intent/tweet?text=https%3A//" +
          url.replace("https://", "")
        }
      >
        <TwitterIcon />
        <p className="text">Twitter</p>
      </a>
      <a className="wa" target="_blank" href={"https://wa.me/?text=" + url}>
        <WhatsAppIcon />
        <p className="text"> Whatsapp</p>
      </a>

      <a
        target="_blank"
        href={
          "https://t.me/share/url?url=https%3A//" +
          +url.replace("https://", "") +
          "&text="
        }
        className="tg"
      >
        <Telegram />
        <p className="text"> Telegram </p>
      </a>
      <a
        className="cb"
        onClick={(e) => {
          navigator.clipboard.writeText(url);
          notify.info("Copied to clipboard");
        }}
      >
        <ContentCopyIcon />
        <p className="text">Copy link</p>
      </a>
    </div>
  );
}

export default Share;

import React from "react";
import AdPricing from "../pages_mobile/PostAd/AdPricing";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../services/api";
import useNotification from "../hooks/useNotification";
import { updateCart } from "../store/cartSlice";
import { createPortal } from "react-dom";

function EditConfig({ listing, close, onEdit }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const navigate = useNavigate();
  if (!categories) navigate("/profile");
  const cart = useSelector((state) => state.cart);
  const notification = useNotification();
  async function updateConfig() {
    try {
      const res = await axios.post(apis.updateConfig + listing?._id, {
        pricing: cart,
      });
      onEdit(res.data);
      dispatch(updateCart({}));
      notification.success("Configuration updated successfully");
      close();
    } catch (err) {
      notification.error(err?.response?.data || err.message);
    }
  }
  return (
    <div className="post_ad relist_ad" onClick={(e) => e.stopPropagation()}>
      <div className="ad_form">
        {" "}
        <AdPricing
          category={
            categories.filter((c) => c?.name == listing?.meta?.category)[0] ||
            {}
          }
          preconfig={listing?.config?.next}
          ignoreFree={true}
        />
      </div>
      {createPortal(
        <div className="_btns_cont" style={{ zIndex: 99999999 }}>
          <button className="discard" onClick={close}>
            Discard
          </button>
          <button
            className="next_btn btn_blue_m"
            onClick={() => updateConfig()}
          >
            Save config
          </button>
        </div>,
        document.querySelector("#portal")
      )}
    </div>
  );
}

export default EditConfig;

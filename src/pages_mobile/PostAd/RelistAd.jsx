import React, { useState } from "react";
import AdPricing from "./AdPricing";
import { useDispatch, useSelector } from "react-redux";
import { PinDropOutlined } from "@mui/icons-material";

import { updateCart } from "../../store/cartSlice";

import axios from "axios";
import apis from "../../services/api";
import getCartAndTotal from "../../utils/getCartAndTotal";

function RelistAd({
  ad,
  close,
  setPaymentModal,
  onPaymentSuccessful,
  onPaymentFailed,
}) {
  const categories = useSelector((state) => state.categories);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <div className="post_ad relist_ad" onClick={(e) => e.stopPropagation()}>
      <div className="ad_info_cont">
        <div className="ad_info">
          <img src={ad.thumbnails[0]} alt="" />
          <div>
            <p>
              <span>{ad.listingID}</span>
            </p>
            <h4 className="line">{ad.title}</h4>
            <p className="line location">
              <PinDropOutlined />
              {ad.location.name}
            </p>
            <p>
              {" "}
              <span className="price">${ad.price}</span> /{ad.term}
            </p>
          </div>
        </div>
      </div>

      <div className="ad_form">
        {" "}
        <AdPricing
          category={
            categories.filter((c) => c?.name == ad?.meta?.category)[0] || {}
          }
          preconfig={ad.config.next}
        />
      </div>
      <div className="btns_cont">
        <button className="discard" onClick={close}>
          Cancel
        </button>
        <button
          className="next_btn btn_blue_m"
          onClick={async () => {
            const [total, _] = getCartAndTotal(
              cart,
              user,
              categories.filter((c) => c.name == ad.meta.category)[0]
            );
            if (!Number(total)) {
              const { token, free } = (
                await axios.post(apis.createPaymentIntent, {
                  pricing: cart,
                  category: ad.meta.category,
                })
              ).data;
              dispatch(updateCart({ total: 0 }));
              onPaymentSuccessful(token);
            } else setPaymentModal(true);
            close();
          }}
        >
          Reactivate Ad
        </button>
      </div>
    </div>
  );
}

export default RelistAd;

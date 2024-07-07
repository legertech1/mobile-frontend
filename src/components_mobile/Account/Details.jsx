import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../services/api";
import {
  ArticleOutlined,
  Info,
  InfoOutlined,
  PinDropOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Loader from "../Loader";

function Details({ payment }) {
  let cart = payment.cart;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAd = async () => {
    if (payment.ads?.length < 1) return;
    setLoading(true);
    try {
      const res = await axios.get(apis.getAdInfo + payment.ads[0]);
      setAd(res.data || null);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAd();
  }, []);

  return (
    <div className="payment_form _details">
      {!loading && (
        <>
          {" "}
          {ad && (
            <>
              {" "}
              <h1>
                <InfoOutlined /> Associated Ad
              </h1>
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
            </>
          )}
          <div className="left">
            <h1>
              <ShoppingCartOutlined /> Associated Cart Details
            </h1>

            {cart?.package && (
              <>
                {cart.package && (
                  <div className="package">
                    <div className="package_info">
                      <h4>
                        1× {cart.package.name} Plan for {payment.category}
                      </h4>

                      <span>
                        {cart.package.free
                          ? "Free"
                          : "$" + cart?.package.item.price}
                      </span>
                    </div>
                  </div>
                )}
                {cart.addOns && (
                  <div className="package">
                    {cart?.addOns?.bumpUp && (
                      <div className="package_info">
                        <div>
                          <h4>
                            {" "}
                            1× Bump Up every {cart.addOns.bumpUp.frequency} days
                          </h4>
                        </div>
                        <span>${cart.addOns.bumpUp.price}</span>
                      </div>
                    )}
                    {cart?.addOns?.featured && (
                      <div className="package_info">
                        <div>
                          <h4>
                            {" "}
                            1× Featured Ad for {cart.addOns.featured.days} days
                          </h4>
                        </div>
                        <span>${cart.addOns.featured.price}</span>
                      </div>
                    )}
                    {cart?.addOns?.highlighted && (
                      <div className="package_info">
                        <div>
                          <h4>
                            {" "}
                            1× Highlighted Ad for {
                              cart.addOns.highlighted.days
                            }{" "}
                            days
                          </h4>
                        </div>
                        <span>${cart.addOns.highlighted.price}</span>
                      </div>
                    )}
                    {cart?.addOns?.homepageGallery && (
                      <div className="package_info">
                        <div>
                          <h4>
                            {" "}
                            1× Homepage Gallery for{" "}
                            {cart.addOns.homepageGallery.days} days
                          </h4>
                        </div>
                        <span>${cart.addOns.homepageGallery.price}</span>
                      </div>
                    )}
                  </div>
                )}
                {cart.extras && (
                  <div className="package">
                    {cart?.extras?.business && (
                      <div className="package_info">
                        <div>
                          <h4> 1× Business Ad</h4>
                        </div>
                        <span>${cart.extras.business.price}</span>
                      </div>
                    )}
                    {cart?.extras?.website && (
                      <div className="package_info">
                        <div>
                          <h4> 1× Add Website</h4>
                        </div>
                        <span>${cart.extras.website.price}</span>
                      </div>
                    )}
                    {cart?.extras?.youtube && (
                      <div className="package_info">
                        <div>
                          <h4> 1× Add Youtube Video</h4>
                        </div>
                        <span>${cart.extras.youtube.price}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {payment.balance && payment.type == "external" && (
              <div className="package">
                <div className="package_info">
                  <h3>Borrowbe Balance</h3>

                  <span>${payment.amount}</span>
                </div>
              </div>
            )}

            <div className="total">
              Total: <span className="price">${payment.amount}</span>
            </div>
          </div>
          <div className="right">
            <div className="billing_details">
              {" "}
              <h1>
                <ArticleOutlined />
                Associated Billing Details
              </h1>
              <div className="saved">
                <p>
                  <span>Name:</span>
                  {payment.billingInfo.name}
                </p>
                <p>
                  <span>Email:</span>
                  {payment.billingInfo.email}
                </p>
                <p>
                  <span>Address:</span>
                  {payment?.billingInfo?.address && (
                    <>
                      {" "}
                      {payment?.billingInfo?.address?.line1},{" "}
                      {payment?.billingInfo?.address?.city},{" "}
                      {payment?.billingInfo?.address?.state},{" "}
                      {payment?.billingInfo?.address?.country} (
                      {payment?.billingInfo?.address?.postal_code})
                    </>
                  )}
                  {!payment?.billingInfo?.address && "No data"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="details_loading">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Details;

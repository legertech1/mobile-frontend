import React, { useEffect } from "react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import apis from "../../services/api";
import axios from "axios";
import Form from "./Form";
import { Elements } from "@stripe/react-stripe-js";
import { NODE_ENV } from "../../utils/constants";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../store/cartSlice";
import PaymentLoader from "./PaymentLoader";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BillingDetails from "./BillingDetails";
import getCartAndTotal from "../../utils/getCartAndTotal";
import Loader from "../Loader";
const appearance = {
  theme: "stripe",

  variables: {
    colorPrimary: "#2196F3",
    colorBackground: "#ffffff",
    colorText: "#30313d",
    colorDanger: "#df1b41",
    fontSmooth: "always",
    borderRadius: "4px",
  },
  rules: {
    ".Input": {
      outline: "none",
      border: "1px solid #fff",
      boxShadow: "inset 0px 0px 6px #ccc",
      fontSize: "17px",
      padding: "15px",
      fontWeight: "500",

      marginBottom: "2px",
      boxSizing: "border-box",
      width: "100%",
    },
    ".Input:focus": {
      border: "none",
      outline: "none",
      boxShadow: "inset 0px 0px 6px #ccc",
    },
    ".Label": {
      color: "#555",
      fontSize: "16px",
      fontWeight: "500",
      fontFamily: "Montserrat",
    },
  },
};

function PaymentElement({
  balance,
  close,
  redirect,
  onPaymentSuccessful,
  onPaymentFailed,
  category,
  listing,
}) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [token, setToken] = useState(null);
  const cart = useSelector((state) => state.cart);
  const ad = useSelector((state) => state.ad);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(null);
  const [billing, setBilling] = useState(null);
  const user = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.categories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(apis.getPublicStripeKey)
      .then((res) => setStripePromise(loadStripe(res.data.key)));
  }, []);

  useEffect(() => {
    if (!billing) return;
    if (!balance) {
      axios
        .post(apis.createPaymentIntent, {
          pricing: cart,
          category: ad.category || category,
          billing,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setToken(res.data.token);
          dispatch(updateCart({ ...cart }));
          setTotal(res.data.total);
        })
        .catch((err) => {
          onPaymentFailed({ message: "Error creating payment intent." });
        });
    } else {
      axios
        .post(apis.createPaymentIntent, {
          balance,
          billing,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setToken(res.data.token);
          setTotal(res.data.total);
        })
        .catch((err) => {
          onPaymentFailed({ message: "Error creating payment intent." });
        });
    }
  }, [billing]);
  return (
    <div className="payment_form" onClick={(e) => e.stopPropagation()}>
      <div className="left">
        <h1>
          <ShoppingCartOutlinedIcon /> Cart Summary
        </h1>

        {!balance && (
          <>
            {cart.package && (
              <div className="package">
                <div className="package_info">
                  <h4>
                    1× {cart.package.name} Plan for {ad.category}
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

        {balance && (
          <div className="package">
            <div className="package_info">
              <h3>Borrowbe Balance</h3>

              <span>${balance}</span>
            </div>
          </div>
        )}

        <div className="total">
          Total:{" "}
          <span className="price">
            $
            {total ||
              balance ||
              getCartAndTotal(
                cart,
                user,
                categories.filter(
                  (c) =>
                    c.name == ad?.category || c.name == listing?.meta?.category
                )[0]
              )[0]}
          </span>
        </div>
      </div>

      <div className="right">
        <BillingDetails
          billing={billing}
          setBilling={(v) => {
            setClientSecret(null);
            setBilling(v);
          }}
        />
        {billing && stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <Form
              close={close}
              redirect={redirect}
              token={token}
              onPaymentSuccessful={onPaymentSuccessful}
              onPaymentFailed={onPaymentFailed}
              balance={balance}
              total={total}
              loading={loading}
              setLoading={setLoading}
            ></Form>
          </Elements>
        )}
      </div>

      {loading && (
        <div className="details_loading">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default PaymentElement;

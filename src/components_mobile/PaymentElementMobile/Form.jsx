import React, { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import apis from "../../services/api";
function Form({ close, onPaymentSuccessful, onPaymentFailed, token, total }) {
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const cart = useSelector((state) => state.cart);
  const ad = useSelector((state) => state.ad);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return;
    setMessage(null);

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/profile",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status == "succeeded") {
      setIsProcessing(false);
      const paymentToken = (
        await axios.post(apis.confirmPayment, {
          token,
          total: cart.total,
          paymentIntent,
        })
      ).data;
      onPaymentSuccessful(paymentToken.token);
      close();
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    if (!cart?.package) close();
  }, []);
  return (
    <div className="payment_form_mobile">
      <div className="left">
        <h1>
          <ShoppingCartOutlinedIcon />
          Cart Summary
        </h1>
        {cart.package && (
          <div className="package">
            <div className="package_info">
              <div>
                <h4>
                  1× {cart.package.name} Plan for {ad.category}
                </h4>
                <p></p>
              </div>
              <span>${cart.package.item.price}</span>
            </div>
          </div>
        )}
        <div className="package">
          {cart?.addOns?.bumpUp && (
            <div className="package_info">
              <div>
                <h4> 1× Bump Up every {cart.addOns.bumpUp.frequency} days</h4>
              </div>
              <span>${cart.addOns.bumpUp.price}</span>
            </div>
          )}
          {cart?.addOns?.featured && (
            <div className="package_info">
              <div>
                <h4> 1× Featured Ad for {cart.addOns.featured.days} days</h4>
              </div>
              <span>${cart.addOns.featured.price}</span>
            </div>
          )}
          {cart?.addOns?.highlighted && (
            <div className="package_info">
              <div>
                <h4>
                  {" "}
                  1× Highlighted Ad for {cart.addOns.highlighted.days} days
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
                  1× Homepage Gallery for {
                    cart.addOns.homepageGallery.days
                  }{" "}
                  days
                </h4>
              </div>
              <span>${cart.addOns.homepageGallery.price}</span>
            </div>
          )}
        </div>
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

        <div className="total">
          Total: <span className="price">${total}</span>
        </div>
      </div>
      <div className="right">
        <h1>Payment</h1>
        <PaymentElement />
        {message && <p className="error_message">{message}</p>}

        <button
          className="btn_classic"
          disabled={isProcessing}
          onClick={handleSubmit}
        >
          {isProcessing ? "Processing" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default Form;

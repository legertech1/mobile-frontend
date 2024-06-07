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

function PaymentElementMobile({
  balance,
  close,
  redirect,
  onPaymentSuccessful,
  onPaymentFailed,
  category,
}) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [token, setToken] = useState(null);
  const cart = useSelector((state) => state.cart);
  const ad = useSelector((state) => state.ad);
  const dispatch = useDispatch();
  const [total, setTotal] = useState(null);

  useEffect(() => {
    axios
      .get(apis.getPublicStripeKey)
      .then((res) => setStripePromise(loadStripe(res.data.key)));
  }, []);

  useEffect(() => {
    if (!balance) {
      axios
        .post(apis.createPaymentIntent, {
          pricing: cart,
          category: ad.category || category,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setToken(res.data.token);
          dispatch(updateCart({ ...cart }));
          setTotal(res.data.total);
        })
        .catch((err) => {
          console.log(err);
          onPaymentFailed({ message: "Error creating payment intent." });
        });
    } else {
      axios
        .post(apis.createPaymentIntent, {
          balance,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setToken(res.data.token);
          setTotal(res.data.total);
        })
        .catch((err) => {
          console.log(err);
          onPaymentFailed({ message: "Error creating payment intent." });
        });
    }
  }, []);
  return (
    <div>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <Form
            close={close}
            redirect={redirect}
            token={token}
            onPaymentSuccessful={onPaymentSuccessful}
            onPaymentFailed={onPaymentFailed}
            total={total}
          ></Form>
        </Elements>
      )}
    </div>
  );
}

export default PaymentElementMobile;

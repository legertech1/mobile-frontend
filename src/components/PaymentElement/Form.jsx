import React, { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import apis from "../../services/api";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getBalance } from "../../store/balanceSlice";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Checkbox from "../../components_mobile/shared/Checkbox";
function Form({
  close,
  onPaymentSuccessful,
  onPaymentFailed,
  token,
  balance,
  total,
  loading,
  setLoading,
}) {
  const [isProcessing, setIsProcessing] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const cart = useSelector((state) => state.cart);
  const ad = useSelector((state) => state.ad);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [useBalance, setUseBalance] = useState(false);
  const userBalance = useSelector((state) => state.balance);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userBalance || userBalance?.user != user?._id) dispatch(getBalance());
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!stripe || !elements) return;
      setIsProcessing(true);
      setLoading(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/profile",
        },
        redirect: "if_required",
      });

      if (error) {
        onPaymentFailed(error.message);
      }

      if (paymentIntent && paymentIntent.status == "succeeded") {
        setIsProcessing(false);
        const res = (
          await axios.post(apis.confirmPayment, {
            token,
            balance,
          })
        ).data;
        onPaymentSuccessful(balance ? res : res.token);
        close();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const payWithBalance = async function () {
    if (balance || !password) return;
    setIsProcessing(true);
    setLoading(true);
    try {
      const res = (
        await axios.post(apis.payWithBalance, {
          token,
          password,
        })
      ).data;

      onPaymentSuccessful(res.token);
      close();
    } catch (err) {
      onPaymentFailed(err.response.data);
      setLoading(false);
    }
    setIsProcessing(false);
  };

  return (
    <>
      <h1>
        {" "}
        <CreditCardIcon /> Payment
      </h1>
      <div className="stripe_payment">
        <h4>
          External Payment{" "}
          {!balance && userBalance?.balance >= total && (
            <Checkbox
              checked={!useBalance}
              setChecked={(v) => setUseBalance(!v)}
            />
          )}
        </h4>
        <PaymentElement />
      </div>
      {!balance && userBalance?.balance >= total && (
        <>
          {" "}
          <span className="or">or</span>
          <div className="pay_with_balance">
            <h4>
              Pay with Borrowbe Balance{" "}
              <Checkbox
                checked={useBalance}
                setChecked={(v) => setUseBalance(v)}
              />
            </h4>
            {!useBalance && userBalance && (
              <div className="bal">
                <h5>Current balance</h5>
                <span className="price">
                  ${(userBalance?.balance).toFixed(2)}
                </span>
              </div>
            )}
            {useBalance && (
              <div className={"password" + (useBalance ? " active" : "")}>
                <input
                  placeholder="Enter your password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key == "Enter" &&
                    document.querySelector("#PAY_NOW").click()
                  }
                />
                <span>
                  {!show ? (
                    <VisibilityOffIcon onClick={() => setShow(!show)} />
                  ) : (
                    <VisibilityIcon onClick={() => setShow(!show)} />
                  )}
                </span>
              </div>
            )}
          </div>
        </>
      )}
      <button
        className="btn_classic"
        disabled={isProcessing}
        onClick={(e) => (useBalance ? payWithBalance(e) : handleSubmit(e))}
        id="PAY_NOW"
      >
        {isProcessing ? "Processing" : "Pay Now"}
      </button>
    </>
  );
}

export default Form;

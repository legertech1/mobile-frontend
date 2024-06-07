import React, { useEffect, useState } from "react";
import "./index.css";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { AddOutlined } from "@mui/icons-material";
import Info from "../Info";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { getBalance, updateBalance } from "../../store/balanceSlice";
import PaymentElement from "../PaymentElement";
import success from "../../assets/animatedIcons/successful.json";
import IconPlayer from "../../components/IconPlayer";

function Wallet() {
  const [open, setOpen] = useState();
  const [amount, setAmount] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const balance = useSelector((state) => state.balance);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (balance == null) dispatch(getBalance());
  }, [balance]);
  useEffect(() => {
    if (amount > 1000) setAmount(1000);
  }, [amount]);
  return (
    <div className="wallet">
      <h2>
        <AccountBalanceWalletIcon />
        Borrowbe Balance
        <Info
          info={
            "Your Borrowbe Balance allows you to seamlessly make payments and use extra features such as Auto-relist."
          }
        />
      </h2>
      <div className="wallet_main">
        <h1 className="balance">
          ${balance?.balance || 0}
          {!balance?.balance?.toString().includes(".") ? ".00" : ""}
        </h1>
        <div className="add_money_container">
          {" "}
          <div className="add_money" onClick={() => setOpen(true)}>
            <AddOutlined /> <span>Add Money</span>
          </div>
        </div>
      </div>
      {open && (
        <Modal
          close={() => {
            setOpen(false);
            setAmount(0);
          }}
        >
          <div className="_wallet_add_money">
            <h2>
              <AccountBalanceWalletIcon />
              Add Borrowbe Balance
            </h2>
            <div className="add_money_inp">
              $
              <input
                value={amount}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) return;
                  if (e.target.value[0] == 0)
                    return setAmount(Number(e.target.value.slice(1)));
                  setAmount(Number(e.target.value));
                }}
                onKeyDown={(e) =>
                  e.key == "Enter" &&
                  Number(amount) > 0 &&
                  document.querySelector("#ADD_MONEY_BUTTON").click()
                }
              />
            </div>
            <div className="suggested_amounts">
              <p onClick={() => setAmount(amount + 50)}>$50</p>
              <p onClick={() => setAmount(amount + 100)}>$100</p>
              <p onClick={() => setAmount(amount + 200)}>$200</p>
              <p onClick={() => setAmount(amount + 500)}>$500</p>
            </div>
            <div className="actions">
              <button
                className="cancel"
                onClick={() => {
                  setOpen(false);
                  setAmount(0);
                }}
              >
                <ClearIcon />
                Cancel
              </button>
              <button
                onClick={() => {
                  if (amount <= 0) return;
                  setPaymentModal(true);
                  setOpen(false);
                }}
                id="ADD_MONEY_BUTTON"
              >
                <AddIcon />
                Add Money
              </button>
            </div>
          </div>
        </Modal>
      )}
      {paymentModal && (
        <Modal
          close={() => {
            setPaymentModal(false);
            setAmount(0);
          }}
        >
          <PaymentElement
            balance={amount}
            onPaymentFailed={() => {}}
            close={() => {
              setPaymentModal(false);
              setAmount(0);
            }}
            onPaymentSuccessful={(balance) => {
              setPaymentSuccess(true);
              setTimeout(() => setPaymentSuccess(false), 3000);
            }}
          />
        </Modal>
      )}
      {paymentSuccess && (
        <Modal close={() => setPaymentSuccess(false)}>
          <div className="_success">
            {" "}
            <IconPlayer icon={success} once={true} />
            <p>Payment Successful!</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Wallet;

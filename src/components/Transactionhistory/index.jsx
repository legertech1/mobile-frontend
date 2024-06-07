import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import apis from "../../services/api";
import { FormatListBulleted, MoreHorizOutlined } from "@mui/icons-material";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import Loader from "../Loader";
import "./index.css";
import Modal from "../Modal";
import Details from "./Details";
function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState("external");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  // const containerRef = useRef(null);

  async function getTransactions() {
    if (end) return;
    setLoading(true);
    try {
      const res = await axios.post(apis.getTransactions, { page, type: tab });
      setTransactions([...transactions, ...res.data]);
      setPage(page + 1);
      if (res.data.length < 20) setEnd(true);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }
  useEffect(() => {
    getTransactions(); // Fetch initial data when component mounts

    // Add event listener to the scrollable container
  }, [tab]); // Run only once on component mount
  const handleScroll = (e) => {
    const container = e.target;
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight
    ) {
      getTransactions(); // Fetch more data when scrolled to the bottom of the container
    }
  };
  return (
    <div className="_transactions">
      <div className="transactions_header">
        {" "}
        <h1>
          <FormatListBulleted /> Your Payments
        </h1>
        <div className="selector">
          <div
            className={"tab" + (tab == "external" ? " active" : "")}
            onClick={() => {
              setTransactions([]);
              setPage(1);
              setEnd(false);
              setTab("external");
            }}
          >
            External Payments
          </div>
          <div
            className={"tab" + (tab == "internal" ? " active" : "")}
            onClick={() => {
              setTransactions([]);
              setPage(1);
              setEnd(false);
              setTab("internal");
            }}
          >
            Paid with Balance
          </div>
        </div>
      </div>
      <div className="payments">
        <div className="headers">
          <p className="info">Transaction ID</p>
          <p className="info">Date and Time</p>
          <p className="info desc">Description</p>
          <p className="info amount">Amount</p>
          <p className="info more">Details</p>
        </div>
        <div className="list" onScroll={handleScroll}>
          {" "}
          {transactions.map((t) => (
            <div className="transaction">
              <p className="info">{t.transactionID || t.TransactionID}</p>
              <p className="info">{new Date(t.createdAt).toLocaleString()}</p>
              <p className="info desc">{t.description || "None"}</p>
              <p className="info amount">
                ${String(t.amount).includes(".") ? t.amount : t.amount + ".00"}
              </p>
              <p className="info more">
                <button onClick={(e) => setShowDetails(t)}>
                  <ManageSearchOutlinedIcon />
                </button>
              </p>
            </div>
          ))}
          {loading && (
            <div className="loader_cont">
              <Loader />
            </div>
          )}
        </div>
      </div>
      {showDetails && (
        <Modal close={(e) => setShowDetails(null)}>
          <Details payment={showDetails} />
        </Modal>
      )}
    </div>
  );
}

export default TransactionHistory;

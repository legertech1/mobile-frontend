import axios from "axios";
import React, { useEffect, useState } from "react";
import apis from "../../services/api";
import Loader from "../../components/Loader";
import ripple from "../../utils/ripple";
import Modal from "../Modal";
import Details from "./Details";

function Transactions() {
  const [tab, setTab] = useState("external");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [details, setDetails] = useState(null);
  // const containerRef = useRef(null);

  async function getTransactions() {
    if (end || loading) return;
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
      <div className="selector">
        <div
          className={"tab" + (tab == "external" ? " active" : "")}
          onClick={(e) =>
            ripple(e, {
              dur: 2,
              cb: () => {
                if (tab == "external") return;
                setTransactions([]);
                setPage(1);
                setEnd(false);
                setTab("external");
              },
            })
          }
        >
          External Payments
        </div>
        <div
          className={"tab" + (tab == "internal" ? " active" : "")}
          onClick={(e) =>
            ripple(e, {
              dur: 2,
              cb: () => {
                if (tab == "internal") return;
                setTransactions([]);
                setPage(1);
                setEnd(false);
                setTab("internal");
              },
            })
          }
        >
          Paid with Balance
        </div>
      </div>

      <div className="list" onScroll={handleScroll}>
        {" "}
        {transactions.map((t) => (
          <div className="transaction">
            <div
              className="overlay"
              onClick={(e) =>
                ripple(e, {
                  dur: 2,
                  fast: true,
                  cb: () => {
                    setDetails(t);
                  },
                })
              }
            ></div>
            <div className="sec">
              {" "}
              <p className="info">{t.transactionID || t.TransactionID}</p>
              <p className="info">
                {" "}
                <span>Date & Time: </span>
                {new Date(t.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="sec">
              {" "}
              <p className="info desc">
                <span>Description: </span>
                {t.description || "None"}
              </p>
              <p className="info amount">
                ${String(t.amount).includes(".") ? t.amount : t.amount + ".00"}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="loader_cont">
            <Loader />
          </div>
        )}
        {details && (
          <Modal
            heading={details.transactionID}
            close={(e) => setDetails(null)}
            className={"ad"}
          >
            <Details payment={details} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Transactions;

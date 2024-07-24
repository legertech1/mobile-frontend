import React, { useRef, useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "../services/api";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./listingoptions.css";
import IconPlayer from "./IconPlayer";
import success from "../assets/animatedIcons/successful.json";
import {
  CloseOutlined,
  Edit,
  Key,
  MoreHorizOutlined,
  PinDropOutlined,
  RemoveRedEye,
  SettingsBackupRestore,
} from "@mui/icons-material";
import RelistAd from "../pages/PostAd/RelistAd";
import Modal from "./Modal";
import { updateCart } from "../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import useConfirmDialog from "../hooks/useConfirmDialog";
import Info from "./Info";
import EditConfig from "./EditConfig";
import useNotification from "../hooks/useNotification";

import { editUserData, me } from "../store/authSlice";
import PaymentElement from "./PaymentElement";
import { relistAd } from "../store/adSlice";
import { getBalance } from "../store/balanceSlice";
import getCartAndTotal from "../utils/getCartAndTotal";
function ListingsOptions({ listing, setListings, extraFn, noView }) {
  const navigate = useNavigate();
  const options = useRef();
  const del = useRef();
  const [relistModal, setRelistModal] = useState(false);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const confirm = useConfirmDialog();
  const [openConfig, setOpenConfig] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const notification = useNotification();
  const [paymentModal, setPaymentModal] = useState(false);
  const user = useSelector((state) => state.auth);
  const [paymentSuccess, setPaymentSuccess] = useState();
  function onPaymentSuccessful(token) {
    setPaymentSuccess(true);
    dispatch(relistAd({ id: listing._id, token }))
      .unwrap()
      .then((ad) => {
        dispatch(me());
        dispatch(getBalance());
        dispatch(updateCart({}));
      })
      .catch((err) => {});
  }
  function ConfigPanel() {
    const [total, cart] = getCartAndTotal(
      listing.config.next,
      user,
      categories.filter((c) => c.name == listing.meta.category)[0],
      true
    );
    listing.config.next = { ...cart, total };
    return (
      <div className="current">
        <h2>
          Next config{" "}
          <Info
            info={
              "This configuraion will be applied when your ad gets automatically relisted next time.\n You can preconfigure any package, add-ons and extras you'd want to use for the next time."
            }
          />{" "}
          <button
            className="edit_config btn_blue_m"
            onClick={(e) => setEdit(true)}
          >
            <Edit />
            Edit Config
          </button>
        </h2>
        <div className="config">
          <div>
            <h3 className="config_header">
              Package
              <span className={listing?.config?.next?.package?.name}>
                {listing?.config?.next?.package?.name}
              </span>
            </h3>
            <div className="details">
              <p>
                Ad Duration:{" "}
                <span className="value">{listing?.meta?.duration} days</span>
              </p>
              <p>
                No. of Images:{" "}
                <span className="value">
                  {listing?.config?.next?.package?.item?.images}
                </span>
              </p>
              <p>
                Featured For:{" "}
                <span className="value">
                  {listing?.config?.next?.package?.item?.featured} days
                </span>
              </p>
              <p>
                Highlighted For:{" "}
                <span className="value">
                  {listing?.config?.next?.package?.item?.highlighted} days
                </span>
              </p>
              <p>
                On Homepage For:{" "}
                <span className="value">
                  {listing?.config?.next?.package?.item?.homepageGallery} days
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="config_header">
              Add Ons
              <span className="num">
                {Object.keys(listing?.config?.next?.addOns || {}).length}
              </span>
            </h3>
            <div className="details">
              <p>
                Bump Up{" "}
                <span className="value">
                  every {listing?.config?.next?.addOns?.bumpUp?.frequency || 0}{" "}
                  days
                </span>
              </p>
              <p>
                Additonally Featured For:{" "}
                <span className="value">
                  {listing?.config?.next?.addOns?.featured?.days || 0} days
                </span>
              </p>
              <p>
                Additionally Highlighted For:{" "}
                <span className="value">
                  {listing?.config?.next?.addOns?.highlighted?.days || 0} days
                </span>
              </p>
              <p>
                Additionally on Homepage For:{" "}
                <span className="value">
                  {listing?.config?.next?.addOns?.homepageGallery?.days || 0}{" "}
                  days
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="config_header">
              Extras{" "}
              <span className="num">
                {Object.keys(listing?.config?.next?.extras || {}).length}
              </span>
            </h3>
            <div className="details">
              <p>
                Business Ad{" "}
                <span className="value">
                  {listing?.config?.next?.extras?.business ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Additional link to Website{" "}
                <span className="value">
                  {listing?.config?.next?.extras?.website ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Additional link to Youtube{" "}
                <span className="value">
                  {listing?.config?.next?.extras?.youtube ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <p className="total">
          Total: <span className="price">${listing?.config?.next?.total}</span>
        </p>
      </div>
    );
  }
  function onPaymentFailed(error) {
    setPaymentModal(false);
    notification.error(error);
  }
  async function changeStatus() {
    if (password?.length < 8) return;
    try {
      const res = await axios.post(apis.changeRecurringStatus + listing?._id, {
        password,
      });
      setPassword("");
      const ad = res.data;
      setListings((listings) => [
        ...listings.map((l) => (l._id == ad._id ? ad : l)),
      ]);
    } catch (err) {
      setPassword("");
      notification.error(err?.response?.data || err.message);
    }
  }

  function handler(e) {
    e.stopPropagation();
    if (extraFn) extraFn();
    if (!Array.from(options.current.classList).includes("active"))
      Array.from(document.querySelectorAll("div.actions")).forEach((e) =>
        e.classList.remove("active")
      );

    options.current.classList.toggle("active");
    del.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });

    const fn = () => {
      if (!options?.current) return document.removeEventListener("click", fn);
      if (Array.from(options.current.classList).includes("active")) {
        options.current.classList.remove("active");
        document.removeEventListener("click", fn);
      }
    };
    document.addEventListener("click", fn);
  }
  return (
    <div>
      {" "}
      <div onClick={(e) => handler(e)}>
        <button className="actions">
          <MoreHorizOutlined />
        </button>
        <div className="options actions" ref={options}>
          {listing.meta.status != "expired" && (
            <button
              className="settings"
              onClick={() => setOpenConfig(!openConfig)}
            >
              <SettingsIcon /> Ad Settings
            </button>
          )}
          {!noView && (
            <button
              className="view"
              onClick={() => navigate("/listing/" + listing?._id)}
            >
              <RemoveRedEye /> View Listing
            </button>
          )}
          <button
            className="edit"
            onClick={(e) => navigate("/edit/" + listing?._id)}
          >
            <ModeEditOutlineOutlinedIcon /> Edit Listing
          </button>
          {listing?.meta?.status == "active" && (
            <button
              className="pause"
              onClick={async (e) => {
                confirm.openDialog(
                  "Are you sure you want to pause listing " +
                    listing.listingID +
                    "?",
                  async () => {
                    const ad = (await axios.get(apis.pauseAd + listing?._id))
                      .data;

                    setListings((listings) => [
                      ...listings.map((l) =>
                        l._id == ad._id ? { ...l, ...ad } : l
                      ),
                    ]);
                  }
                );
              }}
            >
              <PauseOutlinedIcon /> Pause Listing
            </button>
          )}
          {listing?.meta?.status == "paused" && (
            <button
              className="resume"
              onClick={async (e) => {
                confirm.openDialog(
                  "Are you sure you wan to resume listing " +
                    listing.listingID +
                    "?",
                  async () => {
                    const ad = (await axios.get(apis.resumeAd + listing?._id))
                      .data;
                    setListings((listings) => [
                      ...listings.map((l) =>
                        l._id == ad._id ? { ...l, ...ad } : l
                      ),
                    ]);
                  }
                );
              }}
            >
              <PlayArrowOutlinedIcon /> Resume Listing
            </button>
          )}
          {listing?.meta?.status == "expired" && (
            <button className="expired" onClick={() => setRelistModal(true)}>
              <SettingsBackupRestore /> Reactivate Listing
              {relistModal && (
                <Modal
                  close={() => {
                    setRelistModal(false);
                    if (!paymentModal) dispatch(updateCart({}));
                  }}
                >
                  <RelistAd
                    ad={listing}
                    close={() => {
                      setRelistModal(false);
                    }}
                    setPaymentModal={setPaymentModal}
                    onPaymentSuccessful={onPaymentSuccessful}
                  />
                </Modal>
              )}
            </button>
          )}
          <button
            className="delete"
            onClick={async (e) => {
              confirm.openDialog(
                "Are you sure you wan to delete listing " +
                  listing.listingID +
                  "?",
                async () => {
                  const res = await axios.delete(apis.deleteAd + listing?._id);

                  dispatch(
                    editUserData({
                      ...user,
                      data: { ...user?.data, postedAds: res.data },
                    })
                  );
                }
              );
            }}
            ref={del}
          >
            <DeleteOutlineOutlinedIcon /> Delete Listing
          </button>
        </div>
      </div>
      {openConfig && (
        <Modal close={() => setOpenConfig(false)}>
          <div className="ad_config" onClick={(e) => e.stopPropagation()}>
            <div className="ad_info_cont">
              <div className="ad_info">
                <img src={listing.thumbnails[0]} alt="" />
                <div>
                  <div className="ad_info_row">
                    <p>
                      Price:{" "}
                      <span>
                        <p className="price"> ${listing.price}</p>/
                        {listing.term}
                      </span>
                    </p>
                    <p>
                      Listing ID: <span>{listing.listingID}</span>
                    </p>
                  </div>
                  <h4 className="line">{listing.title}</h4>
                  <p className="line">{listing.description}</p>
                  <p className="line location">
                    <PinDropOutlined />
                    {listing.location.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="recurring_ad">
              <div className="status_rr">
                {" "}
                <h2>Auto-relist:</h2>
                <p
                  className={
                    "status" + (listing?.config?.recurring ? " blue" : " red")
                  }
                >
                  {listing?.config?.recurring ? "active" : "inactive"}
                  <Info
                    info={
                      "Auto-relist will automatically consume Borrowbe balance and relist when they are expired, you can preconfigure the congiguration used for the next time your ad is relisted automatically"
                    }
                  />
                </p>
              </div>

              <div className="recurring_control">
                {listing.meta.status == "active" && (
                  <div className="change_status">
                    <div className={"password"}>
                      <input
                        placeholder="Enter your password"
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key == "Enter" &&
                          document.querySelector("#CHANGE_AUTO_RELIST").click()
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
                    <button
                      onClick={changeStatus}
                      className="change_recurring_status btn_blue_m"
                      disabled={password?.length < 8}
                      id="CHANGE_AUTO_RELIST"
                    >
                      {listing.config?.recurring ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                )}
                {listing.meta.status != "active" && (
                  <p className="inactive">
                    Activate your ad to change auto-relist status.
                  </p>
                )}
              </div>
            </div>
            <div className="current">
              <h2>
                Current config{" "}
                <Info
                  info={
                    "This is the current configuration for your ad. Your ad configuration cannot be changed once in effect."
                  }
                />{" "}
                <p className="red">Not Editable</p>
              </h2>

              <div className="config">
                <div>
                  <h3 className="config_header">
                    Package
                    <span className={listing?.config?.current?.package?.name}>
                      {listing?.config?.current?.package?.name}
                    </span>
                  </h3>
                  <div className="details">
                    <p>
                      Ad Duration:{" "}
                      <span className="value">
                        {listing?.meta?.duration} days
                      </span>
                    </p>
                    <p>
                      No. of Images:{" "}
                      <span className="value">
                        {listing?.config?.current?.package?.item?.images}
                      </span>
                    </p>
                    <p>
                      Featured For:{" "}
                      <span className="value">
                        {listing?.config?.current?.package?.item?.featured} days
                      </span>
                    </p>
                    <p>
                      Highlighted For:{" "}
                      <span className="value">
                        {listing?.config?.current?.package?.item?.highlighted}{" "}
                        days
                      </span>
                    </p>
                    <p>
                      On Homepage For:{" "}
                      <span className="value">
                        {
                          listing?.config?.current?.package?.item
                            ?.homepageGallery
                        }{" "}
                        days
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="config_header">
                    Add Ons
                    <span className="num">
                      {
                        Object.keys(listing?.config?.current?.addOns || {})
                          .length
                      }
                    </span>
                  </h3>
                  <div className="details">
                    <p>
                      Bump Up{" "}
                      <span className="value">
                        every{" "}
                        {listing?.config?.current?.addOns?.bumpUp?.frequency ||
                          0}{" "}
                        days
                      </span>
                    </p>
                    <p>
                      Additonally Featured For:{" "}
                      <span className="value">
                        {listing?.config?.current?.addOns?.featured?.days || 0}{" "}
                        days
                      </span>
                    </p>
                    <p>
                      Additionally Highlighted For:{" "}
                      <span className="value">
                        {listing?.config?.current?.addOns?.highlighted?.days ||
                          0}{" "}
                        days
                      </span>
                    </p>
                    <p>
                      Additionally on Homepage For:{" "}
                      <span className="value">
                        {listing?.config?.current?.addOns?.homepageGallery
                          ?.days || 0}{" "}
                        days
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="config_header">
                    Extras{" "}
                    <span className="num">
                      {
                        Object.keys(listing?.config?.current?.extras || {})
                          .length
                      }
                    </span>
                  </h3>
                  <div className="details">
                    <p>
                      Business Ad{" "}
                      <span className="value">
                        {listing?.config?.current?.extras?.business
                          ? "Yes"
                          : "No"}
                      </span>
                    </p>
                    <p>
                      Additional link to Website{" "}
                      <span className="value">
                        {listing?.config?.current?.extras?.website
                          ? "Yes"
                          : "No"}
                      </span>
                    </p>
                    <p>
                      Additional link to Youtube{" "}
                      <span className="value">
                        {listing?.config?.current?.extras?.youtube
                          ? "Yes"
                          : "No"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="total">
                Total:{" "}
                <span className="price">
                  ${listing?.config?.current?.total}
                </span>
              </p>
            </div>
            <ConfigPanel />
          </div>
        </Modal>
      )}
      {edit && (
        <Modal close={(e) => setEdit(false)}>
          <EditConfig
            listing={listing}
            onEdit={(ad) => {
              setListings((listings) => [
                ...listings.map((l) => (l._id == ad._id ? ad : l)),
              ]);
            }}
            close={(e) => setEdit(false)}
          />
        </Modal>
      )}
      {paymentModal && (
        <Modal close={(e) => setPaymentModal(false)}>
          <PaymentElement
            onPaymentSuccessful={onPaymentSuccessful}
            onPaymentFailed={onPaymentFailed}
            close={(e) => {
              setPaymentModal(false);
              dispatch(updateCart({}));
            }}
            listing={listing}
            category={listing.meta?.category}
          />
        </Modal>
      )}
      {paymentSuccess && (
        <Modal close={() => setPaymentSuccess(false)}>
          <div className="_success">
            {" "}
            <IconPlayer icon={success} once={true} />
            <p>Ad posted successfully</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ListingsOptions;

import {
  Edit,
  PinDropOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import React, { useState } from "react";
import Info from "../../components/Info";
import axios from "axios";
import apis from "../../services/api";
import useNotification from "../../hooks/useNotification";
import getCartAndTotal from "../../utils/getCartAndTotal";
import { useSelector } from "react-redux";
import Modal from "../Modal";
import EditConfig from "../../components/EditConfig";

function Config({ listing, setListings }) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const notification = useNotification();
  const user = useSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  const categories = useSelector((state) => state.categories);
  async function changeStatus() {
    if (password?.length < 8) return;
    try {
      const res = await axios.post(apis.changeRecurringStatus + listing?._id, {
        password,
      });
      setPassword("");
      const ad = res.data;
      setListings((listings) => [
        ...listings.map((l) => (l._id == listing._id ? ad : l)),
      ]);
    } catch (err) {
      setPassword("");
      notification.error(err?.response?.data || err.message);
    }
  }
  function ConfigPanel({ listing }) {
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
  if (!listing) return <></>;
  return (
    <div className="ad_config" onClick={(e) => e.stopPropagation()}>
      <div className="ad_info_cont">
        <div className="ad_info">
          <img src={listing.thumbnails[0]} alt="" />
          <div>
            <p>
              <span>{listing.listingID}</span>
            </p>
            <h4 className="line">{listing.title}</h4>
            <p className="line location">
              <PinDropOutlined />
              {listing.location.name}
            </p>
            <p>
              {" "}
              <span className="price">${listing.price}</span> /{listing.term}
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
              heading={"Auto-relist"}
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
                    <VisibilityOff onClick={() => setShow(!show)} />
                  ) : (
                    <Visibility onClick={() => setShow(!show)} />
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
              "This is the current configuration for your listing. Your ad configuration cannot be changed once in effect."
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
                <span className="value">{listing?.meta?.duration} days</span>
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
                  {listing?.config?.current?.package?.item?.highlighted} days
                </span>
              </p>
              <p>
                On Homepage For:{" "}
                <span className="value">
                  {listing?.config?.current?.package?.item?.homepageGallery}{" "}
                  days
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="config_header">
              Add Ons
              <span className="num">
                {Object.keys(listing?.config?.current?.addOns || {}).length}
              </span>
            </h3>
            <div className="details">
              <p>
                Bump Up{" "}
                <span className="value">
                  every{" "}
                  {listing?.config?.current?.addOns?.bumpUp?.frequency || 0}{" "}
                  days
                </span>
              </p>
              <p>
                Additonally Featured For:{" "}
                <span className="value">
                  {listing?.config?.current?.addOns?.featured?.days || 0} days
                </span>
              </p>
              <p>
                Additionally Highlighted For:{" "}
                <span className="value">
                  {listing?.config?.current?.addOns?.highlighted?.days || 0}{" "}
                  days
                </span>
              </p>
              <p>
                Additionally on Homepage For:{" "}
                <span className="value">
                  {listing?.config?.current?.addOns?.homepageGallery?.days || 0}{" "}
                  days
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="config_header">
              Extras{" "}
              <span className="num">
                {Object.keys(listing?.config?.current?.extras || {}).length}
              </span>
            </h3>
            <div className="details">
              <p>
                Business Ad{" "}
                <span className="value">
                  {listing?.config?.current?.extras?.business ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Additional link to Website{" "}
                <span className="value">
                  {listing?.config?.current?.extras?.website ? "Yes" : "No"}
                </span>
              </p>
              <p>
                Additional link to Youtube{" "}
                <span className="value">
                  {listing?.config?.current?.extras?.youtube ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="total">
          Total:{" "}
          <span className="price">${listing?.config?.current?.total}</span>
        </p>
      </div>
      <ConfigPanel listing={listing} />

      {edit && (
        <Modal
          close={(e) => setEdit(false)}
          className={"ad"}
          heading={"Update ad config"}
        >
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
    </div>
  );
}

export default Config;

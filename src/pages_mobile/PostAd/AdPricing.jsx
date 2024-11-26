import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../store/cartSlice";
import Play from "../../components/IconPlayer";
import Checkbox from "../../components_mobile/shared/Checkbox";
import Modal from "../../components_mobile/Modal";
import Input from "../../components/Shared/Input";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Info from "../../components/Info";
import { Package } from "../../components_mobile/PricingComponents";
import Balloon from "../../assets/animatedIcons/balloon.json";
import AirplaneIcon from "../../assets/animatedIcons/airplane.json";
import Rocket from "../../assets/animatedIcons/rocket.json";

import CheckIcon from "@mui/icons-material/Check";
import BusinessInfo from "../../components/BusinessInfo";
import Dropdown from "../../components/Shared/Dropdown";
import { setFormData } from "../../store/adSlice";
import {
  AddCircleOutline,
  AutoAwesomeOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { PackageIcon } from "styled-icons/feather";

function AdPricing({ category, preconfig, ignoreFree }) {
  const formData = useSelector((state) => state.ad);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth);
  const [showBusinessInfoForm, setShowBusinessInfoForm] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (preconfig) dispatch(updateCart({ ...preconfig, addOns: {} }));
  }, []);
  useEffect(() => {
    console.log(cart);
  }, [cart]);
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener to window resize and orientation change events
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  return (
    <>
      <div className="pricing_section">
        <h2 style={{ marginTop: "4px" }}>
          {" "}
          <PackageIcon className="package_icon" /> Pick a Package
        </h2>
        {width < "1000" && (
          <div className={"package_select " + cart.package?.name}>
            <div
              className={
                "Basic" + (cart.package?.name == "Basic" ? " active" : "")
              }
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Basic",
                      item: category?.pricing?.Basic,
                    },
                  })
                )
              }
            >
              Basic
            </div>
            <div
              className={
                "Standard" + (cart.package?.name == "Standard" ? " active" : "")
              }
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Standard",
                      item: category?.pricing?.Standard,
                    },
                  })
                )
              }
            >
              Standard
            </div>
            <div
              className={
                "Premium" + (cart.package?.name == "Premium" ? " active" : "")
              }
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Premium",
                      item: category?.pricing?.Premium,
                    },
                  })
                )
              }
            >
              Premium
            </div>
          </div>
        )}{" "}
        {width < "1000" && (
          <Package
            ignoreFree={ignoreFree}
            plan={cart.package?.item}
            name={cart.package?.name}
            category={category}
            ads={user?.data?.postedAds}
          />
        )}{" "}
        {width > "1000" && (
          <div className="plans">
            <Package
              ignoreFree={ignoreFree}
              plan={category?.pricing?.Premium}
              name="Premium"
              category={category}
              selected={cart?.package?.name == "Premium"}
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Premium",
                      item: category?.pricing?.Premium,
                    },
                  })
                )
              }
              ads={user?.data?.postedAds}
            />
            <Package
              ignoreFree={ignoreFree}
              plan={category?.pricing?.Standard}
              name="Standard"
              category={category}
              selected={cart?.package?.name == "Standard"}
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Standard",
                      item: category?.pricing?.Standard,
                    },
                  })
                )
              }
              ads={user?.data?.postedAds}
            />
            <Package
              ignoreFree={ignoreFree}
              plan={category?.pricing?.Basic}
              name="Basic"
              category={category}
              selected={cart?.package?.name == "Basic"}
              onClick={() =>
                dispatch(
                  updateCart({
                    ...cart,
                    package: {
                      name: "Basic",
                      item: category?.pricing?.Basic,
                    },
                  })
                )
              }
              ads={user?.data?.postedAds}
            />
          </div>
        )}
      </div>
      <div className="pricing_section">
        <h2>
          {" "}
          <AddCircleOutline /> Add-Ons for your Ad
        </h2>
        <div className="add_ons">
          {category?.pricing?.AddOns?.homepageGallery && (
            <AddOn
              addOn={category.pricing.AddOns.homepageGallery}
              name={"Listed on Homepage Gallery"}
              selected={cart?.addOns?.homepageGallery}
              setSelected={(val) =>
                dispatch(
                  updateCart({
                    ...cart,
                    addOns: { ...cart.addOns, homepageGallery: val },
                  })
                )
              }
              type={"homepage"}
            />
          )}
          {category?.pricing?.AddOns?.highlighted && (
            <AddOn
              addOn={category.pricing.AddOns.highlighted}
              name={"Highlighted Ad for"}
              selected={cart?.addOns?.highlighted}
              setSelected={(val) =>
                dispatch(
                  updateCart({
                    ...cart,
                    addOns: { ...cart.addOns, highlighted: val },
                  })
                )
              }
              type={"highlighted"}
            />
          )}
          {category?.pricing?.AddOns?.featured && (
            <AddOn
              addOn={category.pricing.AddOns.featured}
              name={"Featured Ad for"}
              selected={cart?.addOns?.featured}
              setSelected={(val) =>
                dispatch(
                  updateCart({
                    ...cart,
                    addOns: { ...cart.addOns, featured: val },
                  })
                )
              }
              type={"featured"}
            />
          )}
          {category?.pricing?.AddOns?.bumpUp && (
            <AddOn
              addOn={category.pricing.AddOns.bumpUp}
              name={"Bump Up Your Ad Every"}
              selected={cart?.addOns?.bumpUp}
              setSelected={(val) =>
                dispatch(
                  updateCart({
                    ...cart,
                    addOns: { ...cart.addOns, bumpUp: val },
                  })
                )
              }
              type={"bumpUp"}
            />
          )}
        </div>
      </div>
      <div className="pricing_section">
        <h2>
          <AutoAwesomeOutlined /> Extras for your Ad
        </h2>
        <div className="extra">
          <div className="info">
            <Checkbox
              checked={cart?.extras?.business}
              setChecked={(v) =>
                dispatch(
                  updateCart({
                    ...cart,
                    extras: {
                      business: v ? category.pricing.Extras.business : null,
                    },
                  })
                )
              }
            />
            <h3>
              Business Ad{" "}
              <Info
                heading={"Business Ad"}
                info={
                  "Business ads include your business details and are great for building your business's reach on the platform."
                }
              />
            </h3>
            <p className="price">
              ${category?.pricing?.Extras?.business?.price}
            </p>
          </div>

          <div className={"form" + (cart?.extras?.business ? " active" : "")}>
            {user?.BusinessInfo?.name &&
              user.BusinessInfo?.LOGO &&
              user.BusinessInfo.address && (
                <div className="business_ov">
                  <img src={user?.BusinessInfo.LOGO} alt="" />
                  <div>
                    <h4>{user?.BusinessInfo?.name}</h4>
                    <p>{user?.BusinessInfo?.address}</p>
                  </div>
                </div>
              )}
            {(!user.BusinessInfo?.name ||
              !user.BusinessInfo?.LOGO ||
              !user.BusinessInfo.address) && (
              <div className="no_business_info">
                Please Enter your Business Info to Post as a Business
              </div>
            )}
            <button
              className="review_business_info btn_blue_m"
              onClick={(e) => setShowBusinessInfoForm(true)}
            >
              Edit Business Info
            </button>
          </div>
        </div>
        {!cart?.extras?.business && (
          <>
            <div className="extra">
              <div className="info">
                <Checkbox
                  checked={cart?.extras?.website}
                  setChecked={(v) =>
                    dispatch(
                      updateCart({
                        ...cart,
                        extras: {
                          ...cart.extras,
                          website: v ? category.pricing.Extras.website : null,
                        },
                      })
                    )
                  }
                />
                <h3>
                  Add Website URL{" "}
                  <Info
                    heading={"Adding a Website"}
                    info={
                      "Adding a link to your website or a link to someplace about your service or product are great to provide all details and information about the item in question and can lead to a higher demand."
                    }
                  />
                </h3>
                <p className="price">
                  ${category?.pricing?.Extras?.website?.price}
                </p>
              </div>
              <div
                className={"form" + (cart?.extras?.website ? " active" : "")}
              >
                <div className="field_container">
                  <Input
                    value={cart?.extras?.website?.url || ""}
                    placeholder={"Website URL"}
                    onChange={(e) =>
                      dispatch(
                        updateCart({
                          ...cart,
                          extras: {
                            ...cart.extras,
                            website: {
                              ...cart?.extras?.website,
                              url: e.target.value,
                            },
                          },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="extra">
              <div className="info">
                <Checkbox
                  checked={cart?.extras?.youtube}
                  setChecked={(v) =>
                    dispatch(
                      updateCart({
                        ...cart,
                        extras: {
                          ...cart.extras,
                          youtube: v ? category.pricing.Extras.youtube : null,
                        },
                      })
                    )
                  }
                />
                <h3>
                  Add Youtube Video{" "}
                  <Info
                    heading={"Adding a Youtube video"}
                    info={
                      "Youtube videos about your service or product are great to provide all details and information about the item in question and can lead to a higher demand."
                    }
                  />
                </h3>
                <p className="price">
                  ${category?.pricing?.Extras?.youtube?.price}
                </p>
              </div>
              <div
                className={"form" + (cart?.extras?.youtube ? " active" : "")}
              >
                <div className="field_container">
                  <Input
                    value={cart?.extras?.youtube?.url || ""}
                    placeholder={"Youtube video URL"}
                    onChange={(e) =>
                      dispatch(
                        updateCart({
                          ...cart,
                          extras: {
                            ...cart.extras,
                            youtube: {
                              ...cart?.extras?.youtube,
                              url: e.target.value,
                            },
                          },
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {showBusinessInfoForm && (
        <Modal
          close={(e) => setShowBusinessInfoForm(false)}
          className={"payment"}
          heading={
            <span>
              <EditOutlined /> Edit Business Info
            </span>
          }
        >
          <BusinessInfo close={(e) => setShowBusinessInfoForm(false)} />
        </Modal>
      )}
    </>
  );
}
function AddOn({ addOn, setSelected, name, selected, type }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (selected) {
      setSelected(addOn[current]);
    }
  }, [current]);
  return (
    <div className="add_on">
      <h3>{name} </h3>{" "}
      {type == "bumpUp" && (
        <Info info="After the ad is posted it gradually loses rankings as new ads get posted. A bump up makes your ad go to the top rankings again and is great to keep your ad fresh and in front of the buyers."></Info>
      )}
      {type == "featured" && (
        <Info
          info={
            "Featured ads will be placed above other ads and are a great way to grab the buyer's attention first."
          }
        />
      )}
      {type == "highlighted" && (
        <Info info="Highlighted ads have special styles applied to stand out from other ads and grab the buyers attenton over others." />
      )}
      {type == "homepage" && (
        <Info
          info={
            "Listing your ad on the Homepage gallery is great for collecting a lot of impressions and interaction. It's the best place for your Ad to show up on."
          }
        />
      )}
      <div className="addon_select">
        {addOn.map((item, index) => {
          return (
            <div
              onClick={() => {
                if (selected && current == index) setSelected(null);
                if ((selected && current != index) || !selected) {
                  setCurrent(index);
                  setSelected(item);
                }
              }}
              className={current == index && selected ? "selected" : ""}
            >
              {item.frequency
                ? "every " + item.frequency + " days"
                : "+" + item.days + " days"}{" "}
              for
              <span>${item.price}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AdPricing;

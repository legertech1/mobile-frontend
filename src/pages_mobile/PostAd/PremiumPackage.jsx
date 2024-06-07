import React, { useEffect, useRef, useState } from "react";
import AccordionItem from "../../components/Accordion/index";
import PlaneIcon from "../../assets/animatedIcons/paper-plane.json";
import AirplaneIcon from "../../assets/animatedIcons/airplane.json";
import Rocket from "../../assets/animatedIcons/rocket.json";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Player } from "@lordicon/react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../../components_mobile/shared/Checkbox";
import Dropdown from "../../components_mobile/shared/Dropdown";
import { updateCart } from "../../store/cartSlice";
import Input from "../../components_mobile/shared/Input";
import Button from "../../components_mobile/shared/Button";
import Modal from "../../components_mobile/Modal";
import BusinessInfo from "../../components_mobile/BusinessInfo";
import { setFormData } from "../../store/adSlice";
import "./PremiumPackage.css";

let plans = ["Basic", "Standard", "Premium"];

export default function PremiumPackage({ categoryIndex, formData }) {
  const categories = useSelector((state) => state.categories);
  const user = useSelector((state) => state.auth);
  const ads = user?.data?.postedAds;
  const category = categories[categoryIndex];

  const [showBusinessInfoForm, setShowBusinessInfoForm] = useState(false);
  const cart = useSelector((state) => state.cart);

  const [activeIndex, setActiveIndex] = useState(0);

  const [currPlanIndex, setCurrPlanIndex] = useState(0);

  const dispatch = useDispatch();

  const handleHeaderClick = (index, plan, free) => {
    setActiveIndex(index === activeIndex ? null : index);
    setCurrPlanIndex(index);
    dispatch(
      updateCart({
        ...cart,
        package: {
          name: plan,
          item: categories[categoryIndex]?.pricing[plan],
          free,
        },
      })
    );
  };

  return (
    <div className="mobile_packages">
      <div className="plans">
        <p className="title">Pick a plan that fits</p>
        {plans.map((plan, index) => {
          let itemPlan = categories[categoryIndex]?.pricing?.[plan];

          const free = (ads[category] || 0) < itemPlan.freeAds;
          let selected = currPlanIndex === index;

          const getTitle = () => {
            let title = `${plan} - ${itemPlan?.price}$`;
            title = free ? `Free ( upto ${itemPlan.freeAds} ads )` : title;

            return title + (selected ? " - Selected" : "");
          };

          return (
            <AccordionItem
              isOpen={index === activeIndex}
              onHeaderClick={() => handleHeaderClick(index, plan, free)}
              headerClass={`plan_header ${plan}`}
              bodyClass={`${selected ? "selected" : ""}`}
              key={plan}
              title={getTitle()}
              description={
                <Package
                  plan={itemPlan}
                  name={plan}
                  category={categories[categoryIndex]}
                  selected={formData?.cart?.package?.name == plan}
                />
              }
            />
          );
        })}
      </div>
      <p className="title">Features to Promote your Ad</p>
      <div className="features">
        <div className="add_ons">
          {categories[categoryIndex]?.pricing?.AddOns?.homepageGallery && (
            <AddOn
              addOn={categories[categoryIndex].pricing.AddOns.homepageGallery}
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
            />
          )}
          {categories[categoryIndex]?.pricing?.AddOns?.highlighted && (
            <AddOn
              addOn={categories[categoryIndex].pricing.AddOns.highlighted}
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
            />
          )}
          {categories[categoryIndex]?.pricing?.AddOns?.featured && (
            <AddOn
              addOn={categories[categoryIndex].pricing.AddOns.featured}
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
            />
          )}
          {categories[categoryIndex]?.pricing?.AddOns?.bumpUp && (
            <AddOn
              addOn={categories[categoryIndex].pricing.AddOns.bumpUp}
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
            />
          )}
        </div>
      </div>
      <p className="title">Some extras to enhance your Ad</p>
      <div className="extras">
        <div className="extra">
          <div className="info">
            <Checkbox
              checked={cart?.extras?.business}
              setChecked={(v) =>
                dispatch(
                  updateCart({
                    ...cart,
                    extras: {
                      business: v
                        ? categories[categoryIndex].pricing.Extras.business
                        : null,
                    },
                  })
                )
              }
            />
            <h3>Post as Business Ad</h3>
            <p className="price">
              ${categories[categoryIndex]?.pricing?.Extras?.business?.price}
            </p>
          </div>

          <div className={"form" + (cart?.extras?.business ? " active" : "")}>
            {user?.BusinessInfo?.name && user.BusinessInfo?.LOGO && (
              <div className="business_ov">
                <img src={user?.BusinessInfo.LOGO} alt="" />
                <div>
                  <h4>{user?.BusinessInfo?.name}</h4>
                  <p>{user?.BusinessInfo?.address}</p>
                </div>
              </div>
            )}
            {(!user.BusinessInfo?.name || !user.BusinessInfo?.LOGO) && (
              <p className="para error_para">
                Please Enter your Business Info to Post as a Business
              </p>
            )}
            <Button onClick={(e) => setShowBusinessInfoForm(true)}>
              Edit Business Info
            </Button>
            {showBusinessInfoForm && (
              <Modal close={(e) => setShowBusinessInfoForm(false)}>
                <BusinessInfo close={(e) => setShowBusinessInfoForm(false)} />
              </Modal>
            )}
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
                          website: v
                            ? categories[categoryIndex].pricing.Extras.website
                            : null,
                        },
                      })
                    )
                  }
                />
                <h3>Add your Website</h3>
                <p className="price">
                  ${categories[categoryIndex]?.pricing?.Extras?.website?.price}
                </p>
              </div>
              <div
                className={"form" + (cart?.extras?.website ? " active" : "")}
              >
                <div className="field_container">
                  <div className="field_info">
                    <h4>Website URL: </h4>
                    <p className="para">
                      Add a link to your website for people to be able to visit
                      through your Ad.
                    </p>
                  </div>
                  <Input
                    value={formData?.website}
                    onChange={(e) =>
                      dispatch(
                        setFormData({
                          ...formData,
                          website: e.target.value,
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
                          youtube: v
                            ? categories[categoryIndex].pricing.Extras.youtube
                            : null,
                        },
                      })
                    )
                  }
                />
                <h3>Add a Youtube Video</h3>
                <p className="price">
                  ${categories[categoryIndex]?.pricing?.Extras?.youtube?.price}
                </p>
              </div>
              <div
                className={"form" + (cart?.extras?.youtube ? " active" : "")}
              >
                <div className="field_container">
                  <div className="field_info">
                    <h4>Youtube video URL: </h4>
                    <p className="para">
                      Add a link to a Youtube Video about your product for
                      people to be able to visit through the Ad.
                    </p>
                  </div>
                  <Input
                    value={formData?.youtube}
                    onChange={(e) =>
                      dispatch(
                        setFormData({
                          ...formData,
                          youtube: e.target.value,
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
    </div>
  );
}

function Package({ plan, name, category }) {
  if (!plan) return <></>;
  return (
    <>
      <div
        className={`package_section`}
        style={
          {
            // border: selected ? "2px solid #FFC000" : "2px solid #EDEDED",
            // boxShadow: selected ? "0px 0px 10px 0px #FFC000" : "none",
          }
        }
      >
        <div className="icon_cont">
          <Play
            icon={(() => {
              if (name == "Basic") return PlaneIcon;
              else if (name == "Standard") return AirplaneIcon;
              else if (name == "Premium") return Rocket;
            })()}
          />
        </div>
        <div className="details">
          {plan.images ? (
            <div>
              {" "}
              <DoneAllIcon />
              {plan.images} Images
            </div>
          ) : (
            ""
          )}
          {plan.bumpUpFrequency ? (
            <div>
              <DoneAllIcon /> Bump up every {plan.bumpUpFrequency} days
            </div>
          ) : (
            ""
          )}
          {plan.featured ? (
            <div>
              <DoneAllIcon /> Featured Ad for {plan.featured} days
            </div>
          ) : (
            ""
          )}
          {plan.highlighted ? (
            <div>
              <DoneAllIcon /> Highlighted Ad for {plan.highlighted} days
            </div>
          ) : (
            ""
          )}
          {plan.homepageGallery ? (
            <div>
              <DoneAllIcon /> Listed on Homepage for {plan.homepageGallery} days
            </div>
          ) : (
            ""
          )}
          <div>
            <DoneAllIcon /> Expires in {category?.rules?.adDuration} days
          </div>
        </div>
      </div>
      <div className="selected_badge">
        <span>Selected</span>
      </div>
    </>
  );
}

function Play({ icon }) {
  const playerRef = useRef();

  useEffect(() => {
    playerRef.current?.playFromBeginning();
    const int = setInterval(() => playerRef.current?.playFromBeginning(), 5000);
    return () => clearInterval(int);
  }, []);

  return <Player ref={playerRef} icon={icon} />;
}

function AddOn({ addOn, setSelected, name, selected }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (selected) {
      setSelected(addOn[current]);
    }
  }, [current]);
  return (
    <div className="add_on">
      <div className="checkbox_cont">
        {" "}
        <Checkbox
          checked={selected}
          setChecked={(e) =>
            !selected ? setSelected(addOn[current]) : setSelected(null)
          }
        />
      </div>
      <div className="flex_col">
        <div>
          <h3>{name}</h3>
        </div>
        <div className="flex_row">
          <div>
            <span className="price">${addOn[current].price}</span>
          </div>
          <div>
            <Dropdown
              value={
                (addOn[current].days || addOn[current].frequency) + " days"
              }
              array={addOn.map((item, index) => {
                return {
                  text: (item.days || item.frequency) + " days",
                  index: index,
                };
              })}
              setValue={(v) => setCurrent(v.index)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

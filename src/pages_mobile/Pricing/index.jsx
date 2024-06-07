import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccordionItem from "../../components/Accordion";
import PlaneIcon from "../../assets/animatedIcons/paper-plane.json";
import AirplaneIcon from "../../assets/animatedIcons/airplane.json";
import Rocket from "../../assets/animatedIcons/rocket.json";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Player } from "@lordicon/react";
import "./index.css";
import Dropdown from "../../components_mobile/shared/Dropdown";
import { updateCart } from "../../store/cartSlice";
import Checkbox from "../../components_mobile/shared/Checkbox";
import Input from "../../components_mobile/shared/Input";

let plans = ["Basic", "Standard", "Premium"];

export default function Pricing() {
  const categories = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("");
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  return (
    <>
      <div className="mobile_pricing">
        <p className="center">
          Explore our pricing plans and choose the one that suits your needs.
        </p>
        <div>
          {categories.map((cat) => {
            return (
              <AccordionItem
                key={cat.name}
                title={cat.name}
                isOpen={selectedCategory == cat}
                onHeaderClick={() => {
                  setSelectedCategory(selectedCategory == cat ? null : cat);
                  setCategoryIndex(categories.indexOf(cat));
                  setSelectedPlan(null);
                }}
                description={
                  <div key={cat.name}>
                    {plans.map((plan, index) => {
                      let itemPlan = cat?.pricing?.[plan];

                      return (
                        <AccordionItem
                          key={plan}
                          onHeaderClick={() => {
                            setSelectedPlan(selectedPlan == plan ? null : plan);
                          }}
                          isOpen={
                            selectedCategory == cat && selectedPlan == plan
                          }
                          headerClass={`plan_header ${plan}`}
                          title={`${plan} - ${itemPlan?.price}$ ( upto ${itemPlan.freeAds} ads free )`}
                          description={
                            <Package
                              key={plan}
                              plan={itemPlan}
                              name={plan}
                              category={cat}
                            />
                          }
                        />
                      );
                    })}
                  </div>
                }
                headerClass="category_header"
              />
            );
          })}
        </div>
        <div>
          <p className="title center">Features to Promote your Ad</p>
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
          <p className="title center">Some extras to enhance your Ad</p>
          <div className="extras">
            <div className="extra">
              <div className="info">
                <h3>Post as Business Ad</h3>
                <p className="price">
                  ${categories[categoryIndex]?.pricing?.Extras?.business?.price}
                </p>
              </div>
            </div>
            {!cart?.extras?.business && (
              <>
                <div className="extra">
                  <div className="info">
                    <h3>Add your Website</h3>
                    <p className="price">
                      $
                      {
                        categories[categoryIndex]?.pricing?.Extras?.website
                          ?.price
                      }
                    </p>
                  </div>
                </div>
                <div className="extra">
                  <div className="info">
                    <h3>Add a Youtube Video</h3>
                    <p className="price">
                      $
                      {
                        categories[categoryIndex]?.pricing?.Extras?.youtube
                          ?.price
                      }
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Package({ plan, name, category }) {
  if (!plan) return;

  return (
    <>
      <div className={`package_section`}>
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
    <div className="flex_row add_on">
      <div className="flex_col">
        <h3>{name}</h3>
        <span className="price">${addOn[current].price}</span>
      </div>
      <div>
        <Dropdown
          value={(addOn[current].days || addOn[current].frequency) + " days"}
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
  );
}

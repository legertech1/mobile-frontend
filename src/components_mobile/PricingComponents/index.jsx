import Play from "../../components/IconPlayer";

import Dropdown from "../../components/Shared/Dropdown";
import Checkbox from "../shared/Checkbox";
import { CheckmarkCircle as CheckIcon } from "@styled-icons/evaicons-solid/CheckmarkCircle";
import { CloseCircleOutline as CloseOutlinedIcon } from "@styled-icons/evaicons-outline/CloseCircleOutline";
import Balloon from "../../assets/animatedIcons/balloon.json";
import AirplaneIcon from "../../assets/animatedIcons/airplane.json";
import Rocket from "../../assets/animatedIcons/rocket.json";
import { useEffect, useState } from "react";
import Info from "../../components/Info";
import "./index.css";
export function Package({
  plan,
  name,
  category,
  selected,
  onClick = () => {},
  ads,
  ignoreFree,
}) {
  if (!plan) return <></>;
  const free = ads ? (ads[category.name]?.free || 0) < plan.freeAds : false;

  return (
    <div
      className={"_package" + (selected ? " selected" : "") + " " + name}
      onClick={() => onClick(free)}
    >
      <div className={"coloured " + name}>
        <div className="icon">
          <Play
            icon={(() => {
              if (name == "Basic") return Balloon;
              else if (name == "Standard") return AirplaneIcon;
              else if (name == "Premium") return Rocket;
            })()}
          />
        </div>
        <h1 className={name}>
          {name} <span></span>
        </h1>
      </div>
      <div className="lower">
        <div className="details">
          <div>
            {" "}
            <span className={plan.images ? "blue" : "red"}>
              {plan.images ? <CheckIcon /> : <CloseOutlinedIcon />}
            </span>
            Post upto {plan.images} images
          </div>

          <div>
            <span>
              <span className={plan.featured ? "blue" : "red"}>
                {plan.featured ? <CheckIcon /> : <CloseOutlinedIcon />}
              </span>
            </span>{" "}
            Featured Ad for {plan.featured || 0} days{" "}
            <Info
              heading={"Featured Ad"}
              info={
                "Featured ads will be placed above other ads and are a great way to grab the buyer's attention first."
              }
            />
          </div>

          <div>
            <span>
              <span className={plan.highlighted ? "blue" : "red"}>
                {plan.highlighted ? <CheckIcon /> : <CloseOutlinedIcon />}
              </span>
            </span>{" "}
            Highlighted Ad for {plan.highlighted || 0} days{" "}
            <Info
              heading={"Highlighted Ad"}
              info="Highlighted ads have special styles applied to stand out from other ads and grab the buyers attenton over others."
            />
          </div>

          <div>
            <span>
              <span className={plan.homepageGallery ? "blue" : "red"}>
                {plan.homepageGallery ? <CheckIcon /> : <CloseOutlinedIcon />}
              </span>
            </span>{" "}
            Listed on Homepage for {plan.homepageGallery || 0} days{" "}
            <Info
              heading={"Homepage Gallery"}
              info={
                "Listing your ad on the Homepage gallery is great for collecting a lot of impressions and interaction. It's the best place for your Ad to show up on."
              }
            />
          </div>
          <div>
            <span>
              <CheckIcon />
            </span>{" "}
            Expires in {category?.rules?.adDuration || 0} days
          </div>
        </div>
        {free && !ignoreFree ? (
          <button className={"select_package " + name}>
            <span className="fr">Free </span>
            <p className="free_text">
              {" "}
              ($
              {String(plan.price).includes(".")
                ? plan.price
                : plan.price + ".00"}{" "}
              after {plan.freeAds} listings)
            </p>
          </button>
        ) : (
          <button className={"select_package " + name}>
            $
            {String(plan.price).includes(".") ? plan.price : plan.price + ".00"}
          </button>
        )}
      </div>
    </div>
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
    <div className="_add_on">
      <Checkbox
        checked={selected}
        setChecked={(e) =>
          !selected ? setSelected(addOn[current]) : setSelected(null)
        }
      />{" "}
      <h3>{name} </h3>{" "}
      {type == "bumpUp" && (
        <Info
          heading={"Bump Up"}
          info="After the ad is posted it gradually loses rankings as new ads get posted. A bump up makes your ad go to the top rankings again and is great to keep your ad fresh and in front of the buyers."
        ></Info>
      )}
      {type == "featured" && (
        <Info
          heading={"Featured Ad"}
          info={
            "Featured ads will be placed above other ads and are a great way to grab the buyer's attention first."
          }
        />
      )}
      {type == "highlighted" && (
        <Info
          heading={"Highlighted Ad"}
          info="Highlighted ads have special styles applied to stand out from other ads and grab the buyers attenton over others."
        />
      )}
      {type == "homepage" && (
        <Info
          heading={"Homepage Gallery"}
          info={
            "Listing your ad on the Homepage gallery is great for collecting a lot of impressions and interaction. It's the best place for your Ad to show up on."
          }
        />
      )}
      <Dropdown
        value={(addOn[current].days || addOn[current].frequency) + " days"}
        array={addOn.map((item, index) => {
          return {
            text: (item.days || item.frequency) + " days",
            index: index,
          };
        })}
        setValue={(v) => setCurrent(v.index)}
      />{" "}
      <span className="price">${addOn[current].price}</span>
    </div>
  );
}

import React, { useState } from "react";
import Dropdown from "../Shared/Dropdown";
import { useSelector } from "react-redux";
import "./index.css";
import { Package } from "../../pages/PostAd/AdPricing";
function OurPricing() {
  const categories = useSelector((state) => state.categories);
  const [category, setCategory] = useState("Real Estate");
  // const user = useSelector((state) => state.auth);
  return (
    <div className="our_pricing  pricing_section">
      <h1>Our Pricing </h1>
      <div className="controls">
        <p> Select a category to view pricing for </p>
        <hr />
        <Dropdown
          array={categories.map((c) => c.name)}
          icons={categories.map((c) => (
            <img src={c.icon} />
          ))}
          setValue={(v) => setCategory(v)}
          value={category}
        />
      </div>
      <div className="packages plans">
        <Package
          plan={
            categories?.reduce((a, c) => (c.name == category ? c : a), null)
              ?.pricing?.Premium
          }
          name="Premium"
          category={categories?.reduce(
            (a, c) => (c.name == category ? c : a),
            null
          )}
          ads={{data:{postedAds:{}}}}
        />
        <Package
          plan={
            categories?.reduce((a, c) => (c.name == category ? c : a), null)
              ?.pricing?.Standard
          }
          name="Standard"
          category={categories?.reduce(
            (a, c) => (c.name == category ? c : a),
            null
          )}
          ads={{data:{postedAds:{}}}}
        />
        <Package
          plan={
            categories?.reduce((a, c) => (c.name == category ? c : a), null)
              ?.pricing?.Basic
          }
          name="Basic"
          category={categories?.reduce(
            (a, c) => (c.name == category ? c : a),
            null
          )}
          ads={{data:{postedAds:{}}}}
        />
      </div>
    </div>
  );
}

export default OurPricing;

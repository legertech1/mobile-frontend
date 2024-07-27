import React, { useEffect, useState } from "react";
import Dropdown from "../../components/Shared/Dropdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import ModalSelector from "../ModalSelector";
import Modal from "../Modal";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import ripple from "../../utils/ripple";
import { Package } from "../PricingComponents";

function Pricing() {
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories);
  const [categoryModal, setCategoryModal] = useState(false);
  const [pkg, setPkg] = useState("Basic");

  const [category, setCategory] = useState();
  useEffect(() => {
    if (categories[0] && !category) setCategory(categories[0]);
  }, [categories]);
  return (
    <div className="_pricing">
      {Boolean(categories.length) && category && (
        <>
          {" "}
          <div
            className="category"
            onClick={(e) => {
              ripple(e, { cb: () => setCategoryModal(true), dur: 1 });
            }}
          >
            {" "}
            {category?.icon && <img src={category.icon} />}
            {category?.name}
          </div>
          <div className={"package_select " + pkg}>
            <div
              className={"Basic" + (pkg == "Basic" ? " active" : "")}
              onClick={() => setPkg("Basic")}
            >
              Basic
            </div>
            <div
              className={"Standard" + (pkg == "Standard" ? " active" : "")}
              onClick={() => setPkg("Standard")}
            >
              Standard
            </div>
            <div
              className={"Premium" + (pkg == "Premium" ? " active" : "")}
              onClick={() => setPkg("Premium")}
            >
              Premium
            </div>
          </div>
          <Package
            plan={
              categories?.reduce(
                (a, c) => (c.name == category.name ? c : a),
                null
              )?.pricing[pkg]
            }
            name={pkg}
            category={categories?.reduce(
              (a, c) => (c.name == category.name ? c : a),
              null
            )}
            ads={{ data: { postedAds: {} } }}
          />
        </>
      )}
      {!categories.length && (
        <div className="details_loading">
          <Loader />
        </div>
      )}
      {categoryModal && (
        <Modal
          heading={"Select category"}
          close={(e) => setCategoryModal(false)}
        >
          <ModalSelector
            items={[...categories]}
            close={(e) => setCategoryModal(false)}
            state={category}
            setState={(v) => {
              setCategory(v);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default Pricing;

import { SearchRounded } from "@mui/icons-material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Modal from "../../components_mobile/Modal";
import ModalSelector from "../../components_mobile/ModalSelector";
import React, { useState } from "react";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import { useSelector } from "react-redux";
import ripple from "../../utils/ripple";

function Header({ category, setCategory, categories }) {
  const [categoryModal, setCategoryModal] = useState(false);

  return (
    <div className="header">
      <div className="header-mask"></div>
      <Header />
      <h1>
        Own Nothing, <br />
        Use Everything.
      </h1>

      <div className="search">
        <div className="search-container">
          <SearchRounded />
          <input type="text" placeholder="Looking for something?" />
        </div>
        <div
          className="filters-btn"
          onClick={(e) => {
            ripple(e, 2);
          }}
        >
          <TuneRoundedIcon />
        </div>
      </div>
      <div className="category-n-location">
        <div
          className="category"
          onClick={(e) => {
            ripple(e);
            setCategoryModal(true);
          }}
        >
          {" "}
          {category?.icon && <img src={category.icon} />}
          {category?.name}
        </div>
        <div
          className="location"
          onClick={(e) => {
            ripple(e);
          }}
        >
          <PlaceOutlinedIcon /> Canada
        </div>
      </div>
      {categoryModal && (
        <Modal
          heading={"Select category"}
          close={(e) => setCategoryModal(false)}
        >
          <ModalSelector
            items={[
              { name: "All Categories", icon: CategoriesIcon },
              ...categories,
            ]}
            close={(e) => setCategoryModal(false)}
            state={category}
            setState={setCategory}
          />
        </Modal>
      )}
    </div>
  );
}

export default Header;

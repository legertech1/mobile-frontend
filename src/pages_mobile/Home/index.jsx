import React, { useEffect, useState } from "react";
import "./index.css";
import Header from "./header";
import apis from "../../services/api";
import axios from "axios";
import { useSelector } from "react-redux";
import CategoriesIcon from "../../assets/images/categoriesIcon.png";
import Listings from "../../components_mobile/listings/listings";
export default function Home() {
  const [category, setCategory] = useState({
    name: "All Categories",
    icon: CategoriesIcon,
  });
  const categories = useSelector((state) => state.categories);
  const [homepageGallery, setHomepageGallery] = useState([]);

  const [pageHG, setPageHG] = useState(1);

  const [countHG, setCountHG] = useState(0);

  const [loadingHG, setLoadingHG] = useState(false);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const [loadingMoreHG, setLoadingMoreHG] = useState(false);

  async function getHomepageGallery() {
    const { results, total, page } = (
      await axios.post(apis.search, {
        location: selectedLocation,
        category: category.name,
        additional: { "meta.status": "active" },
        sort: {
          // "meta.featured": -1,
          "meta.listingRank": -1,
        },
        limit: 30,
        page: 1,
        count: true,
        impressions: true,
        random: true,
      })
    ).data;
    setHomepageGallery(results);
    setCountHG(total);
    setLoadingHG(false);
    setPageHG(page);
  }
  useEffect(() => {
    if (selectedLocation) {
      getHomepageGallery();
      setLoadingHG(true);
    }
  }, [selectedLocation, category]);
  return (
    <div className="_home">
      
      <Header
        category={category}
        setCategory={setCategory}
        categories={categories}
      />
      <div className="tabs"></div>
      <div className="results">
        <Listings ads={homepageGallery} />
      </div>
    </div>
  );
}

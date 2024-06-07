import React from "react";
import "./Header.css";
import Navbar from "../../components/Navbar";
import Search from "./Search";
import Card from "./Card";
import carImg from "../../assets/images/Car.jpg";
import houseImg from "../../assets/images/House.jpg";
import factoryImg from "../../assets/images/Factory.jpg";
import vacationImg from "../../assets/images/Vacation.jpeg";

function Header({ setCategory, category }) {
  return (
    <header className="header">
      <div className="header-mask"></div>
      <Navbar></Navbar>
      <main>
        <div className="heading">
          <h1>Own Nothing, Use Everything.</h1>
          <p>
            Your One-Stop Marketplace for Rentals, Leases, Financing and
            Services.
          </p>
        </div>
        <Search category={category} setCategory={setCategory}></Search>
        <div className="cards">
          <Card text={"Real Estate"} img={houseImg} category={"Real Estate"} />
          <Card
            text={"Business & Industries"}
            img={factoryImg}
            category={"Business & Industries"}
          />

          <Card
            text={"Travel, Vacation & Party Space"}
            img={vacationImg}
            category={"Travel, Vacation & Party Space"}
          />
          <Card
            text={"Car, Truck, RVs & Vehicles"}
            img={carImg}
            category={"Car, Truck, RVs & Vehicles"}
          />
        </div>
      </main>
    </header>
  );
}

export default Header;

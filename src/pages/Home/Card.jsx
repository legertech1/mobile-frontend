import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { newSearch } from "../../store/searchSlice";
import { useNavigate } from "react-router-dom";

function Card({ img, text, category }) {
  const imgRef = useRef();
  const divRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function search() {
    dispatch(newSearch({ query: "", category }));

    navigate("/search");
  }

  return (
    <div
      onClick={search}
      className="card"
      onMouseOver={() => {
        imgRef.current.classList.add("hover");
        divRef.current.classList.add("hover");
      }}
      onMouseOut={() => {
        imgRef.current.classList.remove("hover");
        divRef.current.classList.remove("hover");
      }}
    >
      <img ref={imgRef} src={img} alt="" />
      <div ref={divRef}>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Card;

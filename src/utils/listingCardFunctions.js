const { removeFromWishlist, addToWishlist } = require("../store/authSlice");
const imagePlaceholder = require("../assets/images/imagePlaceholder.jpg");

module.exports = {
  next: function (listing, slide, setSlide, e) {
    e.stopPropagation();
    if (slide >= listing?.thumbnails?.length || !listing?.thumbnails) return;

    setSlide(slide + 1);
  },
  prev: function (listing, slide, setSlide, e) {
    e.stopPropagation();
    if (!listing?.thumbnails) return;

    setSlide(slide - 1);
  },

  hover: function (nextBtn, prevBtn, ind) {
    nextBtn?.current?.classList.toggle("active");
    prevBtn?.current?.classList.toggle("active");
    ind?.current?.classList.toggle("active");
  },
  remove: function (listing, setListings, dispatch) {
    dispatch(removeFromWishlist(listing?._id));
    setListings &&
      setListings((listings) => [
        ...listings.filter((item) => item._id != listing?._id),
      ]);
  },

  add: function (listing, user, dispatch, navigate) {
    if (!user) return navigate("/login");
    dispatch(addToWishlist(listing?._id));
  },

  imageFallback: function (e) {
    e.target.src = imagePlaceholder;
  },
};

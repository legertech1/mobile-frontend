import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Shared/Input";
import Dropdown from "../../components/Shared/Dropdown";
import TextArea from "../../components/Shared/TextArea";
import PriceInput from "./PriceInput";
import UploadPictures from "./UploadPictures";

import {
  adLocationTypesExcluded,
  AdTypes,
  defaultMapProps,
  mapStyles,
} from "../../utils/constants";
import Button from "../../components/Shared/Button";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Stepper from "../../components/Stepper";

import "./AdForm.css";
import { useDispatch, useSelector } from "react-redux";
import FieldMap from "../../components/FieldMap";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  setFormData,
  initialAdState,
  updateLocation,
} from "../../store/adSlice";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { Circle, GoogleMap, OverlayView } from "@react-google-maps/api";
import MyAutocomplete from "../../components/Autocomplete";
import apis from "../../services/api";
import axios from "axios";
import Checkbox from "../../components_mobile/shared/Checkbox";
import marker from "../../assets/images/marker.png";
import parseAdressComponents from "../../utils/parseAdressComponents";
import useConfirmDialog from "../../hooks/useConfirmDialog";

import { updateCart } from "../../store/cartSlice";
import useNotification from "../../hooks/useNotification";

import AdPricing from "./AdPricing";
import { useLocalStorage } from "@uidotdev/usehooks";
import Info from "../../components/Info";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PinDropOutlined,
} from "@mui/icons-material";
export default function AdForm({ edit }) {
  const formData = useSelector((state) => state.ad);

  const cart = useSelector((state) => state.cart);
  const [country, setCountry] = useLocalStorage("country", null);
  const navigate = useNavigate();
  const notification = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastLocation, setLastLocation] = useLocalStorage(
    "last_location",
    null
  );
  const [locationError, setLocationError] = useState(null);
  const user = useSelector((state) => state.auth);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [subCategoryIndex, setSubCategoryIndex] = useState(-1);
  const params = useParams();
  const [state, setState] = useState("indefinite");
  const [showBusinessInfoForm, setShowBusinessInfoForm] = useState(false);
  const handleFormData = (name, value) => {
    dispatch(setFormData({ ...formData, [name]: value }));
  };
  useEffect(() => {
    if (user == null) navigate("/login");
  }, [user]);
  function init() {
    if (value) return;
    let loc;
    if (formData?.location) loc = formData?.location;
    else getCurrentLocation();

    loc &&
      setValue({
        name: loc.description || loc.name,
        place_id: loc.place_id,
        coordinates: loc.coordinates,
      });
  }
  useEffect(() => {
    if (categoryIndex > -1) {
      dispatch(
        updateCart({
          ...cart,
          package: {
            name: cart?.package?.name || "Standard",
            item: categories[categoryIndex]?.pricing[
              cart?.package?.name || "Standard"
            ],
          },
        })
      );
    } else if (formData.category) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == formData.category) {
          setCategoryIndex(i);
          if (formData.subCategory) {
            categories[i].subCategories.forEach((c, num) => {
              if (c.name == formData.subCategory) setSubCategoryIndex(num);
            });
          }
        }
      }
    }
  }, [categoryIndex]);

  async function prepareEdit() {
    let ad = null;
    if (!formData._id) {
      const id = params.id;
      ad = (await axios.get(apis.ad + id)).data;

      dispatch(
        setFormData({
          ...ad,
        })
      );
    } else ad = formData;
    categories.forEach((c, i) => {
      if (c.name == ad.meta.category) {
        setCategoryIndex(i);
        c.subCategories.forEach(
          (sc, i) => sc.name == ad.meta.subCategory && setSubCategoryIndex(i)
        );
      }
    });
    setValue(ad.location);
  }

  const confirm = useConfirmDialog();
  let onConfirm = () => {
    dispatch(setFormData(initialAdState));
    dispatch(updateCart({}));
    navigate("/");
  };
  const discard = () => {
    console.log("discard");
    // dispatch(setFormData(initialAdState));
    //               setValue(null);
    //               navigate("/");

    confirm.openDialog("Are you sure you want to discard this ad?", onConfirm);
  };
  useEffect(() => {
    if (!edit) {
      init();
    }

    return () => {
      if (!window.location.href.includes("preview")) {
        dispatch(setFormData(initialAdState));
        dispatch(updateCart({}));
      }
    };
  }, []);

  useEffect(() => {
    if (edit && categories.length) prepareEdit();
  }, [categories]);

  function getLocationData(value, curr) {
    if (value) {
      // if (value.coordinates && curr) dispatch(updateLocation(currentLocation));
      let name = value.label;
      geocodeByAddress(value.description || value.name).then(
        async (results) => {
          const { lat, lng } = await getLatLng(results[0]);
          let address_components = parseAdressComponents(
            results[0].address_components
          );
          if (curr) {
            setCurrentLocation({
              formatted_address: results[0].formatted_address,
              types: results[0].types,
              name: value.description || value.name,
              place_id: value.place_id,
              coordinates: {
                lat: lat,
                long: lng,
              },
              components: address_components,
            });
          } else {
            dispatch(
              updateLocation({
                formatted_address: results[0].formatted_address,
                types: results[0].types,
                name: value.description || value.name,
                place_id: value.place_id,
                coordinates: {
                  lat: lat,
                  long: lng,
                },
                components: address_components,
              })
            );
          }
        }
      );
    } else {
      dispatch(updateLocation(null));
    }
  }

  useEffect(() => {
    if (!value) return;
    getLocationData(value);
  }, [value]);

  useEffect(() => {
    if (value?.description) {
      setLastLocation(value);
    }
  }, [value]);

  useEffect(() => {
    if (!value && lastLocation?.description) {
      setValue(lastLocation);
    }
  }, []);

  const formNav = (step, url) => {
    if (step >= 2) {
      if (formData.title.trim().length < 8)
        return notification.error(
          "Title is required and must be between 8 to 150 characters"
        );

      if (categoryIndex < 0)
        return notification.error("Selecting category is required");
      if (subCategoryIndex < 0)
        return notification.error("Selecting Sub-category is required");
      if (!formData.priceHidden && formData.price.toString().trim().length < 1)
        return notification.error("Price is required");
      if (formData.description.trim().length < 40)
        return notification.error(
          "Description is required and must be between 40 to 8000 characters"
        );
      if (!formData.term && !formData.priceHidden && state != "total")
        return notification.error("Duration term is required");
      if (state == "definite" && !formData.installments) {
        return notification.error("No. of installments is required");
      }
    }
    if (step >= 3) {
      const fields = [
        ...categories[categoryIndex].fields,
        ...categories[categoryIndex].subCategories[subCategoryIndex].fields,
      ];

      for (let field of fields) {
        if (field.required) {
          if (
            (field.inputType == "text" ||
              field.inputType == "number" ||
              field.inputType == "radio" ||
              field.inputType == "dropdown" ||
              field.inputType == "date") &&
            !formData?.extraFields[field.name]?.trim().length
          )
            return notification.error(field.name + " is required");
          else if (
            field.inputType == "checkbox" &&
            formData?.extraFields[field.name] === undefined
          ) {
            return notification.error(field.name + " is required");
          }
        }
      }
    }
    if (edit && step == 4) {
      if (formData.images.length < 1)
        return notification.error("At least one image is required");

      if (!formData.location)
        return notification.error("Selecting a location is required");
      return navigate("/preview-ad?edit=true");
    }
    if (step >= 4) {
      if (!edit && !cart.package.name)
        return notification.error("Please select a package");

      if (!edit && cart?.extras?.business && !user?.BusinessInfo?.name)
        return notification.error("Please provide business details");
      if (formData.location.components.country.short_name != country)
        return notification.error(
          "Please select an address within your selected Country"
        );
    }
    if (step == 5) {
      if (formData.images.length < 1)
        return notification.error("At least one image is required");

      if (!formData.location)
        return notification.error("Selecting a location is required");
      return navigate("/preview-ad");
    }
    setCurrentStep(step);
    document.querySelector(".___app").scrollTo({ top: 0, behavior: "smooth" });
  };

  const findMyLocation = async (coordinates) => {
    // if (user?.currentLocation) setValue(user?.currentLocation);
    try {
      let loc = await axios.get(apis.findMyLocation, {
        params: { ...coordinates, type: "ad" },
      });
      getLocationData(loc.data, true);
    } catch (error) {}
  };

  useEffect(() => {
    if (currentLocation) setValue(currentLocation);
  }, [currentLocation]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position, error) => {
          findMyLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    }
  };

  const onTitleClick = (clickedStep) => {
    if (clickedStep === 1) {
      setCurrentStep(1);
    }
    if (clickedStep === 2) {
      setCurrentStep(2);
    }
    if (clickedStep === 3) {
      setCurrentStep(3);
    }
    if (clickedStep === 4) {
      setCurrentStep(4);
    }
  };

  const tagRef = useRef();

  const stepData = {
    1: (
      <>
        <div className="field_container">
          <div className="field_info">
            <h4>
              Ad Title <span>required</span>
            </h4>
            <p>
              Your Ad's title is the most important place to include keywords
              that buyers will use to search for your Ad. Include key
              information about what you're renting (brand, age, condition, etc)
            </p>
          </div>
          <Input
            placeholder={"Write a concise informative title for your Ad"}
            onChange={(e) => {
              handleFormData("title", e.target.value.slice(0, 150));
            }}
            value={formData.title}
            defaultValue={formData.title}
          ></Input>
        </div>
        {!edit && (
          <div className="field_container">
            <div className="field_info">
              <h4>
                Category and Sub-category <span>required</span>
              </h4>
              <p>
                Choose the most suitable category and subcategory for your Ad.
                Selecting the right values will help buyers get to your ad
                easily by searching in the Category and Sub-category for your
                Ad. Note that the category of an ad cannot be changed after it
                is posted.
              </p>
            </div>
            <div className="dropdowns">
              <Dropdown
                placeholder={"Select category"}
                array={categories.map((item) => item.name)}
                icons={[
                  ...categories.map((item) => <img src={item.icon}></img>),
                ]}
                setValue={(value) => {
                  dispatch(
                    setFormData({
                      ...formData,
                      category: value,
                      subCategory: "",
                      extraFields: {},
                    })
                  );
                  categories.forEach(
                    (item, index) =>
                      item.name == value && setCategoryIndex(index)
                  );
                }}
                value={formData.category}
              ></Dropdown>
              <Dropdown
                placeholder={"Select sub-category"}
                array={categories[categoryIndex]?.subCategories.map(
                  (item) => item.name
                )}
                setValue={(value) => {
                  dispatch(
                    setFormData({
                      ...formData,
                      subCategory: value,
                      extraFields: {},
                    })
                  );
                  categories[categoryIndex]?.subCategories.forEach(
                    (item, index) =>
                      item.name == value && setSubCategoryIndex(index)
                  );
                }}
                value={formData.subCategory}
              ></Dropdown>
            </div>
          </div>
        )}

        <div className="field_container">
          <div className="field_info">
            <h4>
              Ad Type <span>required</span>
            </h4>
            <p>
              Select the option that best describes your offering type—whether
              it’s a service, rental, lease, or financing deal—to clearly
              communicate what users can expect.
            </p>
          </div>
          <div className="ad_type_container mw">
            {AdTypes.map((t) => (
              <div
                className={"ad_type" + (formData.type == t ? " active" : "")}
                onClick={() => {
                  dispatch(setFormData({ ...formData, type: t, term: "" }));
                  // handleFormData("term", "");
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div
          className="field_container price_cont"
          style={{ alignItems: "start" }}
        >
          <div className="field_info">
            <h4>
              Pricing Information <span>required</span>
            </h4>
            <div className="price_hidden">
              <article>
                Do not disclose pricing details. Show{" "}
                <span
                  style={{
                    color: "var(--blue)",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  Please Contact{" "}
                </span>
                instead.
              </article>
              <Checkbox
                checked={formData.priceHidden}
                setChecked={(v) =>
                  dispatch(
                    setFormData({
                      ...formData,
                      priceHidden: v,
                      term: "",
                      price: "",
                      installments: "",
                    })
                  )
                }
              />{" "}
            </div>
          </div>

          <div className={"pricing" + (formData.priceHidden ? " hidden" : "")}>
            <div className="p_field">
              <p className="pricing_text">
                How do you want to display the price?{" "}
                <Info
                  heading={"Display Pricing"}
                  info={
                    <span>
                      {" "}
                      <b>Recurring Payments:</b> Set a regular payment amount
                      that continues indefinitely. Great for ongoing services or
                      rentals without a predetermined end date.
                      <br />
                      <br />
                      <b>Installments:</b> Break down the total price into equal
                      payments over a set period. Ideal for financing or
                      leasing, allowing customers to pay over time.
                      <br />
                      <br />
                      <b>Total Amount:</b> Display the full price upfront. You
                      can discuss and arrange the payment schedule with your
                      customer, offering flexibility.
                    </span>
                  }
                />
              </p>

              <div className="pricing_type">
                <div
                  className={"type" + (state == "indefinite" ? " active" : "")}
                  onClick={() => {
                    setState("indefinite");
                    dispatch(
                      setFormData({
                        ...formData,
                        term: "",
                        price: "",
                        installments: "",
                      })
                    );
                  }}
                >
                  Recurring Payments
                </div>
                <div
                  className={"type" + (state == "definite" ? " active" : "")}
                  onClick={() => {
                    setState("definite");
                    dispatch(
                      setFormData({
                        ...formData,
                        term: "",
                        price: "",
                        installments: "",
                      })
                    );
                  }}
                >
                  Installments
                </div>
                <div
                  className={"type" + (state == "total" ? " active" : "")}
                  onClick={() => {
                    setState("total");
                    dispatch(
                      setFormData({
                        ...formData,
                        term: "",
                        price: "",
                        installments: "",
                      })
                    );
                  }}
                >
                  Total Amount
                </div>
              </div>
            </div>
            <div className="p_field">
              <p className="pricing_text">
                {" "}
                {state == "indefinite"
                  ? "Amount and Term"
                  : state == "definite"
                  ? "Amount, Term and no. of Installments"
                  : "Amount"}
              </p>
              <PriceInput
                type={formData.type}
                installments={formData.installments}
                setInstallments={(e) => {
                  if (isNaN(e.target.value)) return;
                  if (e.target.value.split(".")[1]?.length > 2) return;

                  handleFormData(
                    "installments",
                    e.target.value.trim().slice(0, 3)
                  );
                }}
                reset={() => {
                  dispatch(
                    setFormData({
                      ...formData,
                      term: "",
                      price: "",
                      installments: "",
                    })
                  );
                }}
                state={state}
                term={formData.term}
                price={formData.price}
                setPrice={(e) => {
                  if (isNaN(e.target.value)) return;
                  if (e.target.value.split(".")[1]?.length > 2) return;

                  handleFormData("price", e.target.value.trim().slice(0, 10));
                }}
                onChangeTerm={(t) => {
                  handleFormData("term", t);
                }}
              />
            </div>
            <div className="p_field">
              <p className="pricing_text">Additional Tax</p>
              <div className="tax_cont">
                <div
                  className={"tax" + (formData.tax == "none" ? " active" : "")}
                  onClick={() => handleFormData("tax", "none")}
                >
                  None
                </div>
                <div
                  className={"tax" + (formData.tax == "TAX" ? " active" : "")}
                  onClick={() => handleFormData("tax", "TAX")}
                >
                  TAX
                </div>
                <div
                  className={"tax" + (formData.tax == "HST" ? " active" : "")}
                  onClick={() => handleFormData("tax", "HST")}
                >
                  HST
                </div>
                <div
                  className={"tax" + (formData.tax == "GST" ? " active" : "")}
                  onClick={() => handleFormData("tax", "GST")}
                >
                  GST
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="field_container">
          <div className="field_info">
            <h4>Search Tags </h4>
            <p>
              Use relevant buzzwords to tag your ad with what you're offering.
              You can include up to 5 tags.
            </p>
          </div>

          <div className="_tags">
            {formData?.tags?.length < 5 && (
              <div className="tag_inp">
                <input
                  ref={tagRef}
                  type="text"
                  placeholder={"Enter tags related to your Ad"}
                  onKeyDown={(e) => {
                    if (e.key == "Tab" || e.key == "Enter") e.preventDefault();
                    if (e.key == "Backspace" && e.target.value == "")
                      return dispatch(
                        dispatch(
                          setFormData({
                            ...formData,
                            tags: formData.tags.slice(
                              0,
                              formData.tags.length - 1
                            ),
                          })
                        )
                      );
                    if (
                      (e.key == "Enter" || e.key == "Tab") &&
                      e.target.value
                    ) {
                      const newTag = e.target.value
                        .toLowerCase()
                        .trim()
                        .slice(0, 50);
                      dispatch(
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, newTag],
                        })
                      );
                      e.target.scrollTo({
                        top: 0,
                        left: e.target.innerWidth,
                        behavior: "smooth",
                      });

                      e.target.value = "";
                    }
                  }}
                />
                <button
                  className="add_tag"
                  onClick={() => {
                    const newTag = tagRef.current.value
                      .toLowerCase()
                      .trim()
                      .slice(0, 50);
                    if (!newTag) return;
                    dispatch(
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, newTag],
                      })
                    );
                    tagRef.current.value = "";
                  }}
                >
                  <KeyboardArrowRight />
                </button>
              </div>
            )}
            <div className="tags_cont">
              {formData?.tags?.map((tag, index) => (
                <div className="tag">
                  <pre>{tag} </pre>
                  <span
                    onClick={(e) =>
                      dispatch(
                        setFormData({
                          ...formData,
                          tags: formData.tags.filter((tag, i) => i != index),
                        })
                      )
                    }
                  >
                    {" "}
                    <CloseOutlinedIcon />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="field_container desc">
          <h4>
            Description <span>required</span>
          </h4>
          <TextArea
            onChange={(e) => {
              handleFormData("description", e.target.value.slice(0, 8000));
            }}
            placeholder={
              "Describe your item, include all important details related to the item."
            }
            value={formData.description}
          />
        </div>
      </>
    ),
    2: (
      <>
        {categories[categoryIndex]?.fields?.map((field) => (
          <FieldMap
            field={field}
            state={formData}
            setState={(newState) => dispatch(setFormData(newState))}
          />
        ))}
        {categories[categoryIndex]?.subCategories[
          subCategoryIndex
        ]?.fields?.map((field) => (
          <FieldMap
            field={field}
            state={formData}
            setState={(newState) => dispatch(setFormData(newState))}
          />
        ))}
      </>
    ),
    3: (
      <div className="step3">
        {!edit && <AdPricing category={categories[categoryIndex]} />}
      </div>
    ),
    [edit ? 3 : 4]: (
      <>
        <UploadPictures />
        <div className="location_section">
          <h2>
            {" "}
            <PinDropOutlined />
            Select Ad Location
          </h2>
          <div className="location">
            <div className="selections">
              {" "}
              <MyAutocomplete
                setValue={setValue}
                value={value}
                // excluded={adLocationTypesExcluded}
                country={country.toLowerCase()}
              ></MyAutocomplete>
              <div className="current_loc f">
                <MyLocationIcon className="curr_icon" />
                <div
                  className="text_box"
                  onClick={() => {
                    setValue(currentLocation);
                  }}
                >
                  <p>Use Current Location</p>
                  <p className="curr_loc_text">
                    {currentLocation?.name ||
                      "Please allow location access to use current location"}
                  </p>
                </div>
              </div>
              <div className="location_option">
                <Checkbox
                  checked={formData?.showPreciseLocation}
                  setChecked={(v) =>
                    dispatch(
                      setFormData({
                        ...formData,
                        showPreciseLocation: v,
                      })
                    )
                  }
                />{" "}
                Show my exact location on the map
              </div>
            </div>
            <div className={"map" + (formData.location ? "" : " hidden")}>
              <GoogleMap
                center={
                  {
                    lat: formData.location?.coordinates.lat,
                    lng: formData.location?.coordinates.long,
                  } || defaultMapProps.center
                }
                zoom={defaultMapProps.zoom}
                mapContainerStyle={mapStyles}
                options={{
                  mapTypeControl: false,
                  fullscreenControl: false,
                  streetViewControl: false,
                  rotateControl: false,
                  scaleControl: false,
                }}
              >
                {formData.location && !formData.showPreciseLocation && (
                  <Circle
                    center={{
                      lat: formData?.location?.coordinates.lat,
                      lng: formData?.location?.coordinates.long,
                    }}
                    radius={2000} // in meters
                    options={{
                      fillColor: "#2196f3", // fill color of the circle
                      fillOpacity: 0.4, // opacity of the fill
                      strokeColor: "#2196f3", // border color of the circle
                      strokeOpacity: 0.8, // opacity of the border
                      strokeWeight: 2, // border thickness
                    }}
                    // options={place.circle.options}
                  />
                )}
                {formData.location && formData.showPreciseLocation && (
                  <OverlayView
                    position={{
                      lat: formData?.location?.coordinates.lat,
                      lng: formData?.location?.coordinates.long,
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="map_marker">
                      <img src={marker} alt="" />
                    </div>
                  </OverlayView>
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="post_ad">
      <div className="main">
        <div className="ad_form">
          <div className="step_cont">
            <Stepper
              current={currentStep}
              steps={
                edit
                  ? ["Basic Info", "Specific Details", "Images"]
                  : [
                      "Basic Info",
                      "Specific Details",
                      "Package and Add-ons",
                      "Images and Location",
                    ]
              }
              onClick={formNav}
            />
          </div>
          <div className={"form_content" + (currentStep == 2 ? " _" : "")}>
            {stepData[currentStep]}

            <div className="field btns_cont">
              <button
                className="discard"
                onClick={() => {
                  discard();
                }}
              >
                Discard
              </button>

              <Button
                className="btn_blue_m next_btn"
                onClick={() => formNav(currentStep + 1)}
              >
                {currentStep == 4 ? "Proceed to Preview" : "Save & Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

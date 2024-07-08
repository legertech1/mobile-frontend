import React, { useEffect, useState } from "react";
import Input from "../../components_mobile/shared/Input";
import Button from "../../components_mobile/shared/Button";
import TextArea from "../../components_mobile/shared/TextArea";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { PriceOptions } from "../../utils/constants";
import Dropdown from "../../components_mobile/shared/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import MobileStepper from "../../components_mobile/Stepper";
import FieldMap from "../../components_mobile/FieldMap";
import UploadPictures from "./UploadPictures";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import AdLocation from "./AdLocation";
import { setFormData, initialAdState } from "../../store/adSlice";
import { updateCart } from "../../store/cartSlice";
import axios from "axios";
import apis from "../../services/api";

export default function PostAd({ edit }) {
  const steps = edit
    ? [
        { step: "Basic Info" },
        { step: "Specific Details" },
        { step: "Upload Images" },
      ]
    : [
        { step: "Basic Info" },
        { step: "Specific Details" },
        { step: "Plan and Location" },
        { step: "Upload Images" },
      ];
  const { selectedLocation } = useSelector((state) => state.location);

  const categories = useSelector((state) => state.categories);
  const formData = useSelector((state) => state.ad);

  const cart = useSelector((state) => state.cart);

  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [subCategoryIndex, setSubCategoryIndex] = useState(-1);

  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const params = useParams();
  const editId = params?.id;

  const dispatch = useDispatch();

  const handleFormData = (name, value) => {
    dispatch(setFormData({ ...formData, [name]: value }));
  };

  const { state } = useLocation();
  const [adLoading, setAdLoading] = useState(false);
  const adOldState = state?.ad;

  async function prepareEdit() {
    try {
      setAdLoading(true);
      let ad = null;
      if (!formData._id) {
        ad = (await axios.get(apis.ad + editId)).data;

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
      setAdLoading(false);
    } catch (error) {
      setAdLoading(false);
    }
  }

  useEffect(() => {
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

  useState(() => {
    if (adOldState) {
      setFormData((state) => {
        return {
          ...state,
          ...adOldState,
          category: adOldState.category,
          subCategory: adOldState.subCategory,
          extraFields: adOldState.extraFields,
        };
      });

      setCategoryIndex(
        categories.findIndex((item) => item.name == adOldState.category)
      );
      setSubCategoryIndex(
        categories[categoryIndex]?.subCategories.findIndex(
          (item) => item.name == adOldState.subCategory
        )
      );
    }
  }, [adOldState]);

  const handlePreviewAd = async () => {
    const formDataCopy = { ...formData };
    if (!formDataCopy.location) {
      formDataCopy.location = selectedLocation;
    }
    formDataCopy.thumbnails = formDataCopy.images;
    navigate("/preview-ad", {
      state: {
        ad: formDataCopy,
        editId: editId,
      },
    });
  };

  useEffect(() => {
    if (categoryIndex > -1 && !cart.package) {
      dispatch(
        updateCart({
          ...cart,
          package: {
            name: "Standard",
            item: categories[categoryIndex]?.pricing?.Standard,
          },
        })
      );
    } else if (formData.category) {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == formData.category) {
          setCategoryIndex(i);
        }
      }
    }
  }, [categoryIndex]);

  const handleNext = () => {
    switch (currentStep) {
      case 1:
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        setCurrentStep(currentStep + 1);
        break;
      case 3:
        if (edit) {
          handlePreviewAd();
          return;
        }
        setCurrentStep(currentStep + 1);
        break;
      case 4:
        handlePreviewAd();
      default:
        break;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepData = {
    1: (
      <>
        <div>
          <Input
            label="Ad. Title:"
            required={true}
            onChange={(e) => {
              handleFormData("title", e.target.value);
            }}
            value={formData.title}
            placeholder={"Write an informative title for your Ad"}
          />
        </div>
        {!edit && (
          <div>
            <Dropdown
              label={"Category:"}
              placeholder={"Select category"}
              array={categories.map((item) => item.name)}
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
                  (item, index) => item.name == value && setCategoryIndex(index)
                );
              }}
              value={formData.category}
            ></Dropdown>
          </div>
        )}
        {!edit && (
          <div>
            <Dropdown
              label={"Sub-Category:"}
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
        )}
        <div className="two_col">
          <div className="price_cont">
            <Input
              required={true}
              label="Price:"
              placeholder={"Input price"}
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;

                if (isNaN(value)) return;

                if (value.split(".")[1]?.length > 2) return;
                if (value.length === 1 && value === "0") return;
                handleFormData("price", value);
              }}
            />
          </div>
          <div className="term_cont">
            <Dropdown
              label={"Term:"}
              array={PriceOptions}
              value={formData.term}
              setValue={(value) => {
                handleFormData("term", value);
              }}
            ></Dropdown>
          </div>
        </div>
        <div>
          <label className="mobile_input_label">Search tags</label>

          <div className="tag_inp">
            {formData?.tags?.map((tag, index) => (
              <div className="tag">
                {tag}{" "}
                <CloseOutlinedIcon
                  onClick={(e) =>
                    dispatch(
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((tag, i) => i != index),
                      })
                    )
                  }
                />
              </div>
            ))}
            {formData?.tags?.length < 5 && (
              <input
                type="text"
                placeholder={
                  !formData?.tags?.length ? "Enter tags related to your Ad" : ""
                }
                onChange={(e) => {
                  if (e.target.value[e.target.value.length - 1] == " ") {
                    const tag = e.target.value.trim();
                    if (tag.length) {
                      dispatch(
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tag],
                        })
                      );
                      e.target.value = "";
                    }
                  }
                }}
              />
            )}
          </div>
          <span className="help_text">
            {formData?.tags?.length < 5 &&
              "Press space to add a tag. Max 5 tags allowed"}
          </span>
        </div>
        <div>
          <TextArea
            required={true}
            label={"Description:"}
            placeholder={"Write a description for your Ad"}
            value={formData.description}
            onChange={(e) => {
              handleFormData("description", e.target.value);
            }}
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
    [edit ? null : 3]: (
      <>
        <AdLocation
          categoryIndex={categoryIndex}
          handleFormData={handleFormData}
          formData={formData}
        />
      </>
    ),

    [edit ? 3 : 4]: (
      <>
        <UploadPictures />
      </>
    ),
  };

  return (
    <div className="mobile_post_ad">
      <Spinner title={"Loading Ad..."} loading={adLoading}>
        {/* <div className="left_blob"></div> */}
        {/* <div className="right_blob"></div> */}
        <div className="card">
          <div>
            <MobileStepper
              steps={steps}
              current={currentStep}
              onClick={(e) => {
                if (e < currentStep) {
                  setCurrentStep(e);
                } else {
                  handleNext();
                }
              }}
            />
          </div>
          <div className="form_container">{stepData[currentStep]}</div>
          <div className="btn_container">
            <Button
              className="mobile_btn_outline"
              onClick={() => {
                if (currentStep == 1) {
                  navigate("/wishlist/ads");
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
            >
              {currentStep == 1 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={handleNext}>
              {" "}
              {currentStep == steps.length ? "Preview Ad" : "Save & Continue"}
            </Button>
          </div>
        </div>
      </Spinner>
    </div>
  );
}

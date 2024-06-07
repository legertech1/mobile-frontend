import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import React from "react";

function PaymentLoader() {
  return (
    <div className="payment_form">
      <div className="left">
        <h1>
          <ShoppingCartOutlinedIcon /> Cart Summary
        </h1>
        <div className="package">
          <div className="package_info">
            <div>
              <h4 className="empty w-350"></h4>
            </div>
            <span className="empty w-100"></span>
          </div>
        </div>
        <div className="package">
          <div className="package_info">
            <div>
              <h4 className="empty w-250"></h4>
            </div>
            <span className="empty w-120"></span>
          </div>
          <div className="package_info">
            <div>
              <h4 className="empty w-300"></h4>
            </div>
            <span className="empty"></span>
          </div>
        </div>
        <div className="package">
          <div className="package_info">
            <div>
              <h4 className="empty w-250"></h4>
            </div>
            <span className="empty w-120"></span>
          </div>
        </div>
        <div className="total">
          <span className="price empty"></span>
        </div>
      </div>
      <div className="right">
        <h1>Payment</h1>
      </div>
    </div>
  );
}

export default PaymentLoader;

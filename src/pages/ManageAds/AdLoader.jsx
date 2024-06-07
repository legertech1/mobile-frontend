import React from "react";

function AdLoader() {
  return (
    <div className="ad_loader ad">
      <div className="ad_info emp">
        <div className="img empty"></div>
        <div>
          <h4 className="empty"></h4>
          <p className="empty"></p>
          <h5 className="empty"></h5>
        </div>
      </div>
      <div className="stats">
        <p className="empty"></p>
        <p className="empty"></p>
      </div>
      <p className="price empty"></p>

      <button className="options empty"></button>
    </div>
  );
}

export default AdLoader;

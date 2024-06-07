import React, { useEffect, useState } from "react";
import "./index.css";

export default function ButtonTabs({
  items,
  onChange,
  extras,
  activeKey,
  disabled,
}) {
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.key === activeKey);
    if (activeIndex !== -1) {
      setActiveTab(activeIndex);
    }
  }, [activeKey, items]);
  return (
    <div className="mobile_tab">
      <div className="tablinks_container">
        <div className="tab_btn_container">
          {items.map((tab, index) => (
            <button
              key={index}
              className={`tablinks ${activeTab === index ? "active" : ""}`}
              onClick={() => {
                if (disabled) return;
                setActiveTab(index);

                onChange && onChange(tab.key);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="extra_cont">{extras && extras}</div>
      </div>
      <div>{items[activeTab].content}</div>
    </div>
  );
}

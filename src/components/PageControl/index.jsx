import React from "react";
import "./index.css";
import { MoreHorizOutlined } from "@mui/icons-material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

function PageControl({ page, setPage, count, size }) {
  const maxPages = Math.ceil(count / size);
  function prev() {
    setPage(page - 1);
  }
  function next() {
    setPage(page + 1);
  }
  function first() {
    setPage(1);
  }
  function last() {
    setPage(maxPages);
  }
  function custom(page) {
    setPage(page);
  }
  if (count <= size) return <> </>;
  return (
    <div className="_page_control">
      <div className="result_num">
        Showing <span>{(page - 1) * size}</span>
        {""}-<span>{page * size < count ? page * size : count}</span> of{" "}
        <span>{count}</span>
        results
      </div>
      {page && (
        <div className="_pages">
          {page > 1 && (
            <>
              {" "}
              <button className="previous" onClick={prev}>
                <NavigateNextOutlinedIcon />
              </button>
              <MoreHorizOutlined />
            </>
          )}
          {page > 2 && (
            <>
              <button className="first" onClick={first}>
                1
              </button>
              <MoreHorizOutlined />
            </>
          )}
          {page == maxPages && maxPages > 4 && (
            <>
              <button className="-1" onClick={() => setPage(page - 2)}>
                {page - 2}
              </button>
              <button className="-1" onClick={() => setPage(page - 3)}>
                {page - 3}
              </button>
              <button className="-1" onClick={() => setPage(page - 4)}>
                {page - 4}
              </button>
            </>
          )}
          {page - 1 >= 1 && (
            <button className="-1" onClick={prev}>
              {page - 1}
            </button>
          )}
          <button className="current">{page}</button>
          {page + 1 <= maxPages && (
            <button className="+1" onClick={next}>
              {page + 1}
            </button>
          )}
          {page == 1 && maxPages > 4 && (
            <>
              <button className="-1" onClick={() => setPage(page + 2)}>
                {page + 2}
              </button>
              <button className="-1" onClick={() => setPage(page + 3)}>
                {page + 3}
              </button>
              <button className="-1" onClick={() => setPage(page + 4)}>
                {page + 4}
              </button>
            </>
          )}

          {page < maxPages - 1 && (
            <>
              {" "}
              <MoreHorizOutlined />
              <button className="last" onClick={last}>
                {maxPages}
              </button>
            </>
          )}
          {page < maxPages && (
            <>
              <MoreHorizOutlined />
              <button className="next" onClick={next}>
                <NavigateNextOutlinedIcon />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PageControl;

import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function LineGraph({
  dates,
  values,
  label,
  percent,
  width,
  height,
}) {

  return (
    <LineChart
      //   xAxis={[{ data: dates }]}
      series={[
        {
          curve: "catmullRom",
          data: values.impressions,
          label: "Impressions",
          color: "#2196f3",
          // valueFormatter: (v) => (percent ? (v||0).toFixed(2) + "%" : v),
        },
        {
          curve: "catmullRom",
          data: values.clicks,
          label: "Clicks",
          color: "#f0ca35",
          // valueFormatter: (v) => (percent ? (v||0).toFixed(2) + "%" : v),
        },
        {
          curve: "catmullRom",
          data: values["click through rate"],
          label: "Click through rate",
          color: "#cd5c5c",
          valueFormatter: (v) => (v || 0).toFixed(2) + "%",
        },
      ]}
      height={height || 300}
      width={width || 980}
      xAxis={[{ scaleType: "point", data: dates }]}
      sx={{
        // ".MuiLineElement-root": {
        //   stroke: "#2196f3",
        //   strokeWidth: 2,
        // },
        ".MuiMarkElement-root": {
          // stroke: "#2196f3",
          scale: "0.6",
          //   fill: "#2196f3",
          strokeWidth: 3,
        },
      }}
      yAxis={[
        { scaleType: "linear", valueFormatter: (v) => (percent ? v + "%" : v) },
      ]}
    ></LineChart>
  );
}

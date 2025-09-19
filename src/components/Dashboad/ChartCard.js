import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Example color array for pie chart

const ChartCard = ({
  title,
  data,
  chartType,
  chartDataKey,
  chartNameKey,
  tooltipFormatter,
  lineChartProps,
  pieChartProps,
  noDataMessage
}) => {
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [data];

  console.log(dataArray)

  // Handling empty data
  if (dataArray.length === 0) {
    return (
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500">{noDataMessage}</p>
      </div>
    );
  }

  // Render Pie Chart
  if (chartType === "pie") {
    return (
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataArray}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey={chartDataKey}
              nameKey={chartNameKey}
              {...pieChartProps}
            >
              {dataArray.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render Line Chart
  if (chartType === "line") {
    return (
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataArray} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} {...lineChartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartNameKey || "name"} />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Line type="monotone" dataKey={chartDataKey} stroke="#8884d8" activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Return null if an unsupported chartType is provided
  return null;
};

export default ChartCard;

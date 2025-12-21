"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
const Chart = ({
  data,
}: {
  data: {
    month: string;
    totalSales: number;
  }[];
}) => {
  return (
    <BarChart responsive data={data} style={{ width: "100%", height: "40vh" }}>
      <XAxis dataKey="month" axisLine={false} tickLine={false} />
      <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
      <Bar dataKey="totalSales" fill="#8884d8" />
    </BarChart>
  );
};
export default Chart;

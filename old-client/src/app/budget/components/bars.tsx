"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  {
    year: 2024,
    data: [
      { month: "January", count: 310 },
      { month: "February", count: 320 },
      { month: "March", count: 54 },
      { month: "April", count: 847 },
      { month: "May", count: 46 },
      { month: "June", count: 0 },
      { month: "July", count: 0 },
      { month: "August", count: 0 },
      { month: "September", count: 0 },
      { month: "October", count: 0 },
      { month: "November", count: 0 },
      { month: "December", count: 0 },
    ],
  },
  // You can add more years and their corresponding data arrays if needed
];

export default function BarChartComponent() {
  return (
    <BarChart width={600} height={400} data={data[0].data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
}

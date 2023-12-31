import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from "recharts";

const CommitChart = ({ commitData }) => {
  if (!commitData) {
    return <div>No data available</div>
  }
  // 現在の日付を取得
  const currentDate = new Date();

  // 現在の日付から1年前の日付を計算
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  // commitDataをフィルタリングして、1年前の日付以降のデータだけを取得
  const filteredData = commitData.filter(
    (commit) => new Date(commit.Date) >= oneYearAgo
  );

  const clippedData = filteredData.map(item => {
    if (item.Total > 1000) {
      return { ...item, Total: 1000 };
    }
    return item;
  });

  return (
    <div>
    <BarChart width={500} height={200} data={clippedData}>
    <XAxis dataKey="Date" />
    <YAxis domain={[0, 1000]} />
    <Tooltip />
    <CartesianGrid stroke="#f5f5f5" />
    <Bar dataKey="Total" fill="#ff7300" />
    </BarChart>
    <p>※1000行以上のコード変更は1000と表す</p>
    </div>
  );
};

export default CommitChart;

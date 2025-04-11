import React from "react";
import { DashboardPage } from "./_components/DashboardPage";
import { getDashboardData } from "@/actions/serverActions";

const Dashboard = async () => {
  // const data = await getDashboardData();
  // console.log("This is the data passed to the dashboard client page: ", data);
  return (
    <div>
      {/* <DashboardPage data={data} /> */}
      <DashboardPage />
    </div>
  );
};

export default Dashboard;

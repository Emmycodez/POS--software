import React from "react";
import AlertsTable from "./_components/AlertsTable";
import { getAlerts } from "@/actions/serverActions";

const StockAlerts = async () => {
  const data = await getAlerts();
  return (
    <div className="h-screen py-4 px-6">
      <div className="flex justify-between items-center border-b mb-5">
        <div className="py-4">
          <h1 className="text-3xl font-bold uppercase ">Stock-Alerts Page</h1>
        </div>
      </div>
      <div>
        {/* Products Table */}
        <AlertsTable  alertData={data}/>
      </div>
    </div>
  );
};

export default StockAlerts;

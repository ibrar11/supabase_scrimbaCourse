import { useEffect } from "react";
import supabase from "./supabase-client";

function Dashboard() {

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
      .from('sales_deal')
      .select(
        `
        name,
        value
        `,
      )
      .order('value', { ascending: false })
      .limit(1)
      if (error) {
        throw error;
      }
      console.log("datadatadatadata",data)
    } catch (err) {
      console.log("errorerrorerror",err)
    }
  }

  useEffect(()=> {
    fetchMetrics()
  },[])

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
      </div>
    </div>
  );
}

export default Dashboard;
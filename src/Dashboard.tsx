import { useEffect, useState } from "react";
import supabase from "./supabase-client";

type MetricType = {
  name: string
  total_sales: number
}

function Dashboard() {

  const [metrics, setMetrics] = useState<MetricType[]> ([])

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

      const response = await supabase
        .from('sales_deal')
        .select(
          `
          name,
          total_sales:value.sum()
          `,
        )
      if(response.error) {
        throw response.error
      }
      console.log("response.dataresponse.dataresponse.data",response.data)
      setMetrics(response.data)
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
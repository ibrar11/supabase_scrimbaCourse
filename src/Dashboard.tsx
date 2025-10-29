import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import { Chart } from 'react-charts';
import type { AxisOptions } from 'react-charts';

type MetricType = {
  name: string
  total_sales: number
}

type AxesDataType = {
  primary: string
  secondary: number
}

function Dashboard() {

  const [metrics, setMetrics] = useState<MetricType[]> ([])

  const fetchMetrics = async () => {
    try {
      const res = await supabase
      .from('sales_deal')
      .select(
        `
        name,
        value
        `,
      )
      .order('value', { ascending: false })
      .limit(1)
      if (res.error) {
        throw res.error;
      }
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
      setMetrics(response.data)
    } catch (err) {
      console.log("errorerrorerror",err)
    }
  }

  useEffect(()=> {
    fetchMetrics()

    const channel = supabase
      .channel('deal-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'sales_deal' 
        },
        () => {
          fetchMetrics()
        })
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  },[])

  const chartData = [
    {
      label: 'Sales',
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.total_sales,
      })),
      type: 'bar',
    },
  ];

  const primaryAxis: AxisOptions<AxesDataType> = {
    getValue: (d) => d.primary,
    scaleType: 'band',
    innerBandPadding: 0.2,
    outerBandPadding: 0.1,
    position: 'bottom',
  };

  const secondaryAxes: AxisOptions<AxesDataType>[] = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: y_max(),
      position: 'left',
    },
  ];

  function y_max() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map((m) => m.total_sales));
      return maxSum + 2000;
    }
    return 5000; 
  }

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              defaultColors: ['#58d675'],
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
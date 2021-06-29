import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import numeral from "numeral";


const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };
  
  const buildChartData = (data, caseType) => {
    const chartData = [];
    let lastPoint;
    for (let date in data.cases) {
      if (lastPoint) {
        let newPoint = {
          x: date,
          y: data[caseType][date] - lastPoint,
        };
        chartData.push(newPoint);
      }
      lastPoint = data[caseType][date];
    }
    return chartData;
  };

function Linegraph({ caseType = 'cases' }) {
  const [data, setData] = useState({});
  // https://disease.sh/v3/covid-19/historical/all?lastdays=120



  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=240"
        );
        const chartData = buildChartData(res.data,caseType);
        setData(chartData);
      } catch (e) {
        console.log(e);
      }
    };
    fetchdata();
  }, [caseType]);

  return (
    <div style={{height : '250px'}}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default Linegraph;

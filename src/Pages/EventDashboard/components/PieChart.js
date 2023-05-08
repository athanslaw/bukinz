import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

  const colors = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)'
  ];
  
  const borderColor = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)'
  ]

export function PieChart({data}) {

  let labels = ["No event tracking record found"];
  let mydata = [1];
  let backgroundColors = [colors[1]];
  let borderColors = [borderColor[1]];
  
  let total = data.positiveResponse + data.negativeResponse + data.noResponse;
  labels[0] = "Yes: "+(data.positiveResponse * 100/total).toFixed(2) +"%";
  mydata[0] = data.positiveResponse;
  labels[1] = "No: "+(data.negativeResponse * 100/total).toFixed(2) +"%";
  mydata[1] = data.negativeResponse;
  labels[2] = "NR: "+(data.noResponse * 100/total).toFixed(2) +"%";
  mydata[2] = data.noResponse;
  
  backgroundColors[0]= colors[0];
  borderColors[0]= borderColor[0];
  backgroundColors[1]= colors[1];
  borderColors[1]= borderColor[1];
  backgroundColors[2]= colors[2];
  borderColors[2]= borderColor[2];

  const data1 = {
    labels: {},
    datasets: [
      {
        label: '# of Events',
        data: mydata,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      },
    ],
  };
  

  return <div style={{display:"flex"}}><span style={{width:"200px"}}><Doughnut data={data1} /></span>
  <span style={{fontSize:12}}>
    <span style={{backgroundColor:backgroundColors[0]}}>&nbsp;&nbsp;&nbsp;&nbsp;</span> {labels[0]}<br/>
    <span style={{backgroundColor:backgroundColors[1]}}>&nbsp;&nbsp;&nbsp;&nbsp;</span> {labels[1]}<br/>
    <span style={{backgroundColor:backgroundColors[2]}}>&nbsp;&nbsp;&nbsp;&nbsp;</span> {labels[2]}
  </span></div>
}

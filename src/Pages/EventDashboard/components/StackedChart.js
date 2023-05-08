import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: false,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  maintainAspectRation:false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

let labels = [];
let party1 = [];
let party2 = [];
let party3 = [];

let mapPartyColor = {};
let mapPartyName = {};

// for each lga get the part scores: labels.map(() => datas),
const reset = (totalLgas) => {

}

 
const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(192, 192, 86, 0.2)',
    'rgba(75, 75, 192, 0.2)',
    'rgba(153, 102, 153, 0.2)',
    'rgba(255, 159, 159, 0.2)',
    'rgba(64, 159, 64, 0.2)',
    'rgba(86, 192, 86, 0.2)',
    'rgba(192, 75, 192, 0.2)',
    'rgba(102, 102, 153, 0.2)',
    'rgba(60, 159, 159, 0.2)'
  ];
  

export const prepareData = (myData) => {
  //reset
  labels = [];
  let eventMap = {};
  for(let i=0; i < myData.length; i++) {
    labels[i]=myData[i]?.lga.name;

    for(let j=0; j < myData[i]?.length; j++){
      if(eventMap[myData[i]?.incidentType]){
        eventMap[myData[i]?.incidentType] = {"value":myData[i]?.count+eventMap[myData[i]?.count]};
      }
      else {
        eventMap[myData[i]?.incidentType] = {"value":myData[i]?.count};
      }
    }
  };

  let dataset = [];
  for(let i =0; i < eventMap.length; i++){
    dataset[i] = {
      'label' : eventMap[i][0],
      'data' : eventMap[i][1],
      'backgroundColor' : eventMap[i][2],
    };
  }
  


  return {
    labels,
    datasets: dataset
  }
};

export function StackedBarChart({data}) {
  return <Bar options={options} data={prepareData(data)} height={80} />;
}

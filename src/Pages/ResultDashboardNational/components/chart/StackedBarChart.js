import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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
let party4 = [];
let party5 = [];
let party6 = [];

let mapPartyColor = {};
let mapPartyName = {};

// for each state get the part scores: labels.map(() => datas),

export const prepareData = (myData) => {
  //reset
  labels = [];
  for(let i=0; i < myData.length; i++) {
    labels[i]=myData[i]?.state.name;
    let mapParty = {};
    for(let j=0; j < myData[i]?.partyResults.length; j++){
      mapParty[myData[i]?.partyResults[j].politicalParty.code] = [myData[i]?.partyResults[j].totalVoteCount,
      myData[i]?.partyResults[j].politicalParty.name,
      myData[i]?.partyResults[j].politicalParty.colorCode];
    }

    if(i === 0){
      mapPartyName['party_1']=mapParty['party_1'][1];
      mapPartyName['party_2']=mapParty['party_2'][1];
      mapPartyName['party_3']=mapParty['party_3'][1];
      mapPartyName['party_4']=mapParty['party_4'][1];
      mapPartyName['party_5']=mapParty['party_5'][1];
      mapPartyName['party_6']=mapParty['party_6'][1];

      mapPartyColor['party_1']=mapParty['party_1'][2];
      mapPartyColor['party_2']=mapParty['party_2'][2];
      mapPartyColor['party_3']=mapParty['party_3'][2];
      mapPartyColor['party_4']=mapParty['party_4'][2];
      mapPartyColor['party_5']=mapParty['party_5'][2];
      mapPartyColor['party_6']=mapParty['party_6'][2];
    }

    party1[i]=mapParty['party_1'][0];
    party2[i]=mapParty['party_2'][0];
    party3[i]=mapParty['party_3'][0];
    party4[i]=mapParty['party_4'][0];
    party5[i]=mapParty['party_5'][0];
    party6[i]=mapParty['party_6'][0];
  };
  


  return {
    labels,
    datasets: [
      {
        label: mapPartyName['party_1'],
        data: party1,
        backgroundColor: mapPartyColor['party_1'],
      },
      {
        label: mapPartyName['party_2'],
        data: party2,
        backgroundColor: mapPartyColor['party_2'],
      },
      {
        label: mapPartyName['party_3'],
        data: party3,
        backgroundColor: mapPartyColor['party_3'],
      },
      {
        label: mapPartyName['party_4'],
        data: party4,
        backgroundColor: mapPartyColor['party_4'],
      },
      {
        label: mapPartyName['party_5'],
        data: party5,
        backgroundColor: mapPartyColor['party_5'],
      },
      {
        label: mapPartyName['party_6'],
        data: party6,
        backgroundColor: mapPartyColor['party_6'],
      }
    ]
  }
};

export function StackedBarChart({data}) {
  return <Bar options={options} data={prepareData(data)} height={80} />;
}

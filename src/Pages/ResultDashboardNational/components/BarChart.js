import React from 'react';
import * as d3 from 'd3';
import { commaSeparateNumber } from '../../../helpers/utils';

const BarChart = ({data}) => {

    const margin = {
        top: 8,
        right: 25,
        bottom: 8,
        left: 60
    };
    var rectHeight = 15;
    const width = 414 - margin.left - margin.right;
    const height = (rectHeight + margin.top + margin.bottom) * data.length ;
    data = data.sort((a, b) =>  d3.ascending(a.totalVoteCount, b.totalVoteCount));
    const x = d3.scaleLinear()
        .range([0, width-100])
        .domain([0, d3.max(data, d => d.totalVoteCount)]);

    let highest = data[data.length-1]?.percent;
    const y = d3.scaleBand()
        .domain(data.map(d => d?.politicalParty?.code))
        .rangeRound([height, 0])
        .paddingInner(0.375);



    return (
        <div id="graphic">
            <svg
                width = {width + margin.left + margin.right}
                height = {height + margin.top + margin.bottom}
            >
                {
                    data.map(d =>
                        <g key={d.id }>
                            {/* <g fill="#000" fontSize="1rem" fontFamily="GelionBold" textAnchor="end"> */}
                                {d.totalVoteCount > 0 && <text y={y(d?.politicalParty?.code) + y.bandwidth() / 2} x={16}  style={{fontSize:'12px'}}>{d?.politicalParty?.name}: {`${d?.percent ? d.percent.toFixed(0) : 0}%`}</text>}
                            {/* </g> */}

                            {d.totalVoteCount > 0 && <rect className="bar" width={(d.percent*100/highest).toFixed(0)} height={y.bandwidth()} y={y(d?.politicalParty?.code)} x={85} fill={d?.politicalParty?.colorCode}/>}
                            {d.totalVoteCount > 0 && <text y={y(d?.politicalParty?.code) + y.bandwidth() / 2 + 12} x={16} style={{fontSize:'9px', fontWeight:'bold'}}>{commaSeparateNumber(d.totalVoteCount)}</text>}
                        </g>
                    )
                }
            </svg>
        </div>
    );
}

export default BarChart;

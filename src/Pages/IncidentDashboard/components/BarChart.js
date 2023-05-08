import React, { useRef } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
    const yRef = useRef("yAxis");
    let data = [{
                "name": "PDP",
                "value": 20,
        },
            {
                "name": "APC",
                "value": 12,
        },
            {
                "name": "ANPP",
                "value": 19,
        },
    ]
    const margin = {
        top: 8,
        right: 25,
        bottom: 8,
        left: 60
    };
    //sort bars based on value
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    })
    var rectHeight = 31;
    const width = 414 - margin.left - margin.right;
    const height = (rectHeight + margin.top + margin.bottom) * data.length ;
    const x = d3.scaleLinear()
        .range([0, width-100])
        .domain([0, d3.max(data, d => d.value)]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([height, 0])
        .paddingInner(0.375)

    const percentege = (num) => {
        let sum = 0;
        for(let i = 0; i < data.length; ++i) {
            sum += data[i].value;
        }
        let result = (num/sum) * 100;
        return result.toFixed(2);
    }

    const parties = {
        'party_1': '#ff0000',
        'party_2': '#00b0f0',
        'party_3': '#eb5e00',
        'party_4': '#0000ff',
        'party_5': '#00ff00',
        'party_6': '#999999'
    }


    //set up svg using margin conventions - we'll need plenty of room on the left for labels


    const ref = (svg) => {
        var width = 414 - margin.left - margin.right,
        height = (rectHeight + margin.top + margin.bottom) * data.length ;

    // var svg = d3.select("#graphic").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr('transform', `translate(${margin.left},${margin.top})`);


    //make y axis to show bar names
    var yAxis = d3.axisLeft(y)
        .tickSize(0);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    // append rects
    bars = (rect) =>
        rect.attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            })
            .attr("fill", function (d) {
                return parties[d.name];
            })
            .call((text) =>
                text        .attr("class", "label")
                //y position of the label is halfway down the bar
                .attr("y", function (d) {
                    return y(d.name) + y.bandwidth() / 2 + 4;
                })
                //x position is 3 pixels to the right of the bar
                .attr("x", function (d) {
                    return x(d.value) + 3;
                })
                .text(function (d) {
                    return d.value;
                })
            )

    //add a value label to the right of each bar
    // bars.append("text")
    //     .attr("class", "label")
    //     //y position of the label is halfway down the bar
    //     .attr("y", function (d) {
    //         return y(d.name) + y.bandwidth() / 2 + 4;
    //     })
    //     //x position is 3 pixels to the right of the bar
    //     .attr("x", function (d) {
    //         return x(d.value) + 3;
    //     })
    //     .text(function (d) {
    //         return d.value;
    //     });
    }



    return (
        <div id="graphic">
            <svg
                width = {width + margin.left + margin.right}
                height = {height + margin.top + margin.bottom}
            >
                {/* <g fill="none" fontSize="1rem" fontFamily="GelionBold" textAnchor="end">
                    <path d="M0.5,141.5V0.5" stroke="#000" />
                    {
                        data.map(d => )
                    }
                </g> */}
                {
                    data.map(d =>
                        <>
                            {/* <g fill="#000" fontSize="1rem" fontFamily="GelionBold" textAnchor="end"> */}
                                <text y={y(d.name) + y.bandwidth() / 2 + 4} x={16} >{d.name}</text>
                            {/* </g> */}

                            <rect className="bar" width={x(d.value)} height={y.bandwidth()} y={y(d.name)} x={60} fill={parties[d.name]}/>
                            <text y={y(d.name) + y.bandwidth() / 2 + 4} x={x(d.value) + 70} >{d.value} {`(${percentege(d.value)}%)`}</text>
                        </>
                    )
                }
            </svg>
        </div>
    );
}

export default BarChart;

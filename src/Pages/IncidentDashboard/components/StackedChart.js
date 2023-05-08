import React, { useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderNone
} from "d3";

/**
 * Component that renders a StackedBarChart
 */

const StackedBarChart = ({ data, keys }) => {
    const colors = {
        7: "#928f8f",
        3: "#c82fcf",
        2: "#ff0000",
        1: "#00b0f0"
    };
    const del = {
        "statusCode": "00",
        "statusMessage": "Dashboard loaded.",
        "totalStates": 3,
        "totalLgas": 5,
        "totalSenatorialDistricts": 3,
        "totalRegisteredVotes": 6000,
        "totalAccreditedVotes": 4000,
        "totalVoteCounts": 680,
        "totalWards": 4,
        "totalPollingUnits": 6,
        "resultReceived": 17,
        "lgaWithResults": 1,
        "wardsWithResults": 1,
        "pollingUnitsWithResults": 2,
        "lgas": [
            {
                "id": 1,
                "incidentReports": [
                    {
                        count: 1,
                        incidentType: "Violence/Intimidation",
                        incidentId: 7,
                        code: "5",
                        id: 14,
                        name: "BICHI",
                        senatorialDistrict: {code: "343", name: "Kano North", id: 6},
                        percent: 25
                    },
                    {
                        count: 1,
                        incidentType: "Violence/Intimidation",
                        incidentId: 3,
                        code: "5",
                        id: 14,
                        name: "BICHI",
                        senatorialDistrict: {code: "343", name: "Kano North", id: 6},
                        percent: 25
                    },
                    {
                        count: 1,
                        incidentType: "Violence/Intimidation",
                        incidentId: 2,
                        code: "5",
                        id: 14,
                        name: "BICHI",
                        senatorialDistrict: {code: "343", name: "Kano North", id: 6},
                        percent: 25
                    }
                ]
            }
        ],
        "partyResult": [
            {
                "politicalParty": {
                    "code": "PDP",
                    "name": "People's democratic party.",
                    "id": 2
                },
                "resultPerParty": null,
                "totalVoteCount": 400,
                "percent": 58.8235294117647
            },
            {
                "politicalParty": {
                    "code": "APC",
                    "name": "Action People's congress",
                    "id": 1
                },
                "resultPerParty": null,
                "totalVoteCount": 190,
                "percent": 27.941176470588236
            },
            {
                "politicalParty": {
                    "code": "ANPP",
                    "name": "People's democratic party.",
                    "id": 3
                },
                "resultPerParty": null,
                "totalVoteCount": 90,
                "percent": 13.235294117647058
            }
        ]
        }
    const someData = [
        {
            "lga": "GWAMEiuytretyui",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GAME",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAE",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAMdfghjkl;lkjhgf",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "WAMEytr",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAME",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAME",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAME",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
        {
            "lga": "GWAME",
            "form": 10,
            "ballot": 20,
            "unrest": 1,
            "robbery": 2,
        },
    ]
    const incidentData = {
        "statusCode": "00",
        "statusMessage": "Incident Report loaded.",
        "incidentCount": 13,
        "incidentReports": [
            {
            "incidentType": "Absense of form EC8",
            "count": 4,
            "percent": 30.76923076923077
            },
            {
            "incidentType": "Civil Unrest",
            "count": 1,
            "percent": 7.6923076923076925
            },
            {
            "incidentType": "Incident type one",
            "count": 4,
            "percent": 30.76923076923077
            },
            {
            "incidentType": "Ballot Snatching",
            "count": 4,
            "percent": 30.76923076923077
            }
        ],
        "lgaIncidentReports": [
            {
                "incidentType": "Incident type one",
                "count": 1,
                "percent": 100,
                "lga": {
                    "code": "AGE",
                    "name": "Agege Local governmemnt",
                    "state": {
                    "code": "LAG",
                    "name": "Lagos State",
                    "senatorialDistricts": [
                        {
                        "code": "LSC",
                        "name": "Lagos South Central",
                        "id": 1
                        },
                        {
                        "code": "LSW",
                        "name": "Lagos South WEST",
                        "id": 3
                        },
                        {
                        "code": "LSE",
                        "name": "Lagos South EAST",
                        "id": 2
                        }
                    ],
                    "svgUrl": "/uploads/svg/astro.jpg",
                    "defaultState": false,
                    "id": 3
                    },
                    "senatorialDistrict": {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    "id": 1
                }
            },
            {
            "incidentType": "Incident type one",
            "count": 1,
            "percent": 100,
            "lga": {
                "code": "KSF",
                "name": "Kosofe Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSE",
                "name": "Lagos South EAST",
                "id": 2
                },
                "id": 2
            }
            },
            {
            "incidentType": "Ballot Snatching",
            "count": 1,
            "percent": 100,
            "lga": {
                "code": "IKJ",
                "name": "Ikeja Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSW",
                "name": "Lagos South WEST",
                "id": 3
                },
                "id": 3
            }
            },
            {
            "incidentType": "Absense of form EC8",
            "count": 4,
            "percent": 100,
            "lga": {
                "code": "AHS",
                "name": "Alimosho Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSW",
                "name": "Lagos South WEST",
                "id": 3
                },
                "id": 4
            }
            },
            {
            "incidentType": "Civil Unrest",
            "count": 1,
            "percent": 16.666666666666668,
            "lga": {
                "code": "APP",
                "name": "Apapa Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSW",
                "name": "Lagos South WEST",
                "id": 3
                },
                "id": 5
            }
            },
            {
            "incidentType": "Incident type one",
            "count": 2,
            "percent": 33.333333333333336,
            "lga": {
                "code": "APP",
                "name": "Apapa Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSW",
                "name": "Lagos South WEST",
                "id": 3
                },
                "id": 5
            }
            },
            {
            "incidentType": "Ballot Snatching",
            "count": 3,
            "percent": 50,
            "lga": {
                "code": "APP",
                "name": "Apapa Local governmemnt",
                "state": {
                "code": "LAG",
                "name": "Lagos State",
                "senatorialDistricts": [
                    {
                    "code": "LSC",
                    "name": "Lagos South Central",
                    "id": 1
                    },
                    {
                    "code": "LSW",
                    "name": "Lagos South WEST",
                    "id": 3
                    },
                    {
                    "code": "LSE",
                    "name": "Lagos South EAST",
                    "id": 2
                    }
                ],
                "svgUrl": "/uploads/svg/astro.jpg",
                "defaultState": false,
                "id": 3
                },
                "senatorialDistrict": {
                "code": "LSW",
                "name": "Lagos South WEST",
                "id": 3
                },
                "id": 5
            }
            }
        ]
    }
  const svgRef = useRef();
  const wrapperRef = useRef();
  const rectWidth = 31;
//   const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    // const { width, height } =
    //   dimensions || wrapperRef.current.getBoundingClientRect();
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    
    // stacks / layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderNone);
    const layers = stackGenerator(del.lgas);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
    ];

    // scales
    const xScale = scaleBand()
      .domain(someData.map(d => d.lga))
      .range([rectWidth, (2*rectWidth*someData.length)+rectWidth])
      .padding(0.1)

    const yScale = scaleLinear()
      .domain(extent)
      .range([500, 0]);

    // rendering
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.incidentReports[layer.incidentReports.key]]) || '#000'
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("x", sequence => xScale(sequence.data.lga) + rectWidth)
      .attr("width", 31)
      .attr("y", sequence => yScale(sequence[1]))
      .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));

    // axes
    const xAxis = axisBottom(xScale).tickSize(0);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, 500)`)
      .attr("stroke", "#979797")
      .attr("strone-width", 0.0025)
      .call(xAxis);
  }, [data, keys]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "1rem" }}>
        <svg ref={svgRef} height={594} width={(40 + rectWidth) * someData.length}>
          <g className="x-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default StackedBarChart;
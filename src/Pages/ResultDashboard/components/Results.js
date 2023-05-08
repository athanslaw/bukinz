import React, { useEffect } from 'react';
import GenericMap from '../../../shared/assets/GenericMap.js';
import * as d3 from 'd3';

const Results = ({data, politicalParties, stateId}) => {

    const colorMap = () => {
        const svg = document.getElementById("state"+stateId);
        
        const elements = document.getElementsByClassName("state"+stateId);
        for(let element of elements){
            element.setAttribute('fill','#cdcdd2');
        }
         if(data?.length > 0)   {
                for(let i = 0; i < data.length; ++i) {
                    let titleText = data[i]?.lga?.name+"\n---------------\n";
                    data[i]?.partyResults?.forEach(result => titleText+=`${result?.resultPerParty?.politicalParty?.name}: ${result?.resultPerParty?.voteCount}\n`)
                    titleText += "---------------";
                    const color = data[i]?.partyResults[data[i]?.partyResults.length - 1]?.politicalParty?.colorCode || '#333';
                    d3.select(svg).select(`#state${stateId}-${data[i]?.lga?.id}`)
                    .attr('fill', color);
                    const newNode = document.createTextNode(titleText);
                    const element = document.getElementById(`state${stateId}-${data[i]?.lga?.id}`).children[0];
                    
                    element.replaceChild(newNode, element.childNodes[0]);
                }
            }
    }

    useEffect(() => {
        colorMap();
    }, [data, politicalParties])

    return (
        <div id="map" className="relative shadow-container rounded-sm my-4 ">
            <GenericMap defaultState={stateId} />
            {data?.length > 0 &&<div className="label absolute bottom-2 right-2">
                {politicalParties.map((party, id) =><div key={"s"+id} className="flex items-center">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: party?.politicalParty?.colorCode || '#000'}}></span>
                    <div className="ml-1" style={{fontSize:'10px'}}><strong>{party?.politicalParty?.name || ''}</strong></div>
                </div>)}
            </div>}
        </div>
    )
}

export default Results;

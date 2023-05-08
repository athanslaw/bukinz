import * as d3 from 'd3';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import GenericMap from '../../../shared/assets/GenericMap';

const IncidentsData = ({data, stateId}) => {
    
    const [authState] = useContext(AuthContext);

    const colors = {
        'level-1': '#fceaea',
        'level-2': '#fddbdb',
        'level-3': '#e6a4a4',
        'level-4': '#f85757',
        'level-5': '#f20101'
    }

    const colorMap = () => {
        const svg = document.getElementById("state"+stateId);
        
        const elements = document.getElementsByClassName("state"+stateId);
        for(let element of elements){
            element.setAttribute('fill','#cdcdd2');
        }

        for(let i = 0, color= colors['level-5']; i < data.length; ++i) {
          const weight = parseInt(data[i].weight)
            if(weight <= 1) {
                color = colors['level-1']
            }   else if(weight < 3) {
                color = colors['level-2']
            }   else if(weight < 4) {
                color = colors['level-3']
            }   else if(weight < 5) {
                color = colors['level-4']
            }   else {
                color = colors['level-5']
            }
            d3.select(svg).select(`#state${stateId}-${data[i].lga.id}`)
            .attr('fill', color)
        }
    }

    useEffect(() => {
        colorMap();
    }, [data])

    return (
        <div id="map" className="relative shadow-container rounded-sm my-4 ">
            <GenericMap defaultState={stateId} />
            <div className="label absolute bottom-7 right-10">
                <div className="flex items-center">
                    <span className="w-5 h-6" style={{backgroundColor: '#f20101'}}></span>
                    <div className="ml-2">High</div>
                </div>
                <div className="flex items-center">
                    <span className="w-5 h-6" style={{backgroundColor: '#f85757'}}></span>
                </div>
                <div className="flex items-center">
                    <span className="w-5 h-6" style={{backgroundColor: '#e6a4a4'}}></span>
                </div>
                <div className="flex items-center">
                    <span className="w-5 h-6" style={{backgroundColor: '#fddbdb'}}></span>
                </div>
                <div className="flex items-center">
                    <span className="w-5 h-6" style={{backgroundColor: '#fceaea'}}></span>
                    <div className="ml-2">Low</div>
                </div>
            </div>
        </div>
    )
}

export default IncidentsData;

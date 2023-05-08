import React from 'react';
import { PieChart } from './PieChart';

const EventsData = ({eventName, data }) => {
    return (
        <div className="relative shadow-container rounded-sm my-4" style={{padding:2, margin:5}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, height:43, textAlign:"center", backgroundColor:"#200058", color:"#eeeeff"}}>
                {eventName.toUpperCase()}</div>
            <PieChart data={JSON.parse(data) || []} />
        </div>
    )
}

export default EventsData;

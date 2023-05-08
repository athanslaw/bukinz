import React from 'react';

const ResultCards = ({data}) => {
    return (
        <div>
            <div className="flex justify-between items-center py-2 shadow-container px-2.5">
                <div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data?.statesWithResults || 0}</div>
                    <div className="text-xs">States with results</div>
                </div><div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data?.lgaWithResults || 0}</div>
                    <div className="text-xs">LGAs with results</div>
                </div>
                <div className="bg-oceanBlue py-2 text-center mx-3 rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data?.wardsWithResults.toLocaleString() || 0}</div>
                    <div className="text-xs">Wards with results</div>
                </div>
                <div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118" style={{backgroundColor:"#000077", color:"white"}}>
                    <div className="text-1xl font-bold">{data?.pollingUnitsWithResults.toLocaleString() || 0}</div>
                    <div className="text-xs">PUs with results</div>
                </div>
            </div>
            
            <div className="flex justify-between items-center py-2 shadow-container px-2.5">
                
                <div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data?.totalAccreditedVotes.toLocaleString() || 0}</div>
                    <div className="text-xs">Accredited Voters</div>
                </div>
                <div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data?.totalVoidVotes.toLocaleString() || 0}</div>
                    <div className="text-xs">Void Votes</div>
                </div>
                <div className="bg-oceanBlue py-2 text-center rounded-xsm .shadow-sm-container w-118">
                    <div className="text-1xl font-bold">{data? (data.totalPollingUnits - data.pollingUnitsWithResults).toLocaleString() : 0}</div>
                    <div className="text-xs">PUs without results</div>
                </div>
            </div>

            <div className="flex justify-between items-center py-3 shadow-container px-2.5 my-2">
                {data?.partyStatesResults?.map((result, id) => {
                    if(result.partyName !== "OTHERS") {
                        return(
                        <div key={id} className="bg-oceanBlue py-4 text-center rounded-xsm .shadow-sm-container w-118">
                            <div className="text-1xl font-bold">{result.stateCount || 0}</div>
                            <div className="text-xs">States won by  {result.partyName}</div>
                        </div>)
                    }
                })}
            </div>
        </div>
    )
}

export default ResultCards;

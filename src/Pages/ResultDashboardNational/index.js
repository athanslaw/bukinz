import React, { useContext, useEffect, useState } from 'react';
import { ResultContext } from '../../contexts/ResultContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api';
import Layout from '../../shared/Layout';
import BarChart from './components/BarChart';
import {StackedBarChart} from './components/chart/StackedBarChart';
import { getDashboardByCountry, allStates, getGeoPoliticalZones} from '../../lib/url.js';
import ResultCards from './components/ResultCards';
import Results from './components/Results';
import Loader from '../../shared/components/Loader';
import { electionTypes } from '../../lib/url.js';

const ResultDashboardNational = ({match, location, history}) => {
    const [dashboardState, dispatch] = useContext (ResultContext);
    const [zones, setZones] = useState([]);
    const [states, setStates] = useState([]);
    const [filter, setFilter] = useState({zone:'all', state: 'all'});
    const [dashboard, setDashboard] = useState(null);
    const [electionType, setElectionType] = useState(1);
    const [electionTypeList, setElectionTypeList] = useState([]);

     const getDashboardData = () => {
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
         apiRequest(`${getDashboardByCountry}/${electionType}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_DASHBOARD_BY_STATE_SUCCESS', payload: {response: res}});
                setDashboard(res);
            })
            .catch((err) => {
                dispatch({type: 'GET_DASHBOARD_BY_STATE_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const getDashboardDataLight = () => {
         apiRequest(`${getDashboardByCountry}/${electionType}`, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((eNationalrr) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardZoneData = (zoneId) => {
        const url = (zoneId=='all')?`${getDashboardByCountry}/${electionType}`:`${getDashboardByCountry}/zonal/${zoneId}/${electionType}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardZoneDataLight = () => {
        let zoneId = filter.zone;
        const url = (zoneId=='all')?`${getDashboardByCountry}/${electionType}`:`${getDashboardByCountry}/zonal/${zoneId}/${electionType}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardElectionTypeData = (electionType) => {
        setElectionType(electionType);
    }

    const getDashboardStateData = (state) => {
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
        const url = `${getDashboardByCountry}/state/${state}/${electionType}`;
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                dispatch({type: 'GET_DASHBOARD_BY_STATE_SUCCESS', payload: {response: res}});
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardStateDataLight = () => {
        let stateId=filter.state;
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
        const url = (stateId=='all')?`${getDashboardByCountry}/${electionType}`:`${getDashboardByCountry}/state/${stateId}/${electionType}`;
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                dispatch({type: 'GET_DASHBOARD_BY_STATE_SUCCESS', payload: {response: res}});
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const refreshReports = () => {
        // if state is null refresh default else refresh using state values
        if(filter.state !== 'all'){
            getDashboardStateDataLight();
        }else if(filter.zone !== 'all'){
            getDashboardZoneDataLight();
        }else{
            getDashboardDataLight();
        }
    }

    const getStates = (zone) => {
        let url = '';
        if(zone){
            if(zone ==='all'){
                url=`${allStates}`;
                getDashboardData();
            }else{
                url=`${allStates}/zone/${filter.zone}`;
                getDashboardZoneData(zone);
            }
        }
        if(url !==''){
            apiRequest(url, 'get')
            .then(res => {
                setStates(res.states);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
        }
    }
    
    const getZones = () => {
        apiRequest(`${getGeoPoliticalZones}`, 'get')
        .then(res => {
            setZones(res.geoPoliticalZoneList);
        })
        .catch(err => {
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        })
    }

    const getElectionTypes = () => {
        apiRequest(electionTypes+'/active', 'get')
            .then((res) => {
                setElectionTypeList(res.electionTypes)
            })
            .catch((err) => {
            });
    }

    useEffect(() => {
        getDashboardData();
        getZones();
        getElectionTypes();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(refreshReports, 30000);
        return ()=>clearInterval(intervalId);
    }, [electionType, filter.zone, filter.state])

    useEffect(() => {
        refreshReports();
    }, [electionType])

    useEffect(() => {
        getStates(filter.zone);
    }, [filter.zone])


    useEffect(() => {
        // if state is null refresh default else refresh using state values
        if(filter.state !== 'all'){
            getDashboardStateDataLight();
        }else if(filter.zone !== 'all'){
            getDashboardZoneDataLight();
        }else{
            getDashboardDataLight();
        }
    }, [filter.state])

    return(
        <Layout location={location}>
            <div className="shadow-container w-full px-1 pb-1 rounded-sm text-1xl font-bold">
                <select
                    name="electionType"
                    onChange={(e) => getDashboardElectionTypeData(e.target.value)}
                    value={electionType}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"130px"}}
                >
                    <option value='all'>Election Type</option>
                    {electionTypeList.map(electionType => (<option key={electionType.id} value={electionType.id}>{electionType.name}</option>))}
                </select>&nbsp;
                
                <select
                    name="zone"
                    onChange={(e) => setFilter({...filter, zone: e.target.value})}
                    value={filter.zone}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"130px"}}
                >
                    <option value='all'>Geopolitical Zones</option>
                    {zones.map(zone => (<option key={zone.id} value={zone.id}>{zone.name}</option>))}
                </select>&nbsp;
                <select
                    name="state"
                    onChange={(e) => setFilter({...filter, state: e.target.value})}
                    value={filter.state}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"130px"}}
                >
                    <option value='all'>State</option>
                    {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                </select>&nbsp;
                                
                <div style={{float:"right", padding:5}}>
                    <span className="text-sm">Registered Voters: </span>
                    <span className="text-1xl font-bold" style={{paddingRight:5}}>{dashboard?.totalRegisteredVotes?.toLocaleString() || 0}</span>
                    <span style={{ backgroundColor:"#ff0000", color:"white", borderRadius:"5px", padding:5, paddingLeft:5, paddingRight:5}}>
                        <span className="text-sm">Results Received: </span>
                        <span className="text-1xl font-bold">{dashboard?.resultReceived?.toFixed(2) || 0}%</span>
                    </span>
                </div>
            </div>
            <div className="w-full lg:flex">
                <div className="lg:w-10/10 w-full mr-4">
                    <StackedBarChart data={dashboard?.stateResults || []}/>
                </div>
            </div>
            <div className="w-full lg:flex">
                <div className="lg:w-7/10 w-full mr-4">
                {dashboardState.loading ?
                            <div className="flex justify-center my-6">
                                <Loader />
                            </div> :
                        <Results data={dashboard?.stateResults || []} politicalParties={dashboard?.partyResult}/>
                }
                </div>
                
                <div className="lg:w-3/10 w-full mt-4">
                    <ResultCards data={dashboard}/>
                    {dashboardState.loading ?
                            <div className="flex justify-center my-6">
                                <Loader />
                            </div> :
                            <BarChart data={dashboard?.partyResult || []}/>
                        }
                </div>
            </div>

        </Layout>
    );
}

export default ResultDashboardNational;

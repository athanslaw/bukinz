import React, { useContext, useEffect, useState } from 'react';
import { ResultContext } from '../../contexts/ResultContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api';
import Layout from '../../shared/Layout';
import BarChart from './components/BarChart';
import {StackedBarChart} from './components/chart/StackedBarChart';
import { getDashboardByState, getDashboardByLga , getLgasByStateId, getLgasBySenatorialDistrict, allStates, getSenatorialDistrictsByStateId, getDashboardBySenatorialDistrict} from '../../lib/url.js';
import ResultCards from './components/ResultCards';
import Results from './components/Results';
import Loader from '../../shared/components/Loader';
import { AuthContext } from '../../contexts/AuthContext';
import { electionTypes } from '../../lib/url.js';

const ResultDashboard = ({match, location, history}) => {
    const [dashboardState, dispatch] = useContext (ResultContext);
    const [authState] = useContext(AuthContext);
    const [senatorialDistricts, setSenatorialDistricts] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [states, setStates] = useState([]);
    const defaultState = authState.user?.userDetails?.stateId;
    const [filter, setFilter] = useState({lga: 'all', senatorialDistrict: 'all', state: defaultState});
    const [dashboard, setDashboard] = useState(null);
    const [electionTypeList, setElectionTypeList] = useState([]);
    const [electionType, setElectionType] = useState(1);

     const getDashboardData = () => {
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
         apiRequest(`${getDashboardByState}/default-state/${filter.state}/${electionType}`, 'get')
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
         apiRequest(`${getDashboardByState}/default-state/${filter.state}/${electionType}`, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaData = (lgaid) => {
        const url = (lgaid=='all')?`${getDashboardByLga}/${electionType}`:`${getDashboardByLga}/${lgaid}/${electionType}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                setFilter({...filter, lga: lgaid});
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaDataLight = () => {
        let lgaid = filter.lga;
        const url = (lgaid=='all')?`${getDashboardByLga}`:`${getDashboardByLga}/${lgaid}/${electionType}`
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

    const getDashboardSenDistrictData = (districtId) => {
        setFilter({...filter, lga:'all', senatorialDistrict: districtId})
        dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT'});
        const url = (districtId=='all')?`${getDashboardByState}/default-state/${filter.state}/${electionType}`:`${getDashboardBySenatorialDistrict}/${districtId}/${electionType}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT_SUCCESS', payload: {response: res}});
                getLgasBySen(districtId);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardStateData = (state) => {
        setFilter({...filter, senatorialDistrict:'all', lga:'all', 'state': state})
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
        const url = `${getDashboardByState}/default-state/${state}/${electionType}`;
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                dispatch({type: 'GET_DASHBOARD_BY_STATE_SUCCESS', payload: {response: res}});
                getSenatorialDistricts(state);
                getLgasByState(state);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardSenDistrictDataLight = () => {
        let districtId=filter.senatorialDistrict;
        dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT'});
        const url = (districtId=='all')?`${getDashboardByState}/default-state/${filter.state}/${electionType}`:`${getDashboardBySenatorialDistrict}/${districtId}/${electionType}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
                dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT_SUCCESS', payload: {response: res}});
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const refreshReports = () => {
        // if state is null refresh default else refresh using state values
        if(filter.lga !== 'all'){
            getDashboardLgaDataLight();
        }else if(filter.senatorialDistrict !== 'all'){
            getDashboardSenDistrictDataLight();
        }else{
            getDashboardDataLight();
        }
    }

    const getLgas = (district) => {
        let url = '';
        if(district){
            if(district ==='all'){
                url=`${getLgasByStateId}/${filter.state}`;
                getDashboardData();
            }else{
                getDashboardSenDistrictData(district);
            }
        }else{
            if(filter.lga==='all'){
                if(filter.senatorialDistrict ==='all' || filter.senatorialDistrict ===''){
                    url=`${getLgasByStateId}/${filter.state}`;
                    getDashboardData();
                }else{
                    getDashboardSenDistrictData(filter.senatorialDistrict);
                }
            }
            else if(filter.senatorialDistrict===''){
                url = `${getLgasByStateId}/${filter.state}`;
            }
        }
        if(url !==''){
            apiRequest(url, 'get')
            .then(res => {
                setLgas(res.lgas);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
        }
    }

    const getLgasBySen = (senId) => {
        if(senId != 'all') {
          apiRequest(`${getLgasBySenatorialDistrict}/${senId}`, 'get')
            .then(res => {
                setLgas(res.lgas);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
        }
        else{
          getLgas(senId);
        }
    }

    const getSenatorialDistricts = (state) => {
        apiRequest(`${getSenatorialDistrictsByStateId}/${state || filter.state}`, 'get')
        .then(res => {
            setSenatorialDistricts(res.senatorialDistricts);
        })
        .catch(err => {
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        })
    }
    
    const getLgasByState = (state) => {
        apiRequest(`${getLgasByStateId}/${state}`, 'get')
        .then(res => {
            setLgas(res.lgas);
        })
        .catch(err => {
        })
    }
    
    const getStates = () => {
        apiRequest(`${allStates}`, 'get')
        .then(res => {
            setStates(res.states);
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
        getStates();
        getElectionTypes();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(refreshReports, 30000);
        return ()=>clearInterval(intervalId);
    }, [electionType, filter.senatorialDistrict, filter.state, filter.lga])

    useEffect(() => {
        refreshReports();
    }, [electionType])

    useEffect(() => {
        getSenatorialDistricts();
    }, [filter.senatorialDistrict])


    useEffect(() => {
        getLgas();
    }, [filter.lga])

    return(
        <Layout location={location}>
            <div className="shadow-container w-full px-1 pb-1 rounded-sm text-1xl font-bold">
                <select
                    name="electionType"
                    onChange={(e) => getDashboardElectionTypeData(e.target.value)}
                    value={filter.electionType}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"130px"}}
                >
                    <option value='all'>Election Type</option>
                    {electionTypeList.map(electionType => (<option key={electionType.id} value={electionType.id}>{electionType.name}</option>))}
                </select>&nbsp;
                {authState.user?.userDetails?.role == 'administrator' && 
                <select
                    name="state"
                    onChange={(e) => getDashboardStateData(e.target.value)}
                    value={filter.state}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"80px"}}
                >
                    <option value='all'>State</option>
                    {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                </select>}&nbsp;
                
                <select
                    name="senatorialDistrict"
                    onChange={(e) => getDashboardSenDistrictData(e.target.value)}
                    value={filter.senatorialDistrict}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"130px"}}
                >
                    <option value='all'>Senatorial Districts</option>
                    {senatorialDistricts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                </select>&nbsp;
                <select
                    name="lga"
                    onChange={(e) => getDashboardLgaData(e.target.value)}
                    value={filter.lga}
                    className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                    style={{width:"80px"}}
                >
                    <option value='all'>Lgas</option>
                    {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                </select>&nbsp;
                
                <div style={{float:"right", padding:5}}>
                    <span className="text-sm">Registered Voters: </span>
                    <span className="text-1xl font-bold" style={{paddingRight:5}}>{dashboard?.totalRegisteredVotes.toLocaleString() || 0}</span>
                    <span style={{ backgroundColor:"#ff0000", color:"white", borderRadius:"5px", padding:5, paddingLeft:5, paddingRight:5}}>
                        <span className="text-sm">Results Received: </span>
                        <span className="text-1xl font-bold">{dashboard?.resultReceived?.toFixed(2) || 0}%</span>
                    </span>
                </div>
            </div>
            <div className="w-full lg:flex">
                <div className="lg:w-10/10 w-full mr-4">
                    <StackedBarChart data={dashboard?.lgaResults || []}/>
                </div>
            </div>
            <div className="w-full lg:flex">
                <div className="lg:w-7/10 w-full mr-4">
                {dashboardState.loading ?
                            <div className="flex justify-center my-6">
                                <Loader />
                            </div> :
                        <Results data={dashboard?.lgaResults || []} politicalParties={dashboard?.partyResult} stateId={filter.state}/>
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

export default ResultDashboard;

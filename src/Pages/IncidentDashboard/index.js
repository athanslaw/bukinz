import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AuthContext } from '../../contexts/AuthContext';
import { IncidentContext } from '../../contexts/IncidentContext';
import { showToast } from '../../helpers/showToast';
import { commaSeparateNumber } from '../../helpers/utils';
import { apiRequest } from '../../lib/api';
import { allStates, getIncidentDashboard, getIncidentDashboardByLga, getIncidentDashboardBySenatorialDistrict, getLgasBySenatorialDistrict, getLgasByStateId, getSenatorialDistrictsByStateId } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import IncidentsData from './components/IncidentsData';

const IncidentDashboard = ({match, location, history}) => {
    const [incidentState, dispatch] = useContext (IncidentContext);
    const [authState] = useContext(AuthContext);
    const [senatorialDistricts, setSenatorialDistrict] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [dashboard, setDashboard] = useState();
    const [states, setStates] = useState([]);
    const defaultState = authState.user?.userDetails?.stateId;
    const [filter, setFilter] = useState({lga: 'all', senatorialDistrict: 'all', state: defaultState});
    const [refreshField, setRefreshField] = useState('state');

     const getDashboardData = () => {
        dispatch({type: 'GET_INCIDENT_DASHBOARD'});
         apiRequest(`${getIncidentDashboard}/state/${filter.state}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENT_DASHBOARD_SUCCESS', payload: {response: res}});
                setDashboard(res);
                setRefreshField('state');
            })
            .catch((err) => {
                dispatch({type: 'GET_INCIDENT_DASHBOARD_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const getDashboardDataLight = () => {
         apiRequest(`${getIncidentDashboard}/state/${filter.state}`, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getSenatorialDistricts = (state) => {
        apiRequest(`${getSenatorialDistrictsByStateId}/${state || filter.state}`, 'get')
            .then(res => {
                setSenatorialDistrict(res.senatorialDistricts);
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
    
    const getLgas = (district) => {let url = '';
        if(district){
            if(district ==='all'){
                url=getLgasByStateId;
                getDashboardData();
            }else{
                getDashboardBySenatorialDistrict(filter.senatorialDistrict);
            }
        }else{
            if(filter.lga==='all'){
                if(filter.senatorialDistrict ==='all' || filter.senatorialDistrict ===''){
                    url=getLgasByStateId;
                    getDashboardData();
                }else{
                    getDashboardBySenatorialDistrict(filter.senatorialDistrict);
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
        if(senId != 'all') {apiRequest(`${getLgasBySenatorialDistrict}/${senId}`, 'get')
            .then(res => {
                setLgas(res.lgas);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })}
            else{
              getLgas(senId);
            }
    }

    const getDashboardBySenatorialDistrict = (senatorialDistrict) => {
        setFilter({...filter, senatorialDistrict: senatorialDistrict})
        dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT'});
        const url = (senatorialDistrict=='all')?`${getIncidentDashboard}/state/${filter.state}`:`${getIncidentDashboardBySenatorialDistrict}/${senatorialDistrict}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                setDashboard(res);
                setRefreshField('district');
                getLgasBySen(senatorialDistrict);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardStateData = (state) => {
        setFilter({...filter, senatorialDistrict:'all', lga:'all', 'state': state})
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
        const url = `${getIncidentDashboard}/state/${state}`;
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
        const senatorialDistrict = filter.senatorialDistrict;
        const url = (senatorialDistrict=='all')?`${getIncidentDashboard}/state/${filter.state}`:`${getIncidentDashboardBySenatorialDistrict}/${senatorialDistrict}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaData = (lgaid) => {
        setFilter({...filter, lga: lgaid})
        dispatch({type: 'GET_DASHBOARD_BY_LGA'});
        const url = (lgaid=='all')?`${getIncidentDashboard}/state/${filter.state}`:`${getIncidentDashboardByLga}/${lgaid}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                setDashboard(res);
                setRefreshField('lga');
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaDataLight = () => {
        const lgaid = filter.lga;
        const url = (lgaid=='all')?`${getIncidentDashboard}/state/${filter.state}`:`${getIncidentDashboardByLga}/${lgaid}`
         apiRequest(url, 'get')
            .then((res) => {
                setDashboard(res);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const refreshReports = () => {
        // if state is null refresh default else refresh using state values
        if(refreshField==='state'){
            getDashboardDataLight();
        }else if(refreshField==='district'){
            getDashboardSenDistrictDataLight();
        }else{
            getDashboardLgaDataLight();
        }
    }

    useEffect(() => {
        getDashboardData();
        getStates();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(refreshReports, 30000);
        return ()=>clearInterval(intervalId);
    }, [filter.state, filter.senatorialDistrict, filter.lga])

    useEffect(() => {
        getSenatorialDistricts();
    }, [filter.senatorialDistrict])

    useEffect(() => {
        getLgas();
    }, [filter.lga])

    return(
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-1 pb-1 rounded-sm text-1xl font-bold" setCrumbs={() => [{id: 1,title: 'Dashboard', pathname: "/dashboard"},
                                        {id: 2,title: 'Incidents', pathname: match.path}]}/>
            <div className="w-full flex">
                <div className="w-6/10 mr-4">
                    <IncidentsData data={dashboard?.lgaIncidentReports || []} stateId={filter.state}/>
                </div>
                <div className="w-4/10"><br/>
                    <div>
                        {(authState.user?.userDetails?.role == 'administrator' || authState.user?.userDetails?.role === 'National Executive') && 
                        <select
                            name="state"
                            onChange={(e) => getDashboardStateData(e.target.value)}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                        >
                            <option value='all'>State</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select>}
                        
                        <select
                            name="senatorialDistrict"
                            onChange={(e) => getDashboardBySenatorialDistrict(e.target.value)}
                            value={filter.senatorialDistrict}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                        >
                            <option value='all'>All Senatorial Districts</option>
                            {senatorialDistricts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => getDashboardLgaData(e.target.value)}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                        >
                            <option value='all'>All Lgas</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                    </div>
                    <div className="shadow-container my-7 pt-2 pb-7 px-9">
                        <p className="text-2xl font-bold text-darkerGray mb-3">{dashboard?.incidentCount || 0} Incidents</p>
                        {dashboard?.incidentReports.map((report, index) => <div className="font-light w-full flex text-xl" key={index} style={{"fontSize":14}}><span className="w-7/10">{report.incidentType}</span><span className="w-3/10">{`${commaSeparateNumber(report.count)} (${report.percent?.toFixed(2) || 0}%)`}</span></div>)}
                    </div>
                </div>
            </div>

        </Layout>
    );
}

export default IncidentDashboard;

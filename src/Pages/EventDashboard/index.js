import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AuthContext } from '../../contexts/AuthContext';
import { IncidentContext } from '../../contexts/IncidentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api';
import { allStates, event, getDashboardEvents, getLgasBySenatorialDistrict, getLgasByStateId, getSenatorialDistrictsByStateId, getWardsByLgaId } from '../../lib/url.js';
import Loader from '../../shared/components/Loader';
import useWindowDimensions from '../../shared/components/useWindowDimensions';
import Layout from '../../shared/Layout';
import EventsData from './components/EventsData';

const EventDashboard = ({match, location, history}) => {
    const [incidentState, dispatch] = useContext (IncidentContext);
    const [authState] = useContext(AuthContext);
    const [senatorialDistricts, setSenatorialDistrict] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [wards, setWards] = useState([]);
    const [dashboard, setDashboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [states, setStates] = useState([]);
    const [events, setEvents] = useState([]);
    const defaultState = authState.user?.userDetails?.stateId;
    const [filter, setFilter] = useState({ward: 'all', lga: 'all', senatorialDistrict: 'all', state: defaultState, eventId:0, eventName:""});
    const [refreshField, setRefreshField] = useState('state');
    const { height, width } = useWindowDimensions();

    const getEvents = () => {
        apiRequest(`${event}/active`, 'get')
        .then(res => {
            setEvents(res.events);
            multipleEvents("","",res.events);
        })
        .catch(err => {
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        })
    }

    const multipleEvents = (type="", value="", myEvents) => {
        setIsLoading(true);
        if(type === ""){
            if(filter.eventId !=0 && filter.eventId != undefined){
                getDashboardData(filter.eventId, filter.eventName);
            }
            else{
                if(myEvents){myEvents.forEach((e, index) => getDashboardData(e.id, e.description, index));}
                else{events.forEach((e, index) => getDashboardData(e.id, e.description, index));}
            }
        }else if(type === "state"){
            if(filter.eventId!=0 && filter.eventId != undefined){
                getDashboardStateData(value, filter.eventId, filter.eventName);
            }
            else{
                events.forEach((e, index) => getDashboardStateData(value, e.id, e.description, index));
            }
        }else if(type === "district"){
            if(filter.eventId!=0 && filter.eventId != undefined){
                getDashboardBySenatorialDistrict(value, filter.eventId, filter.eventName);
            }
            else{
                events.forEach((e, index) => getDashboardBySenatorialDistrict(value, e.id, e.description, index));
            }
        }else if(type === "lga"){
            if(filter.eventId!=0 && filter.eventId != undefined){
                getDashboardLgaData(value, filter.eventId, filter.eventName);
            }
            else{
                events.forEach((e, index) => getDashboardLgaData(value, e.id, e.description, index));
            }
        }else if(type === "ward"){
            if(filter.eventId!=0 && filter.eventId != undefined){
                getDashboardWardData(value, filter.eventId, filter.eventName);
            }
            else{
                events.forEach((e, index) => getDashboardWardData(value, e.id, e.description, index));
            }
        }
        setTimeout(()=>setIsLoading(false),2000);
    }

    const multipleRefresh = (eventConcat="") => {
        setIsLoading(true);
        let eId = filter.eventId;
        let eName = filter.eventName;
        if(eventConcat != ""){
            if(eventConcat == "0___1"){
                eId = 0;
            }else{
                eId = eventConcat.split("___")[0];
                eName = eventConcat.split("___")[1];
            }
        }
        // if state is null refresh default else refresh using state values
        if(refreshField==='state'){
            if(eId != 0){
                getDashboardDataLight(eId, eName);
            }
            else{
                events.forEach((e, index) => getDashboardDataLight(e.id, e.description, index));
            }
        }else if(refreshField==='district'){
            if(eId != 0){
                getDashboardSenDistrictDataLight(eId, eName);
            }
            else{
                events.forEach((e, index) => getDashboardSenDistrictDataLight(e.id, e.description, index));
            }
        }else if(refreshField==='lga'){
            if(eId != 0){
                getDashboardLgaDataLight(eId, eName);
            }
            else{
                events.forEach((e, index) => getDashboardLgaDataLight(e.id, e.description, index));
            }
        }else{
            if(eId != 0){
                getDashboardWardDataLight(eId, eName);
            }
            else{
                events.forEach((e,index) => getDashboardWardDataLight(e.id, e.description, index));
            }
        }
        setTimeout(()=>setIsLoading(false),2000);
    }

     const getDashboardData = (eventId, eventName, index=0) => {
        dispatch({type: 'GET_INCIDENT_DASHBOARD'});
        const url = filter.state?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`
        :`${getDashboardEvents}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENT_DASHBOARD_SUCCESS', payload: {response: res}});
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
                setRefreshField('state');
            })
            .catch((err) => {
                dispatch({type: 'GET_INCIDENT_DASHBOARD_FAILURE', payload: {error: err}});
            });
    }

    const getDashboardDataLight = (eventId, eventName, index=0) => {
         apiRequest(`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`, 'get')
            .then((res) => {
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
            })
            .catch((err) => {
            });
    }

    const getSenatorialDistricts = (state) => {
        apiRequest(`${getSenatorialDistrictsByStateId}/${state || filter.state}`, 'get')
            .then(res => {
                setSenatorialDistrict(res.senatorialDistricts);
            })
            .catch(err => {

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
                multipleEvents();
            }else{
                multipleEvents("district",filter.senatorialDistrict);
            }
        }else{
            if(filter.lga==='all'){
                if(filter.senatorialDistrict ==='all' || filter.senatorialDistrict ===''){
                    url=getLgasByStateId;
                    multipleEvents();
                }else{
                    multipleEvents("district",filter.senatorialDistrict);
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

    const getWardByLgas = (lgaid) => {
        if(lgaid != 'all') {apiRequest(`${getWardsByLgaId}/${lgaid}`, 'get')
            .then(res => {
                setWards(res.wards);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })}
    }

    const getDashboardBySenatorialDistrict = (senatorialDistrict, eventId, eventName, index=0) => {
        setFilter({...filter, senatorialDistrict: senatorialDistrict})
        dispatch({type: 'GET_DASHBOARD_BY_SENATORIAL_DISTRICT'});
        const url = (senatorialDistrict=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/senatorial-district/${senatorialDistrict}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                let dashboardRes = dashboard;
                dashboardRes[index] = ({id:eventId, eventName:eventName, response: JSON.stringify(res)})
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
                setRefreshField('district');
                getLgasBySen(senatorialDistrict);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardStateData = (state, eventId, eventName, index=0) => {
        setFilter({...filter, senatorialDistrict:'all', lga:'all', 'state': state})
        dispatch({type: 'GET_DASHBOARD_BY_STATE'});
        const url = `${getDashboardEvents}/state/${state}?eventId=${eventId}`;
         apiRequest(url, 'get')
            .then((res) => {
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
                dispatch({type: 'GET_DASHBOARD_BY_STATE_SUCCESS', payload: {response: res}});
                getSenatorialDistricts(state);
                getLgasByState(state);
            })
            .catch((err) => {
                if(err?.response?.data?.status == 401) history.replace("/login");
            });
    }

    const getDashboardSenDistrictDataLight = (eventId, eventName, index=0) => {
        const senatorialDistrict = filter.senatorialDistrict;
        const url = (senatorialDistrict=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/senatorial-district/${senatorialDistrict}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaData = (lgaid, eventId, eventName, index=0) => {
        setFilter({...filter, lga: lgaid})
        dispatch({type: 'GET_DASHBOARD_BY_LGA'});
        const url = (lgaid=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/lga/${lgaid}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)};
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
                getWardByLgas(lgaid);
                setRefreshField('lga');
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardLgaDataLight = (eventId, eventName, index=0) => {
        const lgaid = filter.lga;
        const url = (lgaid=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/lga/${lgaid}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardWardData = (wardId, eventId, eventName, index=0) => {
        setFilter({...filter, ward: wardId})
        dispatch({type: 'GET_DASHBOARD_BY_WARD'});
        const url = (wardId=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/ward/${wardId}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
                setRefreshField('ward');
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    const getDashboardWardDataLight = (eventId, eventName, index=0) => {
        const wardId = filter.ward;
        const url = (wardId=='all')?`${getDashboardEvents}/state/${filter.state}?eventId=${eventId}`:`${getDashboardEvents}/ward/${wardId}?eventId=${eventId}`
         apiRequest(url, 'get')
            .then((res) => {
                let dashboardRes = dashboard;
                dashboardRes[index] = {id:eventId, eventName:eventName, response: JSON.stringify(res)}
                if(index ===0) dashboardRes = [{id:eventId, eventName:eventName, response: JSON.stringify(res)}];
                setDashboard(dashboardRes);
            })
            .catch((err) => {
                if(err.response.data.status == 401) history.replace("/login");
            });
    }

    useEffect(() => {
        getStates();
        getEvents();
    }, [])


    useEffect(() => {
        const intervalId = setInterval(multipleRefresh, 30000);
        return ()=>clearInterval(intervalId);
    }, [filter.eventId, filter.ward, filter.lga, filter.senatorialDistrict, filter.state])

    useEffect(() => {
        getSenatorialDistricts();
    }, [filter.senatorialDistrict])

    useEffect(() => {
        getLgas();
    }, [filter.lga])


    
    const displayCharts = (dashboard, index) => {
        return dashboard[index+1]? (
        <div className="w-full flex">
            {dashboard[index] && <><div className="w-3/10">
                <EventsData eventName={dashboard[index].eventName || ""} data={dashboard[index].response || []} stateId={filter.state}/>
            </div></>}
            <><div className="w-3/10">
                <EventsData eventName={dashboard[index+1].eventName || ""} data={dashboard[index+1].response || []} stateId={filter.state}/>
            </div></>
            {dashboard[index+2] && <><div className="w-3/10">
                <EventsData eventName={dashboard[index+2].eventName || ""} data={dashboard[index+2].response || []} stateId={filter.state}/>
            </div></>}
        </div>
        ):(
            <div className="w-full flex">{<div className="w-3/10"/>}
                {dashboard[index] && <><div className="w-3/10">
                    <EventsData eventName={dashboard[index].eventName || ""} data={dashboard[index].response || []} stateId={filter.state}/>
                </div></>}
            </div>
            )
    }

    const loops = (dashboard) => {
        let resp = [];
        for(let i=0; i <= dashboard.length; i += 3){
           resp.push(i);
        }
        return resp;
    }
   


    return(
        <Layout location={location}>
            
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-1 pb-1 rounded-sm text-1xl font-bold" setCrumbs={() => [{id: 1,title: 'Dashboard', pathname: "/dashboard"},
                                        {id: 2,title: 'Events', pathname: match.path}]}/>
            <div className="shadow-container w-full px-1 pb-1 rounded-sm text-1xl font-bold">
            <select
                name="eventId"
                onChange={(e) => {
                    setFilter({...filter, 'eventId':e.target.value.split("___")[0], 'eventName': e.target.value.split("___")[1], 'eventConcat': e.target.value});
                    multipleRefresh(e.target.value);
                }}
                value={filter.eventConcat}
                className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                style={{width:"130px"}}
            >
                <option value='0___1'>Events</option>
                {events.map(eventItem => (<option key={eventItem.description} value={`${eventItem.id}___${eventItem.description}`}>{eventItem.description}</option>))}
            </select>&nbsp;
            {(authState.user?.userDetails?.role == 'administrator' || authState.user?.userDetails?.role === 'National Executive') && 
            <select
                name="state"
                onChange={(e) => multipleEvents("state", e.target.value)}
                value={filter.state}
                className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                style={{width:"130px"}}
            >
                <option value='all'>State</option>
                {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
            </select>}
            
            &nbsp;<select
                name="senatorialDistrict"
                onChange={(e) => multipleEvents("district", e.target.value)}
                value={filter.senatorialDistrict}
                className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                style={{width:"130px"}}
            >
                <option value='all'>All Senatorial Districts</option>
                {senatorialDistricts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
            </select>&nbsp;
            <select
                name="lga"
                onChange={(e) => multipleEvents("lga", e.target.value)}
                value={filter.lga}
                className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                style={{width:"130px"}}
            >
                <option value='all'>All Lgas</option>
                {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
            </select>&nbsp;
            <select
                name="ward"
                onChange={(e) => multipleEvents("ward", e.target.value)}
                value={filter.ward}
                className="border border-primary rounded-sm px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                style={{width:"130px"}}
            >
                <option value='all'>All Wards</option>
                {wards.map(wardItem => (<option key={wardItem.id} value={wardItem.id}>{wardItem.name}</option>))}
            </select>
                
            </div>
            <div style={{"height":height/20}} />
            {isLoading?<div className="flex justify-center my-6">
                        <Loader />
                    </div> : loops(dashboard).map(i => displayCharts(dashboard, i))}

        </Layout>
    );
}

export default EventDashboard;

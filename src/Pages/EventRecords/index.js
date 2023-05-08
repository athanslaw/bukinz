import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { AuthContext } from "../../contexts/AuthContext";
import { IncidentContext } from "../../contexts/IncidentContext";
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import {
    allStates, event, eventRecord, getGeoPoliticalZones, getLgasBySenatorialDistrict,
    getPollingUnitsByWardId, getSenatorialDistrictsByStateId, getWardsByLgaId, users
} from '../../lib/url.js';
import Pagination from "../../shared/components/Pagination";
import Layout from "../../shared/Layout";
import EventRecordList from "./EventRecordList";

const EventRecords = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [eventsState, dispatch] = useContext(IncidentContext);
    const [authState] = useContext(AuthContext);
    const [filter, setFilter] = useState({zone: '', state:authState.user?.userDetails?.stateId, senatorial: '', lga: '', ward: '', pollingUnit: '', eventId: ''});
    const [lgas, setLgas] = useState([]);
    const [senatorialDistricts, setSenatorialDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [zones, setZones] = useState([]);
    const [eventDatas, setEventDatas] = useState([]);
    const [wards, setWards] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentEvents, setCurrentEvents] = useState([]);
    
    
    const filterData1 = (e) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        let url = '';
        dispatch({type: 'GET_INCIDENTS'});
        
        let param = filter.eventId?"eventId="+filter.eventId+"&":"";
        if(name === 'pollingUnit'){
          setFilter({...filter, 'pollingUnit':value});
          if(value === ''){
            param += "ward="+filter.ward;
            url = `${eventRecord}/ward-events?${param}`;
          }else{
            param += "pollingUnit="+value;
            url = `${eventRecord}/pu-events?${param}`;
          }
        }
        else if(name ==='ward'){
          setFilter({...filter, ward: value, pollingUnit: ''});
          if(value === ''){
            param += "lga="+filter.lga;
            url = `${eventRecord}/lga-events?${param}`;
            setPollingUnits([]);
          }else{
            param += "ward="+value;
            url = `${eventRecord}/ward-events?${param}`;
          }
          getPollingUnits(value);
        }
        else if(name === 'lga'){
            setFilter({...filter, lga: value, ward: '', 'pollingUnit': ''});
            if(value === ''){
                param += "senatorial="+filter.senatorial;
                url = `${eventRecord}/senatorial-events?${param}`;
                setWards([]);
                setPollingUnits([]);
            }else{
                param += "lga="+value;
                url = `${eventRecord}/lga-events?${param}`;
            }
            getWards(value);
        }
        else if(name === 'senatorial'){
          setFilter({...filter, senatorial: value, lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = eventRecord;
            setLgas([])
            setWards([]);
            setPollingUnits([]);
          }else{
            param += "senatorial="+value;
            url = `${eventRecord}/senatorial-events?${param}`;
          }
          getLgas(value);
        }
        else if(name === 'state'){
          setFilter({...filter, state: value, senatorial: '', lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = eventRecord;
            setLgas([])
            setWards([]);
            setPollingUnits([]);
          }else{
            param += "state="+value;
            url = `${eventRecord}/state-events?${param}`;
          }
          getSenatorialDistricts(value);
        }
        else if(name === 'zone'){
          setFilter({zone: value, state:'', senatorial: '', lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = eventRecord;
            setLgas([])
            setWards([]);
            setPollingUnits([]);
            setSenatorialDistricts([]);
          }else{
            param += "zone="+value;
            url = `${eventRecord}/zone-events?${param}`;
          }
          getStates(value);
        }
        else if(name === 'eventId'){
            setFilter({...filter, 'eventId': value});
            if(filter.pollingUnit !== ''){
                param += "pollingUnit="+filter.pollingUnit;
                url = `${eventRecord}/pu-event?${param}`;
            }else if(filter.ward !== ''){
                param += "ward="+filter.ward;
                url = `${eventRecord}/ward?${param}`;
            }else if(filter.lga !== ''){
                param += "lga="+filter.lga;
                url = `${eventRecord}/lga?${param}`;
            }else if(filter.senatorial !== ''){
                param += "senatorial="+filter.ward;
                url = `${eventRecord}/senatorial?${param}`;
            }else{
                url = `${eventRecord}/event-id/${value}`;
            }
        }
        else {
          setFilter({lga:'', ward:'', pollingUnit:''});
          return;
        }

         apiRequest(url, 'get')
          .then((res) => {
              dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
              setCurrentEvents(res.eventRecords.slice(0,10));
          })
          .catch((err) => {
              dispatch({type: 'GET_INCIDENTS_FAILURE', payload: {error: err}});
              setCurrentEvents([]);
              showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
              // setSubmitting(false);
          });

    }

    const onPageChanged = data => {
        const allEvents = eventsState.eventRecords;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const eventLists = allEvents?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentEvents(eventLists);
    }

    const getAllEvents = () => {
        dispatch({type: 'GET_INCIDENTS'});
         apiRequest(eventRecord, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                setCurrentEvents(res.eventRecords);
            })
            .catch((err) => {
                dispatch({type: 'GET_INCIDENTS_FAILURE', payload: {error: err}});
                err.response.data.status === 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
    }

    const clearFilter = () => {
        setFilter({lga: '', ward: '', 'polling-unit': '', 'eventId':''});
        setSearch("");
        getAllEvents();
    }

    const getZones = () => {
        apiRequest(`${getGeoPoliticalZones}`, 'get')
            .then(res => {
                setZones([...res.geoPoliticalZoneList]);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getStates = (value) => {
        let zoneId = value || filter.zone;
        apiRequest(`${allStates}/zone/${zoneId}`, 'get')
            .then(res => {
                setStates([...res.states]);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getSenatorialDistricts = (value) => {
        let stateId = value || filter.state;
        apiRequest(`${getSenatorialDistrictsByStateId}/${stateId}`, 'get')
            .then(res => {
                let senatorialDistrictRes = [...res.senatorialDistricts];
                if(authState.user?.userDetails?.role === 'User'){
                    apiRequest(`${users}/location`, 'get')
                    .then((res1) => {
                        senatorialDistrictRes = senatorialDistrictRes.filter((senatorialDistrict) => senatorialDistrict.id===res1.senatorialDistrictId)
                        setSenatorialDistricts(senatorialDistrictRes)
                    })
                    .catch((err) => {
                    });
                }
                else{
                    setSenatorialDistricts(senatorialDistrictRes);
                }
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getLgas = (senatorialDistrict) => {
        if(senatorialDistrict) {apiRequest(`${getLgasBySenatorialDistrict}/${senatorialDistrict}`, 'get')
            .then(res => {
                let lgas = [...res.lgas];
                if(authState.user?.userDetails?.role === 'User'){
                    apiRequest(`${users}/location`, 'get')
                    .then((res1) => {
                        lgas = lgas.filter((lga) => lga.id===res1.lgaId)
                        setLgas(lgas)
                    })
                    .catch((err) => {
                    });
                }
                else{
                    setLgas(lgas);
                }
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })}
    }

    const getWards = (lgaId) => {
        if(lgaId) {apiRequest(`${getWardsByLgaId}/${lgaId}`, 'get')
            .then(res => {
                setWards(res.wards);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })}
    }

    const getPollingUnits = (wardId) =>{
        if(wardId){apiRequest(`${getPollingUnitsByWardId}/${wardId}`, 'get')
            .then((res) => {
                setPollingUnits(res.pollingUnits)
            })
            .catch((err) => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });}
    }


    const getEventData = () =>{
        apiRequest(`${event}`, 'get')
            .then((res) => {
                setEventDatas(res.events)
            })
            .catch((err) => {
            });
    }

    useEffect(() => {
        getEventData();
        getAllEvents();
        getZones();
        getSenatorialDistricts();
    }, []);

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Event Entries',
            pathname: match.path}]}/>
            <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <div className="lg:flex justify-between items-center px-1">
                    <div className="xl:w-4.5/10 lg:w-6/10 flex items-center px-1 w-full">
                    {(authState.user?.userDetails?.role !== 'User')&&<><select
                            name="zone"
                            onChange={filterData1}
                            value={filter.zone}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>All Geopolitical Zones</option>
                            {zones.map(zone => (<option key={zone.id} value={zone.id}>{zone.name}</option>))}
                        </select>
                        <select
                            name="state"
                            onChange={filterData1}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>All States</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select></>}
                        <select
                            name="senatorial"
                            onChange={filterData1}
                            value={filter.senatorial}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>All Senatorial Districts</option>
                            {senatorialDistricts.map(senatorialDistrict => (<option key={senatorialDistrict.id} value={senatorialDistrict.id}>{senatorialDistrict.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={filterData1}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>All Lgas</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                        <select
                            name="ward"
                            onChange={filterData1}
                            value={filter.ward}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-4"
                        >
                            <option value=''>All Wards</option>
                            {wards.map(ward => (<option key={ward.id} value={ward.id}>{ward.code} - {ward.name}</option>))}
                        </select>
                        <select
                            name="pollingUnit"
                            onChange={filterData1}
                            value={filter.pollingUnit}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>All Polling Units</option>
                            {pollingUnits.map(pollingUnit => (<option key={pollingUnit.id} value={pollingUnit.id}>{pollingUnit.code} - {pollingUnit.name}</option>))}
                        </select>
                        <select
                            name="eventId"
                            onChange={filterData1}
                            value={filter.eventId}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>All Events</option>
                            {eventDatas.filter(event=>event.status===true).map(event => (<option key={event.id} value={event.id}>{event.description}</option>))}
                        </select>
                        <div className="cursor-pointer" style={{color:'red'}} onClick={clearFilter}>clear</div>
                    </div>
                </div>

                <EventRecordList eventRecords={currentEvents} events={eventDatas} loading={eventsState.loading} getEvents={getAllEvents}/>
                {!eventsState.loading && <div className="flex justify-between items-center mt-4">
                   
                    {eventsState.incidents?.length > 0 && <div>
                        <Pagination totalRecords={eventsState.incidents.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default EventRecords;

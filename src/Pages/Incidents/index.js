import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { IncidentContext } from "../../contexts/IncidentContext";
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { users } from '../../lib/url';
import { allIncidents, allIncidentTypes, allStates, filterIncidents, getGeoPoliticalZones, getLgasBySenatorialDistrict, getPollingUnitsByWardId, getSenatorialDistrictsByStateId, getWardsByLgaId, uploadIncident } from '../../lib/url.js';
import Downloader from "../../shared/components/Downloader";
import Pagination from "../../shared/components/Pagination";
import Uploader from "../../shared/components/Uploader";
import Layout from "../../shared/Layout";
import IncidentList from "./IncidentList";

const Incidents = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [incidentState, dispatch] = useContext(IncidentContext);
    const [authState] = useContext(AuthContext);
    const [filter, setFilter] = useState({zone: '', state:authState.user?.userDetails?.stateId, senatorial: '', lga: '', ward: '', pollingUnit: '', incidentType: '', incidentWeight: ''});
    const [lgas, setLgas] = useState([]);
    const [senatorialDistricts, setSenatorialDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [zones, setZones] = useState([]);
    const [wards, setWards] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [incidentWeights, setIncidentWeights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentIncidents, setCurrentIncidents] = useState([]);
    
    
    const headers = [
        { label: 'Incident Type', key: 'incidentType.name' },
        { label: 'Incident Status', key: 'incidentStatus.name' },
        { label: 'Local Government Area', key: 'lga.name' },
        { label: 'Ward', key: 'ward.name' },
        { label: 'Polling Unit', key: 'pollingUnit.name' },
        { label: 'Location', key: 'reportedLocation' },
        { label: 'Phone number to contact', key: 'phoneNumberToContact' },
        { label: 'Description', key: 'description' }
    ];

    const filterData1 = (value, name) => {
        let url = '';
        dispatch({type: 'GET_INCIDENTS'});
        
        let param = filter.incidentWeight?.length>0?'incidentWeight='+filter.incidentWeight: "";
        param += filter.incidentType?.length>0?(param!=""?'&incidentType='+filter.incidentType: 'incidentType='+filter.incidentType):"";
        if(name === 'pollingUnit'){
          setFilter({...filter, 'pollingUnit':value});
          if(value === ''){
            url = `${filterIncidents}/ward/${filter.ward}?${param}`;
          }else{
            url = `${filterIncidents}/polling-unit/${value}?${param}`;
          }
        }
        else if(name ==='ward'){
          setFilter({...filter, ward: value, pollingUnit: ''});
          if(value === ''){
            url = `${filterIncidents}/lga/${filter.lga}?${param}`;
          }else{
            url = `${filterIncidents}/ward/${value}?${param}`;
          }
        }
        else if(name === 'lga'){
            setFilter({...filter, lga: value, ward: '', 'pollingUnit': ''});
            if(value === ''){
                url = `${filterIncidents}/senatorial/${filter.senatorial}?${param}`;
            }else{
                url = `${filterIncidents}/lga/${value}?${param}`;
            }
        }
        else if(name === 'senatorial'){
          setFilter({...filter, senatorial: value, lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = allIncidents;
          }else{
            url = `${filterIncidents}/senatorial/${value}?${param}`;
          }
        }
        else if(name === 'state'){
          setFilter({...filter, state: value, senatorial: '', lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = allIncidents;
          }else{
            url = `${filterIncidents}/state/${value}?${param}`;
          }
        }
        else if(name === 'zone'){
          setFilter({...filter, zone: value, state:'', senatorial: '', lga:'', ward: '', 'pollingUnit': ''});
          if(value === ''){
            url = allIncidents;
          }else{
            url = `${filterIncidents}/zone/${value}?${param}`;
          }
        }
        else if(name === 'incidentType'){
            setFilter({...filter, 'incidentType': value});
            if(filter.pollingUnit !== ''){
                url = `${filterIncidents}/polling-unit/${filter.pollingUnit}?${param}`;
            }else if(filter.ward !== ''){
                url = `${filterIncidents}/ward/${filter.ward}?${param}`;
            }else if(filter.lga !== ''){
                url = `${filterIncidents}/lga/${filter.lga}?${param}`;
            }else if(filter.senatorial !== ''){
                url = `${filterIncidents}/senatorial/${filter.senatorial}?${param}`;
            }else{
                url = `${allIncidents}?${param}`;
            }
        }
        else if(name === 'incidentWeight'){
          setFilter({...filter, 'incidentWeight': value});
          if(filter.pollingUnit !== ''){
            url = `${filterIncidents}/polling-unit/${filter.pollingUnit}?${param}`;
          }else if(filter.ward !== ''){
            url = `${filterIncidents}/ward/${filter.ward}?${param}`;
          }else if(filter.lga !== ''){
            url = `${filterIncidents}/lga/${filter.lga}?${param}`;
          }else if(filter.senatorial !== ''){
            url = `${filterIncidents}/senatorial/${filter.senatorial}?${param}`;
          }else{
            url = `${allIncidents}?${param}`;
          }
        }
        else {
          setFilter({...filter, lga:'', ward:'', pollingUnit:''});
          return;
        }

        //  setSubmitting(true);
         apiRequest(url, 'get')
          .then((res) => {
              dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
              setCurrentIncidents(res.incidents.slice(0,10));
          })
          .catch((err) => {
              dispatch({type: 'GET_INCIDENTS_FAILURE', payload: {error: err}});
              setCurrentIncidents([]);
              showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
              // setSubmitting(false);
          });

    }

    const onPageChanged = data => {
        const allIncidents = incidentState.incidents;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const incidents = allIncidents?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentIncidents(incidents);
    }

    const getAllIncidents = () => {
        dispatch({type: 'GET_INCIDENTS'});
         apiRequest(allIncidents, 'get')
            .then((res) => {
                dispatch({type: 'GET_INCIDENTS_SUCCESS', payload: {response: res}});
                setCurrentIncidents(res.incidents);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_INCIDENTS_FAILURE', payload: {error: err}});
                err.response.data.status === 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
    }

    const viewIncidents = () => {
        if(filter["pollingUnit"]){
            filterData1(filter['pollingUnit'], 'pollingUnit');
        }
        else if(filter.ward){
            filterData1(filter.ward, 'ward');
        }
        else if(filter.lga){
            filterData1(filter.lga, 'lga');
        }
        else if(filter.senatorial){
            filterData1(filter.senatorial, 'senatorial');
        }
        else if(filter.state){
            filterData1(filter.state, 'state');
        }else if(filter.zone){
            filterData1(filter.zone, 'zone');
        }else{
            alert("Kindly select an option");
        }
    }
    const clearFilter = () => {
        setFilter({lga: '', ward: '', 'polling-unit': '', incidentType:'', incidentWeight:''});
        setSearch("");
    }

    const getIncidentTypes = () => {
        apiRequest(allIncidentTypes, 'get')
            .then(res => {
                setIncidentTypes(res.incidentTypes);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
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

    useEffect(() => {
        getZones();
        getIncidentTypes();
        setIncidentWeights([
            {"id":1, "code":1, "name":"Not Critical"},
            {"id":2, "code":2, "name":"Not Very Critical"},
            {"id":3, "code":3, "name":"Manageable"},
            {"id":4, "code":4, "name":"Critical"},
            {"id":5, "code":5, "name":"Very Critical"}
        ]);
        getSenatorialDistricts();
    }, []);


    useEffect(() => {
        if(filter.ward){
            getPollingUnits(filter.ward);
        }
    }, [filter.ward])

    useEffect(() => {
        if(filter.lga){
            setPollingUnits([]);
            getWards(filter.lga);
        }
    }, [filter.lga])

    useEffect(() => {
        if(filter.senatorial){
            setWards([]);
            setPollingUnits([]);
            getLgas(filter.senatorial);
        }
    }, [filter.senatorial])

    useEffect(() => {
        if(filter.state){
            setLgas([])
            setWards([]);
            setPollingUnits([]);
            getSenatorialDistricts(filter.state);
        }
    }, [filter.state])

    useEffect(() => {
        if(filter.zone){
            setLgas([])
            setWards([]);
            setPollingUnits([]);
            setSenatorialDistricts([]);
            getStates(filter.zone);
        }
    }, [filter.zone])


    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incidents',
            pathname: match.path}]}/>
            <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <div className="lg:flex justify-between items-center px-1">
                    <div className="xl:w-7/10 lg:w-6.5/10 flex items-center px-1 w-full">
                    {(authState.user?.userDetails?.role !== 'User')&&<><select
                            name="zone"
                            onChange={(e) => setFilter({...filter, 'zone': e.target.value})}
                            value={filter.zone}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value='' disabled>All Geopolitical Zones</option>
                            {zones.map(zone => (<option key={zone.id} value={zone.id}>{zone.name}</option>))}
                        </select>
                        <select
                            name="state"
                            onChange={(e) => setFilter({...filter, 'state': e.target.value})}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value='' disabled>All States</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select></>}
                        <select
                            name="senatorial"
                            onChange={(e) => setFilter({...filter, 'senatorial': e.target.value})}
                            value={filter.senatorial}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value='' disabled>All Senatorial Districts</option>
                            {senatorialDistricts.map(senatorialDistrict => (<option key={senatorialDistrict.id} value={senatorialDistrict.id}>{senatorialDistrict.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => setFilter({...filter, 'lga': e.target.value})}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value=''>All Lgas</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                        <select
                            name="ward"
                            onChange={(e) => setFilter({...filter, 'ward': e.target.value})}
                            value={filter.ward}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-4"
                        >
                            <option value=''>All Wards</option>
                            {wards.map(ward => (<option key={ward.id} value={ward.id}>{ward.code} - {ward.name}</option>))}
                        </select>
                        <select
                            name="pollingUnit"
                            onChange={(e) => setFilter({...filter, 'pollingUnit': e.target.value})}
                            value={filter.pollingUnit}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value=''>All Polling Units</option>
                            {pollingUnits.map(pollingUnit => (<option key={pollingUnit.id} value={pollingUnit.id}>{pollingUnit.code} - {pollingUnit.name}</option>))}
                        </select>
                        <select
                            name="incidentType"
                            onChange={(e) => setFilter({...filter, 'incidentType': e.target.value})}
                            value={filter.incidentType}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value=''>Incident Types</option>
                            {incidentTypes.map(incidentType => (<option key={incidentType.id} value={incidentType.code}>{incidentType.name}</option>))}
                        </select>
                        <select
                            name="incidentWeight"
                            onChange={(e) => setFilter({...filter, 'incidentWeight': e.target.value})}
                            value={filter.incidentWeight}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                        >
                            <option value=''>Incident Weight</option>
                            {incidentWeights.map(incidentWeight => (<option key={incidentWeight.code} value={incidentWeight.code}>{incidentWeight.name}</option>))}
                        </select>
                        <div className="cursor-pointer bg-indigo-700 text-white py-1.5 px-3 font-bold rounded-sm mx-1" onClick={viewIncidents}>
                            View
                        </div>
                        <div className="cursor-pointer bg-lighterGray py-1.5 px-4 font-bold rounded-sm" style={{"color":"#772233"}} onClick={clearFilter}> clear</div>
                    </div>
                    <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                    <Link className="bg-primary py-2 px-4 text-white font-bold rounded-sm" to="/incidents/create">
                        Add Incident
                    </Link>
                    </div>
                </div>

                <IncidentList incidents={currentIncidents} loading={incidentState.loading} getIncidents={getAllIncidents}/>
                {!incidentState.loading && <div className="flex justify-between items-center mt-4">
                    <div className="flex">
                        <Uploader dispatch={dispatch} action="UPLOAD_INCIDENT" action_success="UPLOAD_INCIDENT_SUCCESS" action_error="UPLOAD_INCIDENT_FAILURE" url={uploadIncident} refresh={getAllIncidents} logout={() => history.replace("/login")}/>
                        {incidentState.incidents?.length > 0 && <Downloader dispatch={dispatch} action="DOWNLOAD_INCIDENTS_SUCCESS" headers={headers} data={incidentState.incidents || []} location={location} filename={'election_incidents.csv'} />}
                    </div>
                    {incidentState.incidents?.length > 0 && <div>
                        <Pagination totalRecords={incidentState.incidents.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default Incidents;

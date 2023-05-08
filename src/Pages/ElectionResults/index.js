import pickBy from 'lodash/pickBy';
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ResultContext } from "../../contexts/ResultContext";
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { users } from '../../lib/url';
import {
    allResults, allStates, electionTypes, filterResults, getGeoPoliticalZones, getLgasBySenatorialDistrict, getPollingUnitsByWardId, getSenatorialDistrictsByStateId,
    getWardsByLgaId, uploadResult
} from '../../lib/url.js';
import Downloader from "../../shared/components/Downloader";
import Pagination from "../../shared/components/Pagination";
import Uploader from "../../shared/components/Uploader";
import Layout from "../../shared/Layout";
import ResultList from "./ResultList";

const Results = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [resultState, dispatch] = useContext(ResultContext);
    const [authState] = useContext(AuthContext);
    const [filter, setFilter] = useState({zone: '', state:authState.user?.userDetails?.stateId, senatorialDistrict: '', lga: '', ward: '', 'polling-unit': '', electionType:''});
    const [lgas, setLgas] = useState([]);
    const [states, setStates] = useState([]);
    const [zones, setZones] = useState([]);
    const [senatorialDistricts, setSenatorialDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [currentResults, setCurrentResults] = useState([]);
    const [electionTypeList, setElectionTypeList] = useState([]);
    
    const handleChange = (event) => {
        setSearch(event.target.value);
    }
    const headers = [
        { label: 'Voting Level', key: 'votingLevel.name' },
        { label: 'Senatorial District', key: 'senatorialDistrict.name' },
        { label: 'Local Government Area', key: 'lga.name' },
        { label: 'Ward', key: 'ward.name' },
        { label: 'Polling Unit', key: 'pollingUnit.name' },
        { label: 'Election Type', key: 'electionTypeName' },
        { label: 'Party 1', key: 'resultPerParties[0].voteCount' },
        { label: 'Party 2', key: 'resultPerParties[1].voteCount' },
        { label: 'Party 3', key: 'resultPerParties[2].voteCount' },
        { label: 'Party 4', key: 'resultPerParties[3].voteCount' },
        { label: 'Party 5', key: 'resultPerParties[4].voteCount' },
        { label: 'Party 6', key: 'resultPerParties[5].voteCount' },
        { label: 'Others', key: 'resultPerParties[6].voteCount' },
        { label: 'Accredited Voters', key: 'accreditedVotersCount' },
        { label: 'Registered Voters', key: 'registeredVotersCount' },
    ];

    
    const filterData = (id,type) => {
        
        let url = `${filterResults}/${type}/${id}`;
        if(filter.electionType != ''){
            url += `?electionType=${filter.electionType}`;
        }
        setFilter({...filter, [type]: id});
        let query = pickBy(filter);
        if(Object.keys(query).length) { dispatch({type: 'FILTER_RESULTS'});
         apiRequest(`${url}`, 'get')
            .then((res) => {
                dispatch({type: 'FILTER_RESULTS_SUCCESS', payload: {response: res}});
                setCurrentResults(res.results.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'FILTER_RESULTS_FAILURE', payload: {error: err}});
               showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    const onPageChanged = data => {
        const allResults = resultState.results;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const results = allResults?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentResults(results);
    }

    const getAllResults = () => {
        dispatch({type: 'GET_RESULTS'});
         apiRequest(`${allResults}/${filter.state}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_RESULTS_SUCCESS', payload: {response: res}});
                setCurrentResults(res.results.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_RESULTS_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const getSenatorialDistricts = () => {
        apiRequest(`${getSenatorialDistrictsByStateId}/${filter.state}`, 'get')
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

    const getZones = () => {
        apiRequest(`${getGeoPoliticalZones}`, 'get')
            .then(res => {
                setZones([...res.geoPoliticalZoneList]);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getStates = () => {
        apiRequest(`${allStates}/zone/${filter.zone}`, 'get')
            .then(res => {
                setStates([...res.states]);
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

    const clearFilter = () => {
        setFilter({senatorialDistrict: '', lga: '', ward: '', 'polling-unit': '', electionType:''});
        setSearch("");
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
        getElectionTypes();
        getZones();
    }, []);

    useEffect(() => {
        if(filter["polling-unit"]){
            filterData(filter['polling-unit'], 'polling-unit');
        }
    }, [filter['polling-unit']])

    useEffect(() => {
        if(filter.ward){
            getPollingUnits(filter.ward);
        }
    }, [filter.ward])

    useEffect(() => {
        if(filter.lga){
            getWards(filter.lga);
        }
    }, [filter.lga])

    useEffect(() => {
        if(filter.senatorialDistrict){
            getLgas(filter.senatorialDistrict);
        }
    }, [filter.senatorialDistrict])

    const viewResults = () => {
        if(filter["polling-unit"]){
            filterData(filter['polling-unit'], 'polling-unit');
        }
        else if(filter.ward){
            filterData(filter.ward, 'ward');
        }
        else if(filter.lga){
            filterData(filter.lga, 'lga');
        }
        else if(filter.senatorialDistrict){
            filterData(filter.senatorialDistrict, 'senatorialDistrict');
        }
        else if(filter.state){
            filterData(filter.state, 'state');
        }else if(filter.zone){
            filterData(filter.zone, 'zone');
        }else{
            alert("Kindly select an option");
        }
    }
    useEffect(() => {
        if(filter.state){
            getSenatorialDistricts();
        }
    }, [filter.state])

    useEffect(() => {
        if(filter.zone){
            getStates();
        }
    }, [filter.zone])

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Results',
            pathname: match.path}]}/>
            <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <div className="lg:flex justify-between items-center px-1">
                    <div className="xl:w-7/10 lg:w-6.5/10 flex items-center px-1 w-full">
                        <select
                            name="electionType"
                            onChange={(e) => setFilter({...filter, electionType: e.target.value})}
                            value={filter.electionType}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            style={{width:"130px"}}
                        >
                            <option value=''>Election Type</option>
                            {electionTypeList.map(electionType => (<option key={electionType.id} value={electionType.id}>{electionType.name}</option>))}
                        </select>
                        {(authState.user?.userDetails?.role !== 'User')&&<><select
                            name="zone"
                            onChange={(e) => setFilter({...filter, zone: e.target.value})}
                            onBlur={(e) => setFilter({...filter, zone: e.target.value})}
                            value={filter.zone}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || resultState.states?.length <= 0}
                        >
                            <option value='' disabled>All Geopolitical Zones</option>
                            {zones.map(zone => (<option key={zone.id} value={zone.id}>{zone.name}</option>))}
                        </select>
                        <select
                            name="state"
                            onChange={(e) => setFilter({...filter, state: e.target.value})}
                            onBlur={(e) => setFilter({...filter, state: e.target.value})}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || resultState.states?.length <= 0}
                        >
                            <option value='' disabled>All States</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select></>}
                        <select
                            name="senatorialDistrict"
                            onChange={(e) => setFilter({...filter, senatorialDistrict: e.target.value})}
                            onBlur={(e) => setFilter({...filter, senatorialDistrict: e.target.value})}
                            value={filter.senatorialDistrict}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || resultState.states?.length <= 0}
                        >
                            <option value='' disabled>All Senatorial Districts</option>
                            {senatorialDistricts.map(senatorialDistrict => (<option key={senatorialDistrict.id} value={senatorialDistrict.id}>{senatorialDistrict.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => setFilter({...filter, lga: e.target.value})}
                            onBlur={(e) => setFilter({...filter, lga: e.target.value})}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || resultState.states?.length <= 0}
                        >
                            <option value='' disabled>All Lgas</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                        <select
                            name="ward"
                            onChange={(e) => setFilter({...filter, ward: e.target.value})}
                            onBlur={(e) => setFilter({...filter, ward: e.target.value})}
                            value={filter.ward}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || !filter.lga}
                        >
                            <option value='' disabled>All Wards</option>
                            {wards.map(ward => (<option key={ward.id} value={ward.id}>{`${ward.code} - ${ward.name}`}</option>))}
                        </select>
                        <select
                            name="polling-unit"
                            onChange={(e) => setFilter({...filter, 'polling-unit': e.target.value})}
                            onBlur={(e) => setFilter({...filter, 'polling-unit': e.target.value})}
                            value={filter["polling-unit"]}
                            className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-0.5"
                            disabled={resultState.loading || !filter.ward}
                        >
                            <option value='' disabled>All Polling Units</option>
                            {pollingUnits.map(pollingUnit => (<option key={pollingUnit.id} value={pollingUnit.id}>{`${pollingUnit.code} - ${pollingUnit.name}`}</option>))}
                        </select>
                        <div className="cursor-pointer bg-indigo-700 text-white py-1.5 px-3 font-bold rounded-sm mx-1" onClick={viewResults}>
                            View
                        </div>
                        <div className="cursor-pointer bg-lighterGray py-1.5 px-4 font-bold rounded-sm" style={{"color":"#772233"}} onClick={clearFilter}> clear</div>
                    </div>
                    <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                    <Link className="bg-primary py-2 px-4 text-white font-bold rounded-sm" to="/results/create">
                        Add Result
                    </Link>
                    </div>
                </div>
                <ResultList results={currentResults} loading={resultState.loading} getResults={getAllResults}/>
                {!resultState.loading && <div className="flex justify-between items-center mt-4">
                    <div className="flex">
                        <Uploader dispatch={dispatch} action="UPLOAD_RESULT" action_success="UPLOAD_RESULT_SUCCESS" action_error="UPLOAD_RESULT_FAILURE" url={uploadResult} refresh={getAllResults} logout={() => history.replace("/login")}/>
                        {resultState.response?.results?.length > 0 &&  <Downloader dispatch={dispatch} action="DOWNLOAD_RESULT_SUCCESS" headers={headers} data={resultState.response?.results || []} filename={'election_results.csv'} /> }
                    </div>
                    {resultState.results.length > 0 && <div>
                        <Pagination totalRecords={resultState.results.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default Results;

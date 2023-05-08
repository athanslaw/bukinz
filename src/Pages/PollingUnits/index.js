import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import Layout from "../../shared/Layout";
import {filterPollingUnitByName, uploadPollingUnit,
    getPollingUnit, allStates, getSenatorialDistrictsByStateId, getLgasBySenatorialDistrict, getWardsByLgaId} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import Uploader from "../../shared/components/Uploader";
import Downloader from "../../shared/components/Downloader";
import pickBy from 'lodash/pickBy'
import WardList from "./PollingUnitList";
import { PUContext } from "../../contexts/PollingUnitContext";
import Pagination from "../../shared/components/Pagination";
import { AuthContext } from "../../contexts/AuthContext";

const PollingUnits = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [puState, dispatch] = useContext(PUContext);
    const [filter, setFilter] = useState({senatorialDistrict: '', state: '', lga: '', ward:''});
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [stateId, setStateId] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [wards, setWards] = useState([]);
    const [currentPollingUnits, setCurrentPollingUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [authState] = useContext(AuthContext);

    const headers = [
        { label: 'Polling Unit', key: 'name' },
        { label: 'Ward', key: 'ward?.name' },
        { label: 'Local Government Area', key: 'lga?name' },
        { label: 'Senatorial District', key: 'senatorialDistrict?.name' },
        { label: 'State', key: 'state.name' },
        { label: 'Number', key: 'code' }
    ];

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const filterData = (id,type) => {
        const url = `${getPollingUnit}/${type}/${id}`;
        setFilter({...filter, [type]: id});
        let query = pickBy(filter);
        if(Object.keys(query).length) { dispatch({type: 'GET_POLLING_UNITS'});
         apiRequest(`${url}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_POLLING_UNITS_SUCCESS', payload: {response: res}});
                setCurrentPollingUnits(res.pollingUnits.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_POLLING_UNITS_FAILURE', payload: {error: err}});
            });
        }
    }

    const handleSearch = () => {
        dispatch({type: 'SEARCH_POLLING_UNIT_BY_NAME'});
         apiRequest(filterPollingUnitByName, 'get', {params: {name: search}})
            .then((res) => {
                dispatch({type: 'SEARCH_POLLING_UNIT_BY_NAME_SUCCESS', payload: {response: res}});
                setCurrentPollingUnits(res.pollingUnits.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'SEARCH_POLLING_UNIT_BY_NAME_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const onPageChanged = data => {
        const allPollingUnits = puState.pollingUnits;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const pollingUnits = allPollingUnits?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentPollingUnits(pollingUnits);
    }

    const getAllPollingUnits = () => {
        dispatch({type: 'GET_POLLING_UNITS'});
        const url = `${getSenatorialDistrictsByStateId}${stateId}`;
        if(stateId.length >0){
            apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_POLLING_UNITS_SUCCESS', payload: {response: res}});
                setCurrentPollingUnits(res.pollingUnits.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_POLLING_UNITS_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
        }
    }

    const clearFilter = () => {
        setFilter({senatorialDistrict: '', state: '', lga: ''});
        setSearch("");
        getAllPollingUnits();
    }

    const getStates = () => {
        apiRequest(allStates, 'get')
            .then(res => {
                let statesRes = [...res.states];
                setStates(statesRes);
                let stateId = authState.user?.userDetails?.stateId;
                setStateId(stateId);
                setFilter({...filter, 'state': stateId})
            })
            .catch(err => {
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }
    
    const getSenatorialDistricts = (stateId) => {
        if(stateId) apiRequest(`${getSenatorialDistrictsByStateId}/${stateId}`, 'get')
            .then(res => {
                let senatorialDistrictRes = [...res.senatorialDistricts];
                setDistricts(senatorialDistrictRes);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }
    
    const getDistrictLgas = (id) => {
        if(id){dispatch({type: 'GET_POLLING_UNITS'});
         apiRequest(`${getLgasBySenatorialDistrict}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_POLLING_UNITS_SUCCESS', payload: {response: res}});
                setLgas(res.lgas);
            })
            .catch((err) => {
                dispatch({type: 'GET_POLLING_UNITS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    const getWardsByLga = (id) => {
        if(id){dispatch({type: 'GET_POLLING_UNITS'});
         apiRequest(`${getWardsByLgaId}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_POLLING_UNITS_SUCCESS', payload: {response: res}});
                setWards(res.wards);
            })
            .catch((err) => {
                dispatch({type: 'GET_POLLING_UNITS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    useEffect(() => {
        getStates();
        getAllPollingUnits();
    }, []);

    useEffect(() => {
        filterData(filter.state, 'state');
        getSenatorialDistricts(filter.state);
    }, [filter.state])

    useEffect(() => {
        filterData(filter.senatorialDistrict, 'senatorial-district');
        getDistrictLgas(filter.senatorialDistrict);
    }, [filter.senatorialDistrict])

    useEffect(() => {
        filterData(filter.lga, 'lga');
        getWardsByLga(filter.lga)
    }, [filter.lga])

    useEffect(() => {
        filterData(filter.ward, 'ward');
    }, [filter.ward])


    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
            pathname: "/territories"}, {id: 2,title: 'Polling Units',
            pathname: match.path}]}/>
            <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <div className="lg:flex justify-between items-center px-1">
                    <div className="xl:w-4.5/10 lg:w-6/10 flex items-center px-1 w-full">
                        <select
                            name="state"
                            onChange={(e) => setFilter({...filter, 'state': e.target.value})}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>State</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select>
                        <select
                            name="senatorialDistrict"
                            onChange={(e) => setFilter({'state':filter.state, 'senatorialDistrict': e.target.value})}
                            value={filter.senatorialDistrict}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-4"
                        >
                            <option value=''>Senatorial District</option>
                            {districts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => setFilter({'state':filter.state, 'senatorialDistrict': filter.senatorialDistrict, 'lga': e.target.value})}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>LGA</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                        <select
                            name="ward"
                            onChange={(e) => setFilter({'state':filter.state, 'senatorialDistrict': filter.senatorialDistrict, 'lga': filter.lga, 'ward': e.target.value})}
                            value={filter.ward}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>Ward</option>
                            {wards.map(ward => (<option key={ward.id} value={ward.id}>{ward.name}</option>))}
                        </select>
                        <div className="cursor-pointer" onClick={clearFilter}>clear</div>
                    </div>
                    <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                    <Link className="bg-primary py-3.5 px-16 text-white font-bold rounded-sm" to="/territories/polling-units/create">
                        Add&nbsp;Polling&nbsp;Unit
                    </Link>
                    </div>
                </div>
                <div className="w-full flex mt-16 items-center px-1">
                    <div className="w-1/2">
                        <input className="border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search polling units by name"/>
                    </div>
                    <div className="w-1/2">
                        <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                            search
                        </button>
                    </div>
                </div>
                <WardList pollingUnits={currentPollingUnits} loading={puState.loading} getPollingUnits={getAllPollingUnits}/>
                {!puState.loading && <div className="flex justify-between items-center mt-4">
                    <div className="flex">
                        <Uploader dispatch={dispatch} action="UPLOAD_POLLING_UNIT" action_success="UPLOAD_POLLING_UNIT_SUCCESS" action_error="UPLOAD_POLLING_UNIT_FAILURE" url={uploadPollingUnit} refresh={getAllPollingUnits} logout={() => history.replace("/login")}/>
                            {puState.response?.pollingUnits?.length > 0 && <Downloader dispatch={dispatch} action="DOWNLOAD_POLLING_UNIT_SUCCESS" headers={headers} data={puState.response?.pollingUnits || []} filename={'polling_units.csv'}/>}
                    </div>
                    {puState.response?.pollingUnits?.length > 0 && <div>
                        <Pagination totalRecords={puState.response?.pollingUnits?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default PollingUnits;

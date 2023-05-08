import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import Layout from "../../shared/Layout";
import {allLgas, filterLgaByName, uploadLga, allStates, getLga, getLgasBySenatorialDistrict, getSenatorialDistrictsByStateId, getLgasByStateId} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import LgaList from "./LgaList";
import { LgaContext, LgaController } from "../../contexts/LgaContext";
import Uploader from "../../shared/components/Uploader";
import Downloader from "../../shared/components/Downloader";
import pickBy from 'lodash/pickBy'
import Pagination from "../../shared/components/Pagination";

const Lgas = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [lgaState, dispatch] = useContext(LgaContext);
    const [filter, setFilter] = useState({senatorialDistrict: '', state: ''});
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLgas, setCurrentLgas] = useState([]);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const headers = [
        { label: 'Local Government Area', key: 'lga.name' },
        { label: 'Senatorial District', key: 'senatorialDistrict.name' },
        { label: 'State', key: 'state.name' },
        { label: 'Number', key: 'code' }
    ];

    const filterData = (id,type) => {
        const url = `${getLga}/${type}`;
        setFilter({...filter, [type]: id});
        let query = pickBy(filter);
        if(Object.keys(query).length) { dispatch({type: 'GET_LGAS'});
         apiRequest(`${url}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_LGAS_SUCCESS', payload: {response: res}});
                setCurrentAgents(res.partyAgentDtoList.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_LGAS_FAILURE', payload: {error: err}});
            });
        }
    }

    const handleSearch = () => {
        dispatch({type: 'SEARCH_LGA_BY_NAME'});
         apiRequest(filterLgaByName, 'get', {params: {name: search}})
            .then((res) => {
                dispatch({type: 'SEARCH_LGA_BY_NAME_SUCCESS', payload: {response: res}});
                setCurrentLgas(res.lgas.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'SEARCH_LGA_BY_NAME_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const onPageChanged = data => {
        const allLgas = lgaState.lgas;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const lgas = allLgas?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentLgas(lgas);
    }

    const getStates = () => {
        apiRequest(allStates, 'get')
            .then(res => {
                let statesRes = [...res.states];
                setStates(statesRes);
            })
            .catch(err => {
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
    
    const getStateLgas = (id) => {
        if(id){dispatch({type: 'GET_LGAS'});
         apiRequest(`${getLgasByStateId}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_LGAS_SUCCESS', payload: {response: res}});
                setCurrentLgas(res.lgas.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_LGAS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    const getDistrictLgas = (id) => {
        if(id){dispatch({type: 'GET_LGAS'});
         apiRequest(`${getLgasBySenatorialDistrict}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_LGAS_SUCCESS', payload: {response: res}});
                setCurrentLgas(res.lgas.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_LGAS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    const getAllLgas = () => {
        dispatch({type: 'GET_LGAS'});
         apiRequest(allLgas, 'get')
            .then((res) => {
                dispatch({type: 'GET_LGAS_SUCCESS', payload: {response: res}});
                setCurrentLgas(res.lgas.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_LGAS_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
    }

    const clearFilter = () => {
        setFilter({senatorialDistrict: '', state: ''});
        setSearch("");
        getAllLgas();
    }

    useEffect(() => {
        getAllLgas();
        getStates();
    }, []);


    
    useEffect(() => {
        filterData(filter.state, 'state');
        getStateLgas(filter.state);
        getSenatorialDistricts(filter.state);
    }, [filter.state])

    useEffect(() => {
        filterData(filter.senatorialDistrict, 'senatorialDistrict');
        getDistrictLgas(filter.senatorialDistrict);
    }, [filter.senatorialDistrict])

    return (
        <LgaController>
            <Layout location={location}>
                <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'Lgas',
                pathname: match.path}]}/>
                <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                    <div className="lg:flex justify-between items-center px-1">
                        <div className="xl:w-3/10 lg:w-6/10 flex items-center px-1 w-full">
                            <select 
                                name="state" 
                                onChange={(e) => setFilter({...filter, 'state': e.target.value})}
                                value={filter.state}
                                className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mr-4"
                            >
                                <option value='' disabled>State</option>
                                {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                            </select>
                            <select 
                                name="senatorialDistrict" 
                                onChange={(e) => setFilter({...filter, 'senatorialDistrict': e.target.value})}
                                value={filter.senatorialDistrict}
                                className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value=''>Senatorial District</option>
                                {districts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                            </select>
                            <div className="cursor-pointer" onClick={clearFilter}>clear</div>
                        </div>
                        <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                        <Link className="bg-primary py-3.5 px-16 add-btn text-white font-bold rounded-sm" to="/territories/lgas/create">
                            Add Lga
                        </Link>
                        </div>
                    </div>
                    <div className="w-full flex mt-16 items-center px-1">
                        <div className="w-1/2">
                            <input className="border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search lgas by name"/>
                        </div>
                        <div className="w-1/2">
                            <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                                search
                            </button>
                        </div>
                    </div>
                    <LgaList lgas={currentLgas} loading={lgaState.loading} getLgas={getAllLgas}/>
                    {!lgaState.loading && <div className="flex justify-between items-center mt-4">
                        <div className="flex">
                            <Uploader dispatch={dispatch} action="UPLOAD_LGA" action_success="UPLOAD_LGA_SUCCESS" action_error="UPLOAD_LGA_FAILURE" url={uploadLga} refresh={getAllLgas} logout={() => history.replace("/login")}/>
                            {lgaState.response?.lgas?.length > 0 && <Downloader dispatch={dispatch} action="DOWNLOAD_LGA_SUCCESS" headers={headers} data={lgaState.response?.lgas || []} filename={'lgas.csv'} /> }
                        </div>
                        {lgaState.response?.lgas?.length > 0 && <div>
                            <Pagination totalRecords={lgaState.response?.lgas?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                        </div>}
                    </div>}
                </div>
            </Layout>
        </LgaController>
    );
}

export default Lgas;

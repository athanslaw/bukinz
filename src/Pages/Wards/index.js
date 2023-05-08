import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import Layout from "../../shared/Layout";
import {filterWardByName, uploadWard, getWard, allStates, getSenatorialDistrictsByStateId, getLgasBySenatorialDistrict} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import Uploader from "../../shared/components/Uploader";
import Downloader from "../../shared/components/Downloader";
import pickBy from 'lodash/pickBy'
import { WardContext } from "../../contexts/WardContext";
import WardList from "./WardList";
import Pagination from "../../shared/components/Pagination";
import { AuthContext } from "../../contexts/AuthContext";

const Wards = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [wardState, dispatch] = useContext(WardContext);
    const [filter, setFilter] = useState({senatorialDistrict: '', state: '', lga: ''});
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [stateId, setStateId] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [currentWards, setCurrentWards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [authState] = useContext(AuthContext);
    const headers = [
        { label: 'Ward', key: 'name' },
        { label: 'Local Government Area', key: 'lga?.name' },
        { label: 'Senatorial District', key: 'senatorialDistrict?.name' },
        { label: 'State', key: 'state.name' },
        { label: 'Number', key: 'code' }
    ];

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const filterData = (id,type) => {
        const url = `${getWard}/search?${type}=${id}`;
        setFilter({...filter, [type]: id});
        let query = pickBy(filter);
        if(Object.keys(query).length) { dispatch({type: 'GET_WARDS'});
         apiRequest(`${url}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_WARDS_SUCCESS', payload: {response: res}});
                setCurrentWards(res.wards.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_WARDS_FAILURE', payload: {error: err}});
            });
        }
    }

    const handleSearch = () => {
       dispatch({type: 'SEARCH_WARD_BY_NAME'});
         apiRequest(filterWardByName, 'get', {params: {name: search}})
            .then((res) => {
                dispatch({type: 'SEARCH_WARD_BY_NAME_SUCCESS', payload: {response: res}});
                setCurrentWards(res.wards.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'SEARCH_WARD_BY_NAME_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

     const onPageChanged = data => {
        const allWards = wardState.wards;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const wards = allWards?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentWards(wards);
    }

    const getAllWards = () => {
        dispatch({type: 'GET_WARDS'});
        const url = `${getWard}/search?stateId=${stateId}`;
        if(stateId.length >0){
            apiRequest(url, 'get')
            .then((res) => {
                dispatch({type: 'GET_WARDS_SUCCESS', payload: {response: res}});
                setCurrentWards(res.wards.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_WARDS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
        }
    }

    const clearFilter = () => {
        setFilter({senatorialDistrict: '', state: '', lga: ''});
        setSearch("");
        getAllWards();
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
        if(id){dispatch({type: 'GET_LGAS'});
         apiRequest(`${getLgasBySenatorialDistrict}/${id}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_LGAS_SUCCESS', payload: {response: res}});
                setLgas(res.lgas);
            })
            .catch((err) => {
                dispatch({type: 'GET_LGAS_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
    }

    useEffect(() => {
        getStates();
        getAllWards();
    }, []);

    useEffect(() => {
        filterData(filter.state, 'stateId');
        getSenatorialDistricts(filter.state);
    }, [filter.state])

    useEffect(() => {
        filterData(filter.senatorialDistrict, 'senatorialDistrictId');
        getDistrictLgas(filter.senatorialDistrict);
    }, [filter.senatorialDistrict])

    useEffect(() => {
        filterData(filter.lga, 'lgaWardId');
    }, [filter.lga])

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
            pathname: "/territories"}, {id: 2,title: 'Wards',
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
                            <option value='' disabled>States</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select>
                        <select
                            name="senatorialDistrict"
                            onChange={(e) => setFilter({...filter, 'senatorialDistrict': e.target.value})}
                            value={filter.senatorialDistrict}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-4"
                        >
                            <option value='' disabled>Senatorial District</option>
                            {districts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => setFilter({...filter, 'lga': e.target.value})}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>LGA</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                        </select>
                        <div className="cursor-pointer" onClick={clearFilter}>clear</div>
                    </div>
                    <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                    <Link className="bg-primary py-3.5 px-16 add-btn text-white font-bold rounded-sm" to="/territories/wards/create">
                        Add&nbsp;Ward
                    </Link>
                    </div>
                </div>
                <div className="w-full flex mt-16 items-center px-1">
                    <div className="w-1/2">
                        <input className="border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search wards by name"/>
                    </div>
                    <div className="w-1/2">
                        <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                            search
                        </button>
                    </div>
                </div>
                <WardList wards={currentWards} loading={wardState.loading} getWards={getAllWards}/>
                {!wardState.loading && <div className="flex justify-between items-center mt-4">
                    <div className="flex">
                        <Uploader dispatch={dispatch} action="UPLOAD_WARD" action_success="UPLOAD_WARD_SUCCESS" action_error="UPLOAD_WARD_FAILURE" url={uploadWard} refresh={getAllWards} logout={() => history.replace("/login")}/>
                        {wardState.response?.wards?.length > 0 &&  <Downloader dispatch={dispatch} action="DOWNLOAD_WARD_SUCCESS" headers={headers} data={wardState.response?.wards || []} filename={'wards.csv'} /> }
                    </div>
                    {wardState.response?.wards?.length > 0 && <div>
                        <Pagination totalRecords={wardState.response?.wards?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default Wards;

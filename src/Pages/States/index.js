import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { StateContext, StateController } from "../../contexts/StateContext";
import Layout from "../../shared/Layout";
import StateList from "./StateList";
import {allStates, filterStateByName, getLgasByStateId} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import Pagination from "../../shared/components/Pagination";

const States = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [state, dispatch] = useContext(StateContext);
    const [currentStates, setCurrentStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const handleSearch = () => {
        dispatch({type: 'SEARCH_STATE_BY_NAME'});
         apiRequest(filterStateByName, 'get', {params: {name: search}})
            .then((res) => {
                dispatch({type: 'SEARCH_STATE_BY_NAME_SUCCESS', payload: {response: res}});
                setCurrentStates([res.state]);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'SEARCH_STATE_BY_NAME_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const onPageChanged = data => {
        const allStates = state.states;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const states = allStates?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentStates(states);
    }

    const getAllStates = () => {
        dispatch({type: 'GET_STATES'});
         apiRequest(allStates, 'get')
            .then(async (res) => {
                    dispatch({type: 'GET_STATES_SUCCESS', payload: {response: res}});
                setCurrentStates(res.states.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_STATES_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const clearFilter = () => {
        setSearch("");
        getAllStates();
    }

    useEffect(() => {
        getAllStates();
    }, []);

    return (
        <StateController>
            <Layout location={location}>
                <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'States',
                pathname: match.path}]}/>
                <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                    <div className="lg:flex justify-between px-1 mt-16">
                        <div className="xl:w-8/10 lg:w-6/10 flex items-center px-1 w-full">
                            <div className="w-7/10">
                                <input className="border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search states by name"/>
                            </div>
                            <div className="w-3/10">
                                <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                                    search
                                </button>
                            </div>
                            <div className="cursor-pointer" onClick={clearFilter}>clear</div>
                        </div>
                        <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                            <Link className="bg-primary py-3.5 px-16 add-btn text-white font-bold rounded-sm" to="/territories/states/create">
                                Add&nbsp;State
                            </Link>
                        </div>
                    </div>
                    <StateList states={currentStates} loading={state.loading} getStates={getAllStates}/>
                    {!state.loading && <div className="flex justify-end items-center mt-4">
                            {state.response?.states?.length > 0 && <div>
                                <Pagination totalRecords={state.response?.states?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                            </div>}
                        </div>}
                </div>
            </Layout>
        </StateController>
    );
}

export default States;

import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs, Breadcrumb } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import Layout from "../../shared/Layout";
import {allParties, filterPartyByName} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { PartyContext } from "../../contexts/PartyContext";
import PartyList from "./PartyList";
import Pagination from "../../shared/components/Pagination";

const Parties = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [partyState, dispatch] = useContext(PartyContext);
    const [currentParties, setCurrentParties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const handleSearch = () => {
        dispatch({type: 'SEARCH_PARTY_BY_NAME'});
         apiRequest(filterPartyByName, 'get', {params: {name: search}})
            .then((res) => {
                dispatch({type: 'SEARCH_PARTY_BY_NAME_SUCCESS', payload: {response: res}});
                setCurrentParties(res.politicalParties.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'SEARCH_PARTY_BY_NAME_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const onPageChanged = data => {
        const allParties = partyState.parties;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const parties = allParties?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentParties(parties);
    }

    const getAllParties = () => {
        dispatch({type: 'GET_PARTIES'});
         apiRequest(allParties, 'get')
            .then((res) => {
                dispatch({type: 'GET_PARTIES_SUCCESS', payload: {response: res}});
                setCurrentParties(res.politicalParties.slice(0, 11));
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`)
            })
            .catch((err) => {
                dispatch({type: 'GET_PARTIES_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    useEffect(() => {
        getAllParties();
    }, []);

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold"/>
            <Breadcrumb data={{
                title: 'Parties',
                pathname: match.path
            }}>
                <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                    <div className="lg:flex justify-between px-1 mt-16">
                        <div className="xl:w-8/10 lg:w-6/10 flex items-center px-1 w-full">
                            <div className="w-7/10 flex items-center relative">
                                <input className="search-input border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search parties by name"/>
                                <span className="absolute right-12 cursor-pointer" onClick={getAllParties}>Clear</span>
                            </div>
                            <div className="w-3/10">
                                <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                                    search
                                </button>
                            </div>
                        </div>
                        <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                            <Link className="bg-primary py-3.5 px-16 add-btn text-white font-bold rounded-sm" to="/parties/create">
                                Add&nbsp;Party
                            </Link>
                        </div>
                    </div>
                    <PartyList parties={currentParties} loading={partyState.loading} getParties={getAllParties}/>
                        {!partyState.loading && <div className="flex justify-end items-center mt-4">
                            {partyState.response?.politicalParties?.length > 0 && <div>
                                <Pagination totalRecords={partyState.response?.politicalParties?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                            </div>}
                        </div>}
                </div>
            </Breadcrumb>
        </Layout>
    );
}

export default Parties;

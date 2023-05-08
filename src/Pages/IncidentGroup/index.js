import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { IncidentGroupContext } from "../../contexts/IncidentGroupContext";
import { StateController } from "../../contexts/StateContext";
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { incidentGroup } from "../../lib/url";
import Pagination from "../../shared/components/Pagination";
import Layout from "../../shared/Layout";
import IncidentGroupList from "./IncidentGroupList";

const IncidentGroup = ({match, location, history}) => {
    const [state, dispatch] = useContext(IncidentGroupContext);
    const [currentIncidentGroups, setCurrentIncidentGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const onPageChanged = data => {
        const allIncidentGroups = state.incidentGroups;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const incidentGroups = allIncidentGroups?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentIncidentGroups(incidentGroups);
    }

    const getAllIncidentGroups = () => {
        dispatch({type: 'GET_INCIDENT_GROUPS'});
         apiRequest(incidentGroup, 'get')
            .then(async (res) => {
                dispatch({type: 'GET_INCIDENT_GROUP_SUCCESS', payload: {response: res}});
                setCurrentIncidentGroups(res.incidentGroups.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_INCIDENT_GROUP_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const clearFilter = () => {
        setSearch("");
        getAllIncidentGroups();
    }

    useEffect(() => {
        getAllIncidentGroups();
    }, []);

    return (
        <StateController>
            <Layout location={location}>
                <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incident Group',
                pathname: "/incident-group"}, {id: 2,title: 'Incident Groups',
                pathname: match.path}]}/>
                <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <div className="lg:flex justify-between items-center px-1">
                    <div className="xl:w-4.5/10 lg:w-6/10 flex items-center px-1 w-full">
                        
                    </div>
                    <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                    <Link className="bg-primary py-2 px-4 text-white font-bold rounded-sm" to="/incident-group/create">
                        Add Incident
                    </Link>
                    </div>
                </div>
                    <IncidentGroupList incidentGroups={currentIncidentGroups} loading={state.loading} getIncidentGroups={getAllIncidentGroups}/>
                    {!state.loading && <div className="flex justify-end items-center mt-4">
                            {state.response?.incidentGroups?.length > 0 && <div>
                                <Pagination totalRecords={incidentGroups.response?.incidentGroups?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                            </div>}
                        </div>}
                </div>
            </Layout>
        </StateController>
    );
}

export default IncidentGroup;

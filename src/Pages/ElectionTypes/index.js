import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs } from "react-breadcrumbs";
import Layout from "../../shared/Layout";

import {apiRequest} from '../../lib/api.js';
import Pagination from "../../shared/components/Pagination";
import { ResultContext } from "../../contexts/ResultContext";
import { electionTypes } from "../../lib/url.js";
import ElectionTypeList from "./ElectionTypeList";

const ElectionTypes = ({match, location, history}) => {
    const [resultState, dispatch] = useContext(ResultContext);
    
    const [currentElectionTypes, setCurrentElectionTypes] = useState([]);

    const getAllElectionTypes = () => {
         apiRequest(electionTypes, 'get')
            .then((res) => {
                setCurrentElectionTypes(res.electionTypes);
            })
            .catch((err) => {
            });
    }

    useEffect(() => {
        getAllElectionTypes();
    }, []);


    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Types',
            pathname: match.path}]}/>
            <div className="my-6 shadow-container pl-2.5 lg:pr-7 pr-2.5 py-6">
                <ElectionTypeList electionTypeList={currentElectionTypes} loading={resultState.loading} getAllElectionTypes={getAllElectionTypes}/>
                {!resultState.loading && <div className="flex justify-between items-center mt-4">
                   
                    {resultState.results.length > 0 && <div>
                        <Pagination totalRecords={resultState.results.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                    </div>}
                </div>}
            </div>
        </Layout>
    );
}

export default ElectionTypes;

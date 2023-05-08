import React, { useContext, useState, useEffect } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updateResult, politicalPartiesByState} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import ResultForm from './components/ResultForm';
import ResultFormAdmin from './components/ResultFormAdmin';
import { ResultContext } from '../../contexts/ResultContext';
import { AuthContext } from '../../contexts/AuthContext';

const UpdateResult = ({match, location, history}) => {
    const {result} = location.state;
    const [authState] = useContext(AuthContext);
    const [politicalParties, setPoliticalParties] = useState({});
    let data = {
        pollingUnit: result.pollingUnit.id,
        lga: result.lga.id,
        ward: result.ward.id,
        votingLevel: result.votingLevel.id,
        senatorialDistrict: result.senatorialDistrict.id,
        partyAgent: result.partyAgent?.id,
        registeredVoters: result.registeredVotersCount,
        voidVotes: result.voidVotes,
        accreditedVoters: result.accreditedVotersCount,
        electionType: result.electionType
    }
    for(let i = 0; i < result.resultPerParties.length; ++i) {
        data[result.resultPerParties[i].politicalParty.code.toLowerCase()] = result.resultPerParties[i].voteCount;
    }
    const [resultState, dispatch] = useContext(ResultContext);
    const [currentResult, setCurrentResult] = useState(data);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_RESULT'});
        const requestBody = {
            electionType: values.electionType,
            votingLevelId: values.votingLevel,
            partyAgentId: values.partyAgent,
            lgaId: values.lga,
            wardId: values.ward,
            pollingUnitId: values.pollingUnit,
            accreditedVotersCount: values.accreditedVoters,
            registeredVotersCount: values.registeredVoters,
            voidVotes: values.voidVotes,
            senatorialDistrictId: values.senatorialDistrict,
            party_1: values.party_1,
            party_2: values.party_2,
            party_3: values.party_3,
            party_4: values.party_4,
            party_5: values.party_5,
            party_6: values.party_6
        }
         setSubmitting(true);
         apiRequest(`${updateResult}/${match.params.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_RESULT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/results");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_RESULT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    
    useEffect(()=>{
        // get party
        apiRequest(politicalPartiesByState+'/'+authState.user?.userDetails?.stateId, 'get')
           .then((res) => {
              setPoliticalParties(res.politicalParties)
           })
           .catch((err) => {
           });
      }, [])
  
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Results',
                pathname: "/results"}, {id: 2,title: 'Updates Result',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                {authState.user?.userDetails?.role === 'User' && <ResultForm formFields={currentResult} handleFormSubmit={handleUpdate} politicalParties={politicalParties} />}
                {authState.user?.userDetails?.role !== 'User' && <ResultFormAdmin formFields={currentResult} handleFormSubmit={handleUpdate} politicalParties={politicalParties} />}
            </div>
        </Layout>
    );
}

export default UpdateResult;

import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AuthContext } from '../../contexts/AuthContext';
import { ResultContext } from '../../contexts/ResultContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { createResult, politicalPartiesByState } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import ResultForm from './components/ResultForm';
import ResultFormAdmin from './components/ResultFormAdmin';

const CreateResult = ({match, location, history}) => {
    const [resultState, dispatch] = useContext(ResultContext);
    const [authState] = useContext(AuthContext);

    const [politicalParties, setPoliticalParties] = useState({});
    const handleCreate = (values, {setSubmitting}) => {
      const sumVotes = parseInt(values.pdp) + parseInt(values.apc) + parseInt(values.anpp) + parseInt(values.others)
      if(sumVotes*1 > values.accreditedVoters*1){
        showToast('error', `${values.ward} Total number of votes (${sumVotes} votes) should not be greater than accreditedVoters (${values.accreditedVoters} voters)`)
        setSubmitting(false);
        return;
      }
      const requestBody = {
          electionType: values.electionType,
          votingLevelId: values.votingLevel,
          partyAgentId: values.partyAgent || 3,
          lgaId: values.lga,
          wardId: values.ward,
          pollingUnitId: values.pollingUnit,
          accreditedVotersCount: values.accreditedVoters,
          registeredVotersCount: values.registeredVoters,
          voidVotes: values.voidVotes,
          invalidVoteCount: values.invalidVoteCount,
          senatorialDistrictId: values.senatorialDistrict,
          party_1: values.party_1,
          party_2: values.party_2,
          party_3: values.party_3,
          party_4: values.party_4,
          party_5: values.party_5,
          party_6: values.party_6
      }
      dispatch({type: 'CREATE_RESULT'});
       setSubmitting(true);
       apiRequest(createResult, 'post', {...requestBody})
        .then((res) => {
            dispatch({type: 'CREATE_RESULT_SUCCESS', payload: {response: res}});
            setSubmitting(false);
            history.push("/results");
            // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
        })
        .catch((err) => {
            dispatch({type: 'CREATE_RESULT_FAILURE', payload: {error: err}});
            setSubmitting(false);
            showToast('error', `${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        });

    }

    useEffect(()=>{
      // get party
      apiRequest(politicalPartiesByState+'/'+authState.user?.userDetails?.stateId, 'get')
         .then((res) => {
            setPoliticalParties(res.politicalParties)
             // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
         })
         .catch((err) => {
         });
    }, [])

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Results',
                pathname: "/results"}, {id: 2,title: 'Add Result',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                {authState.user?.userDetails?.role === 'User' && <ResultForm handleFormSubmit={handleCreate} politicalParties={politicalParties}/>}
                {authState.user?.userDetails?.role !== 'User' && <ResultFormAdmin handleFormSubmit={handleCreate} politicalParties={politicalParties}/>}
            </div>
        </Layout>
    );
}

export default CreateResult;

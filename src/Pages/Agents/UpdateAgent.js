import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AgentContext } from '../../contexts/AgentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { updateAgent } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import AgentForm from './components/AgentForm';

const UpdateAgent = ({match, location, history}) => {
    const {agent} = location.state;
    let data = {
        first_name: agent.firstname,
        last_name: agent.lastname,
        phoneNumber: agent.phone,
        email: agent.email,
        lga: agent.lga?.id,
        ward: agent.ward?.id,
        pollingUnit: agent.pollingUnit?.id
    }
    const [agentState, dispatch] = useContext(AgentContext);
    const [currentAgent, setCurrentAgent] = useState(data);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_AGENT'});
        const requestBody = {
            firstname:values.first_name,
            lastname: values.last_name,
            phone: values.phoneNumber,
            email: values.email || "",
            address: values.address || "",
            lgaId: values.lga,
            wardId: values.ward,
            pwd: values.pwd,
            role: values.role,
            pollingUnitId: values.pollingUnit,
            politicalPartyId: values.party || 2
        }
        
         setSubmitting(true);
         apiRequest(`${updateAgent}/${match.params.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_AGENT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/agents");
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_AGENT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Agents',
                pathname: "/agents"}, {id: 2,title: 'Update Agent',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <AgentForm formFields={currentAgent} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default UpdateAgent;

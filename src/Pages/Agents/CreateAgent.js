import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AgentContext } from '../../contexts/AgentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { createAgent } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import AgentForm from './components/AgentForm';

const CreateAgent = ({match, location, history}) => {
    const [agentState, dispatch] = useContext(AgentContext);
    const handleCreate = (values, {setSubmitting}) => {
        const requestBody = {
            firstname:values.first_name,
            pwd: values.pwd,
            lastname: values.last_name,
            phone: values.phoneNumber,
            email: values.email || "admim@gmail.com",
            address: values.address || "Lagos, Nigeria",
            lgaId: values.lga,
            wardId: values.ward,
            pollingUnitId: values.pollingUnit,
            role: values.role,
            politicalPartyId: values.party || 2
        }
        dispatch({type: 'CREATE_AGENT'});
         setSubmitting(true);
         apiRequest(createAgent, 'post', {...requestBody})
            .then((res) => {
                dispatch({type: 'CREATE_AGENT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/agents");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'CREATE_AGENT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Agents',
                pathname: "/agents"}, {id: 2,title: 'Add Agent',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <AgentForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateAgent;

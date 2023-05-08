import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { IncidentGroupContext } from '../../contexts/IncidentGroupContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api';
import { incidentGroup } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import IncidentGroupForm from './components/IncidentGroupForm';

const CreateIncidentGroup = ({match, history, location}) => {
    const [state, dispatch] = useContext(IncidentGroupContext);
    const handleCreate = async(e, values, setSubmitting) => {
        e.preventDefault();
         let formData = {
            'description': values.description,
            'year': new Date().getFullYear(),
            'code': values.code
        }
        dispatch({type: 'CREATE_INCIDENT_GROUP'});
        
        setSubmitting(true);
        apiRequest(`${incidentGroup}`, 'post', {...formData})
        .then((res) => {
            dispatch({type: 'CREATE_INCIDENT_GROUP_SUCCESS', payload: {response: res}});
            setSubmitting(false);
            history.push("/incident-group");
        })
        .catch((err) => {
            dispatch({type: 'CREATE_INCIDENT_GROUP_FAILURE', payload: {error: err}});
            setSubmitting(false);
            err?.response?.data?.status == 401 ? history.replace("/login") :
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incident Groups',
                pathname: "/incident-group"}, {id: 2,title: 'Incident Groups',
                pathname: "/incident-group/create"}, {id: 3,title: 'New Incident Group',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <IncidentGroupForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateIncidentGroup;

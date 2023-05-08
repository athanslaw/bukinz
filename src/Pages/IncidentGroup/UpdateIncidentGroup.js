import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { IncidentGroupContext } from '../../contexts/IncidentGroupContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api';
import { incidentGroup } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import IncidentGroupForm from './components/IncidentGroupForm';

const UpdateIncidentGroup = ({match, location, history}) => {
    const [state, dispatch] = useContext(IncidentGroupContext);
    const [currentIncidentGroup, setCurrentIncidentGroup] = useState(location.incidentGroup?.state);
    
    const handleUpdate = async(e, values, setSubmitting) => {
        e.preventDefault();
        let formData = {
            'description': values.description,
            'code': values.code
        }
        dispatch({type: 'UPDATE_INCIDENT_GROUP'});
        
        setSubmitting(true);
        apiRequest(`${incidentGroup}/${currentIncidentGroup.id}`, 'put', {...formData})
        .then((res) => {
            dispatch({type: 'UPDATE_INCIDENT_GROUP_SUCCESS', payload: {response: res}});
            setSubmitting(false);
            history.push("/incident-group");
        })
        .catch((err) => {
            dispatch({type: 'UPDATE_INCIDENT_GROUP_FAILURE', payload: {error: err}});
            setSubmitting(false);
            err?.response?.data?.status == 401 ? history.replace("/login") :
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        });
    }

    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incident Group',
                pathname: "/incident-group"}, {id: 2,title: 'Incident Group',
                pathname: "/incident-group/update"}, {id: 3,title: 'Update Incident Group',
                pathname: match.path}]}/>
            <div className="py-9 px-3.5">
                <IncidentGroupForm formFields={currentIncidentGroup} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default UpdateIncidentGroup;

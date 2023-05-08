import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AuthContext } from '../../contexts/AuthContext';
import { IncidentContext } from '../../contexts/IncidentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { createIncident } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import IncidentForm from './components/IncidentForm';
import IncidentFormAdmin from './components/IncidentFormAdmin';

const CreateIncident = ({match, location, history}) => {
    const [incidentState, dispatch] = useContext(IncidentContext);
    const [authState] = useContext(AuthContext);
    
    const handleCreate = (values, {setSubmitting}) => {
        const requestBody = {
            incidentLevelId: values.incidentLevel,
            incidentTypeId: values.incidentType,
            incidentStatusId: values.incidentStatus,
            weight: values.weight,
            lgaId: values.lga,
            wardId: values.ward,
            pollingUnitId: values.pollingUnit,
            reportedLocation: values.location,
            phoneNumberToContact: values.phoneNumber,
            description: values.description
        }
        dispatch({type: 'CREATE_INCIDENT'});
         setSubmitting(true);
         apiRequest(createIncident, 'post', {...requestBody})
            .then((res) => {
                dispatch({type: 'CREATE_INCIDENT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/incidents");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'CREATE_INCIDENT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incidents',
                pathname: "/incidents"}, {id: 2,title: 'Add Incident',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                {authState.user?.userDetails?.role === 'User' && <IncidentForm handleFormSubmit={handleCreate} />}
                {authState.user?.userDetails?.role !== 'User' && <IncidentFormAdmin handleFormSubmit={handleCreate} />}
            </div>
        </Layout>
    );
}

export default CreateIncident;

import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { AuthContext } from '../../contexts/AuthContext';
import { IncidentContext } from '../../contexts/IncidentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { updateIncident } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import IncidentForm from './components/IncidentForm';
import IncidentFormAdmin from './components/IncidentFormAdmin';

const UpdateIncident = ({match, location, history}) => {
    const {incident} = location.state;
    const [authState] = useContext(AuthContext);
    let data = {
        pollingUnit: incident.pollingUnit.id,
        lga: incident.lga.id,
        ward: incident.ward.id,
        incidentLevel: incident.incidentLevel.id,
        incidentType: incident.incidentType.id,
        incidentStatus: incident.incidentStatus.id,
        location: incident.reportedLocation,
        weight: incident.weight,
        phoneNumber: incident.phoneNumberToContact,
        description: incident.description,
        id: incident.id
    };
    const [incidentState, dispatch] = useContext(IncidentContext);
    const [currentIncident] = useState(data);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_INCIDENT'});
        const requestBody = {
            incidentLevelId: values.incidentLevel,
            incidentTypeId: values.incidentType,
            incidentStatusId: values.incidentStatus,
            lgaId: values.lga,
            wardId: values.ward,
            weight: values.weight,
            pollingUnitId: values.pollingUnit,
            reportedLocation: values.location,
            phoneNumberToContact: values.phoneNumber,
            description: values.description
        }
         setSubmitting(true);
         apiRequest(`${updateIncident}/${values.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_INCIDENT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/incidents");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_INCIDENT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Incidents',
                pathname: "/incidents"}, {id: 2,title: 'Update Incident',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                {authState.user?.userDetails?.role === 'User' && <IncidentForm formFields={currentIncident} handleFormSubmit={handleUpdate} />}
                {authState.user?.userDetails?.role !== 'User' && <IncidentFormAdmin formFields={currentIncident} handleFormSubmit={handleUpdate} />}
            </div>
        </Layout>
    );
}

export default UpdateIncident;

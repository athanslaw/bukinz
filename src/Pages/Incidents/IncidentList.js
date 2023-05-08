import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { IncidentContext } from '../../contexts/IncidentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { deleteIncident } from '../../lib/url';
import Ellipsis from '../../shared/components/Ellipsis';
import Loader from '../../shared/components/Loader';

const IncidentList = ({incidents, loading, getIncidents}) => {
    const [incidentState, dispatch] = useContext(IncidentContext);
    const [showModal, setShowModal] = useState(false);
    const [currentIncident, setCurrentIncident] = useState('');
    const weight = ['Not Critical', 'Not Very Critical', 'Manageable', 'Critical', 'Very Critical'];
    const customStyles = {
        overlay: {
            backgroundColor: 'transparent'
        },
        content : {
            top : '50%',
            left : '50%',
            right : 'auto',
            width : '50%',
            bottom : 'auto',
            marginRight : '-50%',
            padding: '29px 16px 40px 36px',
            transform : 'translate(-50%, -50%)'
        }
    };

    const handleDelete = () => {
        dispatch({type: 'DELETE_INCIDENT'});
         apiRequest(`${deleteIncident}/${currentIncident.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_INCIDENT_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getIncidents();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_INCIDENT_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (incident) => {
        setCurrentIncident(incident);
        openModal();
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }
    return (
        <div className="py-4 px-1 overflow-auto">
        <Modal
          isOpen={showModal}
          style={customStyles}
          onRequestClose={closeModal}
          contentLabel="Delete Modal"
        >
            <div className="flex justify-between items-center mb-12">
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentIncident?.id}?</p>
                <button onClick={closeModal} className="focus:outline-none">close</button>
            </div>

          <div className="text-center my-4">Kindly note that this action is not reversible</div>
            <div className="flex justify-between items-center">
                <button className="bg-textRed py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleDelete}>Delete</button>
                <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeModal}>Cancel</button>
            </div>
        </Modal>
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-1/12">Incident Type</div>
                        <div className="table-header-data w-1/12">Status</div>
                        <div className="table-header-data w-1/12">State</div>
                        <div className="table-header-data w-1/12">LGA</div>
                        <div className="table-header-data w-2/12">Ward</div>
                        <div className="table-header-data w-2/12">Polling Unit</div>
                        <div className="table-header-data w-1/12">Location</div>
                        <div className="table-header-data w-1/12">Description</div>
                        <div className="table-header-data w-1/12">Weight</div>
                    </div>

                </div>
                {loading ?
                    <div className="flex justify-center my-6">
                        <Loader />
                    </div> :
                    <div className="table-body">
                        {incidents.length > 0 ?
                            incidents.map((incident) => (<div key={incident.id} className="custom-table-row w-full flex">
                                <div className="table-row-data w-1/12">{incident.incidentType.name || ''}</div>
                                <div className="table-row-data w-1/12">{incident.incidentStatus.name || ''}</div>
                                <div className="table-row-data w-1/12">{incident.lga.state.name || ''}</div>
                                <div className="table-row-data w-1/12">{incident.lga.name || ''}</div>
                                <div className="table-row-data w-2/12">{incident.ward.name || ''}</div>
                                <div className="table-row-data w-2/12">{incident.pollingUnit.name || ''}</div>
                                <div className="table-row-data w-1/12">{incident.reportedLocation || ''}</div>
                                <div className="table-row-data w-1/12">{incident.description || ''}</div>
                                <div className="table-row-data w-1/12">{weight[incident.weight-1] || ''}</div>
                                <div className="table-row-data w-1/12">
                                    <span data-tip data-for={`ellipsis-incident-${incident.id}`} data-event='click'>
                                        <Ellipsis />
                                    </span>
                                    <ReactTooltip id={`ellipsis-incident-${incident.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                        <Link to={{pathname: `/incidents/${incident.id}`, state: {incident: incident}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                        <button onClick={()=>triggerDelete(incident)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                                    </ReactTooltip>
                                </div>
                            </div>))
                        : <div className="table-row-data w-full text-center my-4">There are no incidents to display</div>}
                    </div>}
            </div>
        </div>
    );
}

export default IncidentList;

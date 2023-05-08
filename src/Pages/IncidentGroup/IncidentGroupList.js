import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { IncidentGroupContext } from '../../contexts/IncidentGroupContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { incidentGroup } from '../../lib/url.js';
import Ellipsis from '../../shared/components/Ellipsis';
import Loader from '../../shared/components/Loader';

const IncidentGroupList = ({incidentGroups, loading, getIncidentGroups}) => {
    const [state, dispatch] = useContext(IncidentGroupContext);
    const [showModal, setShowModal] = useState(false);
    const [showDefault, setShowDefault] = useState(false);
    const [currentIncidentGroup, setCurrentIncidentGroup] = useState(null);
    const [defaultState, setDefaultState] = useState(null);
    
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

    const handleDefaultIncidentGroup = (state) => {
        setDefaultState(state);
        dispatch({type: 'SET_DEFAULT_INCIDENT_GROUP'});
         apiRequest(`${incidentGroup}/activate/${defaultState.id}`, 'put')
            .then((res) => {
                dispatch({type: 'SET_DEFAULT_INCIDENT_GROUP_SUCCESS', payload: {response: res}});
                setShowDefault(false);
                getIncidentGroups();
            })
            .catch((err) => {
                dispatch({type: 'SET_DEFAULT_INCIDENT_GROUP_FAILURE', payload: {error: err}});
                setShowDefault(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const handleDelete = () => {
        dispatch({type: 'DELETE_STATE'});
         apiRequest(`${incidentGroup}/delete/${currentIncidentGroup.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_INCIDENT_GROUP_SUCCESS', payload: {response: res}});
                setShowModal(false);
                getIncidentGroups();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_STATE_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (state) => {
        setCurrentIncidentGroup(state);
        openModal();
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const triggerSetDefault = (state) => {
        setDefaultState(state);
        openDefault();
    }

    const openDefault = () => {
        setShowDefault(true);
    }

    const closeDefault = () => {
        setShowDefault(false);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentIncidentGroup?.description}?</p>
                <button onClick={closeModal} className="focus:outline-none">close</button>
            </div>
          
          <div className="text-center my-4">Kindly note that this action is not reversible</div>
            <div className="flex justify-between items-center">
                <button className="bg-textRed py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleDelete}>Delete</button>
                <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeModal}>Cancel</button>
            </div>
        </Modal>
        <Modal
          isOpen={showDefault}
          style={customStyles}
          onRequestClose={closeDefault}
          contentLabel="Set Default Modal"
        >
            <div className="flex justify-between items-center mb-12">
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to make {defaultState?.name} the default incident group?</p>
                <button onClick={closeDefault} className="focus:outline-none">close</button>
            </div>
            <div className="flex justify-between items-center">
                <button className="bg-primary py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleDefaultIncidentGroup}>Confirm</button>
                <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeDefault}>Cancel</button>
            </div>
        </Modal>
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-1/10">Code</div>
                        <div className="table-header-data w-5/10">Description</div>
                        <div className="table-header-data w-2/10">Default Group</div>
                        <div className="table-header-data w-2/10"></div>
                    </div>
                    
                </div>
                {loading ? 
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                <div className="table-body">
                    {incidentGroups.length > 0 ? incidentGroups.map((state) => (<div key={state.id} className="custom-table-row w-full flex">
                        <div className="table-row-data w-1/10">{state.code}</div>
                        <div className="table-row-data w-5/10">{state.description}</div>
                        <div className="table-row-data w-2/10">
                            <input type="radio" id={`stateRadio_${state.id}`}
                                name={`defaultIncidentGroup_${state.id}`} value={state.status} checked={state.status} onChange={() => triggerSetDefault(state)} />
                        </div>
                        <div className="table-row-data w-2/10"> 
                            <span data-tip data-for={`ellipsis-state-${state.id}`} data-event='click'>
                                <Ellipsis />
                            </span>
                            <ReactTooltip id={`ellipsis-state-${state.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                {!state.status && <button onClick={()=>triggerSetDefault(state)} className="text-sm text-textRed block text-left focus:outline-none">Activate</button>}
                                <Link to={{pathname: `/incident-group/${state.id}`, incidentGroup: {state: state}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                <button onClick={()=>triggerDelete(state)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                            </ReactTooltip>
                        </div>
                    </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no incident groups to display</div>
                    }
                </div>}
            </div>
        </div>
    );
}

export default IncidentGroupList;

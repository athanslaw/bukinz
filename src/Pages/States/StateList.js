import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import {deleteState, changeDefaultState, getDefaultState} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { StateContext } from '../../contexts/StateContext';
import Loader from '../../shared/components/Loader';
import env from '../../config/env.config';
import Map from '../../shared/assets/map.svg';
import { AuthContext } from '../../contexts/AuthContext';

const StateList = ({states, loading, getStates}) => {
    const [state, dispatch] = useContext(StateContext);
    const [showModal, setShowModal] = useState(false);
    const [showDefault, setShowDefault] = useState(false);
    const [currentState, setCurrentState] = useState(null);
    const [defaultState, setDefaultState] = useState(null);
    
    const [authState, dispatchAuth] = useContext(AuthContext);

    const baseUrl = env().baseUrl;
    const version = env().version;
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

    const updateDefaultState =()=>{
        apiRequest(getDefaultState, 'get')
            .then(res => {
                const resp = authState.user;
                
                resp.userDetails.defaultState = res.state.name.toLowerCase().split(" ")[0];
                
                dispatch({ type: 'LOGIN_SUCCESS', payload: { response: resp } });
            })
            .catch(err => {
                return "kano";
            })
    }

    const handleDefaultState = (state) => {
        setDefaultState(state);
        dispatch({type: 'SET_DEFAULT_STATE'});
         apiRequest(`${changeDefaultState}/${defaultState.id}`, 'get')
            .then((res) => {
                dispatch({type: 'SET_DEFAULT_STATE_SUCCESS', payload: {response: res}});
                setShowDefault(false);
                getStates();
                //update AuthContext
                updateDefaultState();
            })
            .catch((err) => {
                dispatch({type: 'SET_DEFAULT_STATE_FAILURE', payload: {error: err}});
                setShowDefault(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const handleDelete = () => {
        dispatch({type: 'DELETE_STATE'});
         apiRequest(`${deleteState}/${currentState.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_STATE_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getStates();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_STATE_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (state) => {
        setCurrentState(state);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentState?.name}?</p>
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to make {defaultState?.name} the default state?</p>
                <button onClick={closeDefault} className="focus:outline-none">close</button>
            </div>
            <div className="flex justify-between items-center">
                <button className="bg-primary py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleDefaultState}>Confirm</button>
                <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeDefault}>Cancel</button>
            </div>
        </Modal>
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-4/10">Name</div>
                        <div className="table-header-data w-2/10">GeoPolitical Zone</div>
                        <div className="table-header-data w-2/10">Default State</div>
                        <div className="table-header-data w-2/10"></div>
                    </div>
                    
                </div>
                {loading ? 
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                <div className="table-body">
                    {states.length > 0 ? states.map((state) => (<div key={state.id} className="custom-table-row w-full flex">
                        <div className="table-row-data w-4/10">{state.name}</div>
                        <div className="table-row-data w-2/10">
                            {state.geoPoliticalZone?.name || "-"}
                        </div>
                        <div className="table-row-data w-2/10">
                            <input type="radio" id={`stateRadio_${state.id}`}
                                name={`defaultState_${state.id}`} value={state.defaultState} checked={state.defaultState} onChange={() => triggerSetDefault(state)} />
                        </div>
                        <div className="table-row-data w-2/10"> 
                            <span data-tip data-for={`ellipsis-state-${state.id}`} data-event='click'>
                                <Ellipsis />
                            </span>
                            <ReactTooltip id={`ellipsis-state-${state.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                <Link to={{pathname: `/territories/states/${state.id}`, state: {state: state}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                <button onClick={()=>triggerDelete(state)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                            </ReactTooltip>
                        </div>
                    </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no states to display</div>
                    }
                </div>}
            </div>
        </div>
    );
}

export default StateList;

import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { AgentContext } from '../../contexts/AgentContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { deleteAgent } from '../../lib/url';
import Phone from '../../shared/assets/phone.svg';
import Ellipsis from '../../shared/components/Ellipsis';
import Loader from '../../shared/components/Loader';

const AgentList = ({agents, loading, getAgents, history}) => {
    const [agentState, dispatch] = useContext(AgentContext);
    const [showModal, setShowModal] = useState(false);
    const [currentAgent, setCurrentAgent] = useState('');
    const [modalTitle, setModalTitle] = useState('Delete Modal');
    const [modalContent, setModalContent] = useState('');
    const [action, setAction] = useState('');
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

    const cleanPhone = phone =>{
        return 234+phone.slice(-10);
    }
    const handleDelete = () => {
        if(action === "Delete"){
            dispatch({type: 'DELETE_AGENT'});
            apiRequest(`${deleteAgent}/${currentAgent.id}`, 'delete')
                .then((res) => {
                    dispatch({type: 'DELETE_AGENT_SUCCESS', payload: {response: res}});
                    setShowModal(false);
                    // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                    getAgents();
                })
                .catch((err) => {
                    dispatch({type: 'DELETE_AGENT_FAILURE', payload: {error: err}});
                    setShowModal(false);
                    err.response.data.status == 401 ? history.replace("/login") :
                    showToast('error', `${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
                });
        }else{
            // trigger call
            hangUp();
        }
    }

    const makeCall = (phone)=>{
        var params = {
            To: phone
        };
        Twilio.Device.connect(params);
    }
    const hangUp=()=>{
        Twilio.Device.disconnectAll();
        closeModal();
    }

    const triggerDelete = (agent) => {
        setCurrentAgent(agent);
        setModalTitle("Delete Modal");
        setAction("Delete");
        setModalContent(`Are you sure you want to delete this agent? Kindly note that this action is not reversible`);
        openModal();
    }

    const initiateCall = (agent) => {
        makeCall(cleanPhone(agent.phone));
        setCurrentAgent(agent);
        //https://twilio.xsslogistics.com?phone=${cleanPhone(agent.phone)}&name=${agent.firstname || ''}%20${agent.lastname || ''}`} target="blank">{agent.phone || ''}<img src={Phone} className="ml-1 inline"/>
        setModalTitle("Initiate Call");
        setAction("END");
        setModalContent(`Calling ${agent.firstname} ${agent.lastname}. Click END to terminate`);
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
          contentLabel={modalTitle}
        >
            <div className="flex justify-between items-center mb-12">
                <p className="text-darkerGray font-bold text-lg">{modalTitle}</p>
                <button onClick={closeModal} className="focus:outline-none">close</button>
            </div>

          <div className="text-center my-4">{modalContent}</div>
            <div className="flex justify-between items-center">
                { action==='END' && <span className="py-4 px-16"></span>}
                <button className="bg-textRed py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleDelete}>{action}</button>
                { action!=='END' && <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeModal}>Cancel</button>}
            </div>
        </Modal>
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-2/12">First Name</div>
                        <div className="table-header-data w-2/12">Last Name</div>
                        <div className="table-header-data w-2/12">LGA</div>
                        <div className="table-header-data w-1/12">Ward</div>
                        <div className="table-header-data w-2/12">Polling Unit</div>
                        <div className="table-header-data w-1/12">Phone Number</div>
                        <div className="table-header-data w-1/12">Role</div>
                        <div className="table-header-data w-1/12"></div>
                    </div>

                </div>
                {loading ?
                    <div className="flex justify-center my-6">
                        <Loader />
                    </div> :
                    <div className="table-body">
                        {agents?.length > 0 ?
                            agents.map((agent) => (<div key={agent.id} className="custom-table-row w-full flex">
                                <div className="table-row-data w-2/12">{agent.firstname || ''}</div>
                                <div className="table-row-data w-2/12">{agent.lastname || ''}</div>
                                <div className="table-row-data w-2/12">{agent.lgaName || ''}</div>
                                <div className="table-row-data w-1/12">{`${agent.wardId} - ${agent.wardName}`}</div>
                                <div className="table-row-data w-2/12">{`${agent.pollingUnitId} - ${agent.pollingUnitName}`}</div>
                                <div className="table-row-data w-1/12"><span id="phone-number"></span>
                                <div id="log"></div>
                                    {agent.phone}
                                    <button id="button-call" onClick={()=>initiateCall(agent)} className="text-sm text-textRed text-left focus:outline-none"><img src={Phone} className="ml-1 inline"/></button>
                                </div>
                                <div className="table-row-data w-1/12">{agent.role || ''}</div>
                                <div className="table-row-data w-1/12">
                                    <span data-tip data-for={`ellipsis-agent-${agent.id}`} data-event='click'>
                                        <Ellipsis />
                                    </span>
                                    <ReactTooltip id={`ellipsis-agent-${agent.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                        <Link to={{pathname: `/agents/${agent.id}`, state: {agent: agent}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                        <button onClick={()=>triggerDelete(agent)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                                    </ReactTooltip>
                                </div>
                            </div>))
                        : <div className="table-row-data w-full text-center my-4">There are no Agents to display</div>}
                    </div>}
            </div>
        </div>
    );
}

export default AgentList;

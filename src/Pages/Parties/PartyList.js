import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import {deleteParty} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { PartyContext } from '../../contexts/PartyContext';
import Loader from '../../shared/components/Loader';

const PartyList = ({parties, loading, getParties}) => {
    const [partyState, dispatch] = useContext(PartyContext);
    const [showModal, setShowModal] = useState(false);
    const [currentParty, setCurrentParty] = useState(null);
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
        dispatch({type: 'DELETE_PARTY'});
         apiRequest(`${deleteParty}/${currentParty.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_PARTY_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getParties();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_PARTY_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (party) => {
        setCurrentParty(party);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentParty?.name}?</p>
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
                        <div className="table-header-data w-3/10">Name</div>
                        <div className="table-header-data w-2/10">Code</div>
                        <div className="table-header-data w-2/10">Colour Code</div>
                        <div className="table-header-data w-3/10"></div>
                    </div>

                </div>

                {loading ?
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                <div className="table-body">
                    {parties.length > 0 ?  parties.map((party) => (<div key={party.id} className="custom-table-row w-full flex">
                        <div className="table-row-data w-3/10">{party.name}</div>
                        <div className="table-row-data w-2/10">{party.code}</div>
                        <div style={{backgroundColor:party.colorCode, color:'#cccccc', textAlign:'center'}} className="table-row-data w-2/10">{party.colorCode}</div>
                        <div className="table-row-data w-3/10">
                            <span data-tip data-for={`ellipsis-party-${party.id}`} data-event='click'>
                                <Ellipsis />
                            </span>
                            <ReactTooltip id={`ellipsis-party-${party.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                <Link to={{pathname: `/parties/${party.id}`, state: {party: party}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                <button onClick={()=>triggerDelete(party)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                            </ReactTooltip>
                        </div>
                    </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no parties to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default PartyList;

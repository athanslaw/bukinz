import React, { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import Loader from '../../shared/components/Loader';
import { electionTypes } from '../../lib/url';
import { apiRequest } from '../../lib/api';
import { showToast } from '../../helpers/showToast';

const ElectionTypeList = ({electionTypeList, loading, getAllElectionTypes, history}) => {
    const [showModal, setShowModal] = useState(false);
    const [currentElectionType, setCurrentElectionType] = useState('');
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

    const handleSwitch = () => {
        
         apiRequest(`${electionTypes}/${currentElectionType.id}`, 'put')
            .then(() => {
                setShowModal(false);
                getAllElectionTypes();
            })
            .catch((err) => {
                setShowModal(false);
                err.response.data.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerSwitch = (electionType) => {
        setCurrentElectionType(electionType);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to {currentElectionType.status==1?'Deactivate':'Activate'} {currentElectionType?.name} election type?</p>
                <button onClick={closeModal} className="focus:outline-none">close</button>
            </div>

          <div className="text-center my-4">Kindly note that this action is not reversible</div>
            <div className="flex justify-between items-center">
                <button className="bg-textRed py-4 px-16 text-white font-bold rounded-sm focus:outline-none" onClick={handleSwitch}>Continue</button>
                <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={closeModal}>Cancel</button>
            </div>
        </Modal>
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-3/6">Election Types</div>
                        <div className="table-header-data w-2/6">Status</div>
                        <div className="table-header-data w-1/6"></div>
                    </div>

                </div>
                {loading ?
                    <div className="flex justify-center my-6">
                        <Loader />
                    </div> :
                    <div className="table-body">
                        {electionTypeList?.length > 0 ?
                            electionTypeList.map((electionType) => (<div key={electionType.id} className="custom-table-row w-full flex">
                                <div className="table-row-data w-3/6">{electionType.name}</div>
                                <div className="table-row-data w-2/6">{electionType.status==1?'Active':'Inactive'}</div>
                                
                                <div className="table-row-data w-1/6">
                                    <span data-tip data-for={`ellipsis-result-${electionType.id}`} data-event='click'>
                                        <Ellipsis />
                                    </span>
                                    <ReactTooltip id={`ellipsis-result-${electionType.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                        <button onClick={()=>triggerSwitch(electionType)} className="text-sm text-textRed block text-left focus:outline-none">{electionType.status==1?'Deactivate':'Activate'}</button>
                                    </ReactTooltip>
                                </div>
                            </div>))
                        : <div className="table-row-data w-full text-center my-4">There are no Election Types to display</div>}
                    </div>}
            </div>
        </div>
    );
}

export default ElectionTypeList;

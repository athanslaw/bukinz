import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import {deleteLga} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { LgaContext } from '../../contexts/LgaContext';
import Loader from '../../shared/components/Loader';

const LgaList = ({lgas, loading, getLgas}) => {
    const [lgaState, dispatch] = useContext(LgaContext);
    const [showModal, setShowModal] = useState(false);
    const [currentLga, setCurrentLga] = useState('');
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
        dispatch({type: 'DELETE_LGA'});
         apiRequest(`${deleteLga}/${currentLga.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_LGA_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getLgas();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_LGA_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (lga) => {
        setCurrentLga(lga);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentLga?.name}?</p>
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
                        <div className="table-header-data w-2/10">LGA</div>
                        <div className="table-header-data w-2/10">Senatorial District</div>
                        <div className="table-header-data w-2/10">State</div>
                        <div className="table-header-data w-2/10">Code</div>
                        <div className="table-header-data w-2/10"></div>
                    </div>
                    
                </div>
                {loading ? 
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                    <div className="table-body">
                    {lgas.length > 0 ? 
                        lgas.map((lga) => (<div key={lga.id} className="custom-table-row w-full flex">
                            <div className="table-row-data w-2/10">{lga.name || ''}</div>
                            <div className="table-row-data w-2/10">{lga.senatorialDistrict.name || ''}</div>
                            <div className="table-row-data w-2/10">{lga.state.name || ''}</div>
                            <div className="table-row-data w-2/10">{lga.code || ''}</div>
                            <div className="table-row-data w-2/10"> 
                                <span data-tip data-for={`ellipsis-lga-${lga.id}`} data-event='click'>
                                    <Ellipsis />
                                </span>
                                <ReactTooltip id={`ellipsis-lga-${lga.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                    <Link to={{pathname: `/territories/lgas/${lga.id}`, state: {lga: lga}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                    <button onClick={()=>triggerDelete(lga)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                                </ReactTooltip>
                            </div>
                        </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no LGAs to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default LgaList;

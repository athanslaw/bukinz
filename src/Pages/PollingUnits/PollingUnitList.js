import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import {deletePollingUnit} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { PUContext } from '../../contexts/PollingUnitContext';
import Loader from '../../shared/components/Loader';
import { cleanStateCode } from '../../helpers/utils';

const PollingUnitList = ({pollingUnits, loading, getPollingUnits}) => {
    const [puState, dispatch] = useContext(PUContext);
    const [showModal, setShowModal] = useState(false);
    const [currentPollingUnit, setCurrentPollingUnit] = useState('');
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
        dispatch({type: 'DELETE_POLLING_UNIT'});
         apiRequest(`${deletePollingUnit}/${currentPollingUnit.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_POLLING_UNIT_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getPollingUnits();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_POLLING_UNIT_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (pollingUnit) => {
        setCurrentPollingUnit(pollingUnit);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentPollingUnit?.name}?</p>
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
                        <div className="table-header-data w-2/10">Polling Unit</div>
                        <div className="table-header-data w-1/10">Ward</div>
                        <div className="table-header-data w-1/10">LGA</div>
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
                    {pollingUnits.length > 0 ? 
                        pollingUnits.map((pu) => (<div key={pu.id} className="custom-table-row w-full flex">
                            <div className="table-row-data w-2/10">{pu.name || ''}</div>
                            <div className="table-row-data w-1/10">{pu.ward?.name || ''}</div>
                            <div className="table-row-data w-1/10">{pu.lga?.name || ''}</div>
                            <div className="table-row-data w-2/10">{pu.senatorialDistrict?.name || ''}</div>
                            <div className="table-row-data w-2/10">{pu.state?.name || ''}</div>
                            <div className="table-row-data w-2/10">{`${cleanStateCode(pu.state?.id)}-${pu.lga?.code}-${pu.ward?.code}-${pu.code}`}</div>
                            <div className="table-row-data w-2/10"> 
                                <span data-tip data-for={`ellipsis-pu-${pu.id}`} data-event='click'>
                                    <Ellipsis />
                                </span>
                                <ReactTooltip id={`ellipsis-pu-${pu.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                    <Link to={{pathname: `/territories/polling-units/${pu.id}`, state: {pollingUnit: pu}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                    <button onClick={()=>triggerDelete(pu)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                                </ReactTooltip>
                            </div>
                        </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no polling units to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default PollingUnitList;

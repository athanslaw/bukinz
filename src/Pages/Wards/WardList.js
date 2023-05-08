import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import Ellipsis from '../../shared/components/Ellipsis';
import {deleteWard} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { WardContext } from '../../contexts/WardContext';
import Loader from '../../shared/components/Loader';
import { cleanStateCode } from '../../helpers/utils';

const WardList = ({wards, loading, getWards, history}) => {
    const [wardState, dispatch] = useContext(WardContext);
    const [showModal, setShowModal] = useState(false);
    const [currentWard, setCurrentWard] = useState('');
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
        dispatch({type: 'DELETE_WARD'});
         apiRequest(`${deleteWard}/${currentWard.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_WARD_SUCCESS', payload: {response: res}});
                setShowModal(false);
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
                getWards();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_WARD_FAILURE', payload: {error: err}});
                setShowModal(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (ward) => {
        setCurrentWard(ward);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentWard?.name}?</p>
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
                        <div className="table-header-data w-2/10">WARD</div>
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
                    {wards.length > 0 ? 
                        wards.map((ward) => (<div key={ward.id} className="custom-table-row w-full flex">
                            <div className="table-row-data w-2/10">{ward.name || ''}</div>
                            <div className="table-row-data w-2/10">{ward.lga?.name || ''}</div>
                            <div className="table-row-data w-2/10">{ward.senatorialDistrict?.name || ''}</div>
                            <div className="table-row-data w-2/10">{ward.state?.name || ''}</div>
                            <div className="table-row-data w-2/10">{`${cleanStateCode(ward.state?.id)}-${ward.lga?.code}-${ward.code}`}</div>
                            <div className="table-row-data w-2/10"> 
                                <span data-tip data-for={`ellipsis-lga-${ward.id}`} data-event='click'>
                                    <Ellipsis />
                                </span>
                                <ReactTooltip id={`ellipsis-lga-${ward.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                    <Link to={{pathname: `/territories/wards/${ward.id}`, state: {ward: ward}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                    <button onClick={()=>triggerDelete(ward)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                                </ReactTooltip>
                            </div>
                        </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no wards to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default WardList;

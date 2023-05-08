import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { EventContext } from '../../contexts/EventContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { event } from '../../lib/url.js';
import Ellipsis from '../../shared/components/Ellipsis';
import Loader from '../../shared/components/Loader';

const EventList = ({events, loading, getEvents}) => {
    const [eventState, dispatch] = useContext(EventContext);
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
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
        dispatch({type: 'DELETE_EVENT'});
         apiRequest(`${event}/delete/${currentEvent.id}`, 'delete')
            .then((res) => {
                dispatch({type: 'DELETE_EVENT_SUCCESS', payload: {response: res}});
                setShowModal(false);
                getEvents();
            })
            .catch((err) => {
                dispatch({type: 'DELETE_EVENT_FAILURE', payload: {error: err}});
                setShowModal(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const triggerDelete = (event) => {
        setCurrentEvent(event);
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
                <p className="text-darkerGray font-bold text-lg">Are you sure you want to delete {currentEvent?.name}?</p>
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
                        <div className="table-header-data w-1/10">Code</div>
                        <div className="table-header-data w-5/10">Description</div>
                        <div className="table-header-data w-1/10">Status</div>
                        <div className="table-header-data w-3/10"></div>
                    </div>

                </div>

                {loading ?
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                <div className="table-body">
                    {events?.length > 0 ?  events.map((eventItem) => (<div key={eventItem.id} className="custom-table-row w-full flex">
                        <div className="table-row-data w-1/10">{eventItem.code}</div>
                        <div className="table-row-data w-5/10">{eventItem.description}</div>
                        <div className="table-row-data w-1/10">{eventItem.status?"Active": "Inactive"}</div>
                        <div className="table-row-data w-3/10">
                            
                            
                            <span data-tip data-for={`ellipsis-event-${eventItem.id}`} data-event='click'>
                                <Ellipsis />
                            </span>
                            <ReactTooltip id={`ellipsis-event-${eventItem.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                                <Link to={{pathname: `/event/${eventItem.id}`, state: {event: eventItem}}} className="text-sm text-darkerGray block text-left">Edit</Link>
                                <button onClick={()=>triggerDelete(eventItem)} className="text-sm text-textRed block text-left focus:outline-none">Delete</button>
                            </ReactTooltip>
                        </div>
                    </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no events to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default EventList;

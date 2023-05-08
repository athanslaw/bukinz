import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { EventContext } from '../../contexts/EventContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { event } from '../../lib/url.js';
import Loader from '../../shared/components/Loader';

const EventRecordList = ({eventRecords, events, loading, getEvents}) => {
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

    const getEventById = (id) => {
        const e = events.filter((event)=>event.id === id)
        return e[0];
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
                        <div className="table-header-data w-3/10">Events</div>
                        <div className="table-header-data w-2/10">PU</div>
                        <div className="table-header-data w-2/10">Ward</div>
                        <div className="table-header-data w-1/10">Agent</div>
                        <div className="table-header-data w-1/10">Status</div>
                        <div className="table-header-data w-1/10"></div>
                    </div>

                </div>

                {loading ?
                <div className="flex justify-center my-6">
                        <Loader />
                    </div>:
                <div className="table-body">
                    {eventRecords?.length > 0 ?  eventRecords.map((eventItem) => (<div key={eventItem.id} className="custom-table-row w-full flex">
                        <div className="table-row-data w-3/10">{getEventById(eventItem.eventId)?.description}</div>
                        <div className="table-row-data w-2/10">{eventItem.pollingUnitName}</div>
                        <div className="table-row-data w-2/10">{eventItem.wardName}</div>
                        <div className="table-row-data w-1/10">{eventItem.agentId}</div>
                        <div className="table-row-data w-1/10">{eventItem.eventStatus?"Yes": "No"}</div>
                        <div className="table-row-data w-1/10"></div>
                    </div>))
                    : <div className="table-row-data w-full text-center my-4">There are no records to display</div>}
                </div>}
            </div>
        </div>
    );
}

export default EventRecordList;

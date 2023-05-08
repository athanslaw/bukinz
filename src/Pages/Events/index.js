import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Breadcrumbs } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { EventContext } from "../../contexts/EventContext";
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { event } from '../../lib/url.js';
import Pagination from "../../shared/components/Pagination";
import Layout from "../../shared/Layout";
import EventList from "./EventList";

const Events = ({match, location, history}) => {
    const [eventState, dispatch] = useContext(EventContext);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);


    const onPageChanged = data => {
        const allEvents = eventState.events;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const events = allEvents?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentEvents(events);
    }

    const getAllEvents = () => {
        dispatch({type: 'GET_PARTIES'});
         apiRequest(event, 'get')
            .then((res) => {
                dispatch({type: 'GET_PARTIES_SUCCESS', payload: {response: res}});
                setCurrentEvents(res.events.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_PARTIES_FAILURE', payload: {error: err}});
                err.response.data.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    return (
        <Layout location={location}>
            <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold"/>
            <Breadcrumb data={{
                title: 'Manage Event',
                pathname: match.path
            }}>
                <div className="shadow-container pl-2.5 lg:pr-7 pr-2.5 py-1">
                    <div className="lg:flex justify-between px-1 mt-16">
                        <div className="xl:w-8/10 lg:w-6/10 flex items-center px-1 w-full">
                        </div>
                        <div className="xl:w-2/10 lg:w-3/10 flex items-center lg:justify-end px-1 w-full lg:mt-0 mt-4">
                            <Link className="bg-primary py-3.5 px-16 add-btn text-white font-bold rounded-sm" to="/event/create">
                                Add&nbsp;Event
                            </Link>
                        </div>
                    </div>
                    <EventList events={currentEvents} loading={eventState.loading} getEvents={getAllEvents}/>
                        {!eventState.loading && <div className="flex justify-end items-center mt-4">
                            {eventState.response?.events?.length > 0 && <div>
                                <Pagination totalRecords={eventState.response?.events?.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                            </div>}
                        </div>}
                </div>
            </Breadcrumb>
        </Layout>
    );
}

export default Events;

import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { EventContext } from '../../contexts/EventContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { event } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import EventForm from './components/Eventform';

const UpdateEvent = ({match, location, history}) => {
    const [eventState, dispatch] = useContext(EventContext);
    const [eventItem, setEvent] = useState(location.state?.event);
    const handleUpdate = (values, {setSubmitting}) => {
        values.status=values.status=='Deactivate'?false:true;
        dispatch({type: 'UPDATE_EVENT'});
         setSubmitting(true);
         apiRequest(`${event}/${eventItem.id}`, 'put', {...values})
            .then((res) => {
                dispatch({type: 'UPDATE_EVENT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/event");
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_EVENT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Event',
                pathname: "/event"}, {id: 2,title: 'Update Event',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <EventForm formFields={eventItem} handleFormSubmit={handleUpdate} readOnly="true"/>
            </div>
        </Layout>
    );
}

export default UpdateEvent;

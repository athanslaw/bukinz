import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { UserContext } from '../../contexts/UserContext';
import { showToast } from '../../helpers/showToast';
import { apiRequest } from '../../lib/api.js';
import { event } from '../../lib/url.js';
import Layout from '../../shared/Layout';
import EventForm from './components/Eventform';

const CreateEvent = ({match, history, location}) => {
    const [userState, dispatch] = useContext(UserContext);
    const handleCreate = (values, {setSubmitting}) => {
        dispatch({type: 'CREATE_PARTY'});
         setSubmitting(true);
         values['name'] = "";
         values.status=values.status=='Deactivate'?false:true;
         apiRequest(event, 'post', {...values})
            .then((res) => {
                dispatch({type: 'CREATE_PARTY_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/event");
            })
            .catch((err) => {
                dispatch({type: 'CREATE_PARTY_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Event',
                pathname: "/event"}, {id: 2,title: 'Add Event',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <EventForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateEvent;

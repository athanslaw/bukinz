import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updateParty} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { PartyContext } from '../../contexts/PartyContext';
import PartyForm from './components/Partyform';

const UpdateParty = ({match, location, history}) => {
    const [partyState, dispatch] = useContext(PartyContext);
    const [party, setParty] = useState(location.state?.party);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_PARTY'});
         setSubmitting(true);
         apiRequest(`${updateParty}/${party.id}`, 'put', {...values})
            .then((res) => {
                dispatch({type: 'UPDATE_PARTY_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/parties");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);;
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_PARTY_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Parties',
                pathname: "/parties"}, {id: 2,title: 'Update Party',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <PartyForm formFields={party} handleFormSubmit={handleUpdate} readOnly="true"/>
            </div>
        </Layout>
    );
}

export default UpdateParty;

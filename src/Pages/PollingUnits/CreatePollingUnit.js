import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {createPollingUnit} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { PUContext } from '../../contexts/PollingUnitContext';
import PollingUnitForm from './components/PollingUnitForm';

const CreatePollingUnit = ({match, history, location}) => {
    const [puState, dispatch] = useContext(PUContext);
    const handleCreate = (values, {setSubmitting}) => {
        dispatch({type: 'CREATE_POLLING_UNIT'});
        const requestBody = {
            code: values.number,
            name: values.name,
            stateId: values.state,
            senatorialDistrictId: values.senatorialDistrict,
            lgaId: values.lga,
            wardId: values.ward
        };
         setSubmitting(true);
         apiRequest(createPollingUnit, 'post', {...requestBody})
            .then((res) => {
                dispatch({type: 'CREATE_POLLING_UNIT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/polling-units");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'CREATE_POLLING_UNIT_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'Polling Units',
                pathname: "/territories/polling-units"}, {id: 3,title: 'Add Polling Unit',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <PollingUnitForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreatePollingUnit;

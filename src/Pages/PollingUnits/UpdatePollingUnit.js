import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updatePollingUnit} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import PollingUnitForm from './components/PollingUnitForm';
import { PUContext } from '../../contexts/PollingUnitContext';

const UpdatePollingUnit = ({match, location, history}) => {
    const {pollingUnit} = location.state;
    let data = {
        state: pollingUnit.state.id,
        senatorialDistrict: pollingUnit.senatorialDistrict.id,
        name: pollingUnit.name,
        number: pollingUnit.code,
        lga: pollingUnit.lga.id,
        ward: pollingUnit.ward.id
    }
    const [puState, dispatch] = useContext(PUContext);
    const [currentPollingUnit, setCurrentPollingUnit] = useState(data);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_POLLING_UNIT'});
        const requestBody = {
            code: values.number,
            name: values.name,
            stateId: values.state,
            senatorialDistrictId: values.senatorialDistrict,
            lgaId: values.lga,
            wardId: values.ward
        };
         setSubmitting(true);
         apiRequest(`${updatePollingUnit}/${match.params.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_POLLING_UNIT_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/polling-units");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_POLLING_UNIT_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
                setSubmitting(false);
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'Polling Units',
                pathname: "/territories/polling-units"}, {id: 3,title: 'Update Polling Unit',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <PollingUnitForm formFields={currentPollingUnit} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default UpdatePollingUnit;

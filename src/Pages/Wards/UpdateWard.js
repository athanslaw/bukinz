import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updateWard} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { WardContext } from '../../contexts/WardContext';
import WardForm from './components/WardForm';

const UpdateWard = ({match, location, history}) => {
    const {ward} = location.state;
    let data = {
        state: ward.state.id,
        senatorialDistrict: ward.senatorialDistrict.id,
        name: ward.name,
        number: ward.code,
        lga: ward.lga.id
    }
    const [wardState, dispatch] = useContext(WardContext);
    const [currentWard, setCurrentWard] = useState(data);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_WARD'});
        const requestBody = {
            code: values.number,
            name: values.name,
            stateId: values.state,
            senatorialDistrictId: values.senatorialDistrict,
            lgaId: values.lga
        };
         setSubmitting(true);
         apiRequest(`${updateWard}/${match.params.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_WARD_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/wards");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_WARD_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'Wards',
                pathname: "/territories/wards"}, {id: 3,title: 'Update Ward',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <WardForm formFields={currentWard} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default UpdateWard;

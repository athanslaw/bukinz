import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updateLga} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import LgaForm from './components/LgaForm';
import { LgaContext } from '../../contexts/LgaContext';
import Loader from '../../shared/components/Loader';

const UpdateLga = ({match, location, history}) => {
    const {lga} = location.state;
    const data = {
        state: lga.state.id,
        senatorialDistrict: lga.senatorialDistrict.id,
        name: lga.name,
        number: lga.code
    }
    const [lgaState, dispatch] = useContext(LgaContext);
    const [loading, setLoading] = useState(false);
    const [currentLga, setCurrentLga] = useState(data)
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_LGA'});
        const requestBody = {
            code: values.number,
            name: values.name,
            stateId: values.state,
            senatorialDistrictId: values.senatorialDistrict
        };
         setSubmitting(true);
         apiRequest(`${updateLga}/${match.params.id}`, 'put', {...requestBody})
            .then((res) => {
                dispatch({type: 'UPDATE_LGA_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/lgas");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_LGA_FAILURE', payload: {error: err}});
                setSubmitting(false);
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'LGAs',
                pathname: "/territories/lgas"}, {id: 3,title: 'Update LGA',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                {loading ? 
                <Loader />
                :
                    <LgaForm formFields={currentLga} handleFormSubmit={handleUpdate}/>}
            </div>
        </Layout>
    );
}

export default UpdateLga;

import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {createWard} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import WardForm from './components/WardForm';
import { WardContext } from '../../contexts/WardContext';

const CreateWard = ({match, history, location}) => {
    const [wardState, dispatch] = useContext(WardContext);
    const handleCreate = (values, {setSubmitting}) => {
        dispatch({type: 'CREATE_WARD'});
        const requestBody = {
            code: values.number,
            name: values.name,
            stateId: values.state,
            senatorialDistrictId: values.senatorialDistrict,
            lgaId: values.lga
        };
         setSubmitting(true);
         apiRequest(createWard, 'post', {...requestBody})
            .then((res) => {
                dispatch({type: 'CREATE_WARD_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/wards");
                // showToast('success', `${res.statusCode}: ${res.statusMessage}`);
            })
            .catch((err) => {
                dispatch({type: 'CREATE_WARD_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'Wards',
                pathname: "/territories/wards"}, {id: 3,title: 'Add Ward',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <WardForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateWard;

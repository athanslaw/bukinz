import React, { useContext, useEffect, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {updateState, getStateById} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { StateContext } from '../../contexts/StateContext';
import StateForm from './components/Stateform';
import axios from 'axios';

const UpdateState = ({match, location, history}) => {
    let token = localStorage.getItem('access_token');
    const [state, dispatch] = useContext(StateContext);
    const [currentState, setCurrentState] = useState(location.state?.state);

    const handleUpdate = async(e, values, setSubmitting) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('code', values.name);
        formData.append('geoPoliticalZone', values.geoPoliticalZone);
        formData.append('file', values.map)
        dispatch({type: 'UPDATE_STATE'});
         setSubmitting(true);
         await axios({
             method: 'put',
             url: `${updateState}/${currentState.id}`,
             data: formData,
             headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
             }
         })
            .then((res) => {
                dispatch({type: 'UPDATE_STATE_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/states");
                // showToast('success', `${res.statusCode || 'Success'}: ${res.statusMessage || 'State updated successfully'}`);
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_STATE_FAILURE', payload: {error: err}});
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
                setSubmitting(false);
            });
    }

    const getState = () => {
        dispatch({type: 'GET_STATE_BY_ID'});
         apiRequest(`${getStateById}/${match.params.id}`, 'get')
            .then((res) => {
                setCurrentState(res.state);
                dispatch({type: 'GET_STATE_BY_ID_SUCCESS', payload: {response: res}});
            })
            .catch((err) => {
                dispatch({type: 'GET_STATE_BY_ID_FAILURE', payload: {error: err}});
                showToast('error', 'Something went wrong. Please try again later')
            });
    }

    useEffect(() => {
        getState();
    }, [])

    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'States',
                pathname: "/territories/states"}, {id: 3,title: 'Update State',
                pathname: match.path}]}/>
            <div className="py-9 px-3.5">
                <StateForm formFields={currentState} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default UpdateState;

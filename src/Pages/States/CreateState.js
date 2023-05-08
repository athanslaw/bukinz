import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import {createState} from '../../lib/url.js';
import { showToast } from '../../helpers/showToast';
import { StateContext } from '../../contexts/StateContext';
import StateForm from './components/Stateform';
import axios from 'axios';

const CreateState = ({match, history, location}) => {
    const [state, dispatch] = useContext(StateContext);
    let token = localStorage.getItem('access_token');
    const handleCreate = async(e, values, setSubmitting) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('code', values.name);
        formData.append('geoPoliticalZone', values.geoPoliticalZone);
        formData.append('file', values.map)
        dispatch({type: 'CREATE_STATE'});
         setSubmitting(true);
         await axios({
             method: 'post',
             url: createState,
             data: formData,
             headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
             }
         })
            .then((res) => {
                dispatch({type: 'CREATE_STATE_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/territories/states");
                // showToast('success', `${res.statusCode || 'Success'}: ${res.statusMessage || 'State created successfully'}`);
            })
            .catch((err) => {
                dispatch({type: 'CREATE_STATE_FAILURE', payload: {error: err}});
                setSubmitting(false);
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Election Territories',
                pathname: "/territories"}, {id: 2,title: 'States',
                pathname: "/territories/states"}, {id: 3,title: 'New State',
                pathname: match.path}]}/>
            <div className="py-9 xl:px-3.5 px-1">
                <StateForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateState;

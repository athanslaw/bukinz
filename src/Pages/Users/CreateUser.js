import React, { useContext } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import { UserContext, UserController } from '../../contexts/UserContext';
import Layout from '../../shared/Layout';
import UserForm from './components/Userform';
import {register} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';

const CreateUser = ({match, location, history}) => {
    const [userState, dispatch] = useContext(UserContext);
    const handleCreate = (values, {setSubmitting}) => {
        const requestBody = {
            phone: values.phone || '08067413041',
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            password: values.password,
            role: values.role,
            lgaId: values.lgaId
        };
        dispatch({type: 'CREATE_USER'});
         setSubmitting(true);
         apiRequest(register, 'post', {...requestBody})
            .then((res) => {
                setSubmitting(false);
                dispatch({type: 'CREATE_USER_SUCCESS', payload: {response: res}});
                history.push("/users");
            })
            .catch((err) => {
                dispatch({type: 'CREATE_USER_FAILURE', payload: {error: err}});
                showToast('error', err.response?.data?.statusMessage || 'Something went wrong. Please try again later')
                setSubmitting(false);
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Users',
                pathname: "/users"}, {id: 2,title: 'Add User',
                pathname: match.path}]}/>
            <div className="py-9 px-3.5">
                <UserForm handleFormSubmit={handleCreate}/>
            </div>
        </Layout>
    );
}

export default CreateUser;

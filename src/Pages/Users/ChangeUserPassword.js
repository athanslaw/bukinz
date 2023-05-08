import React, { useContext, useState } from 'react';
import { Breadcrumbs } from 'react-breadcrumbs';
import Layout from '../../shared/Layout';
import ChangePasswordForm from './components/ChangePasswordForm';
import {users} from '../../lib/url.js';
import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { UserContext } from '../../contexts/UserContext';

const ChangeUserPassword = ({match, location, history}) => {

//const user={}
  const [user, setUser] = useState(location.state?.user);

    const [userState, dispatch] = useContext(UserContext);
    const handleUpdate = (values, {setSubmitting}) => {
        dispatch({type: 'UPDATE_USER'});
         setSubmitting(true);
         apiRequest(`${users}/password`, 'put', {...values})
            .then((res) => {
                dispatch({type: 'UPDATE_USER_SUCCESS', payload: {response: res}});
                setSubmitting(false);
                history.push("/users");
            })
            .catch((err) => {
                dispatch({type: 'UPDATE_USER_FAILURE', payload: {error: err}});
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', 'Something went wrong. Please try again later')
                setSubmitting(false);
            });
    }
    return (
        <Layout location={location}>
            <Breadcrumbs className="w-full lg:px-3.5 px-1 pt-7 pb-5 text-2xl font-bold" setCrumbs={() => [{id: 1,title: 'Users',
                pathname: "/users"}, {id: 2,title: 'Update',
                pathname: match.path}]}/>
            <div className="py-9 px-3.5">
                <ChangePasswordForm formFields={user} handleFormSubmit={handleUpdate}/>
            </div>
        </Layout>
    );
}

export default ChangeUserPassword;

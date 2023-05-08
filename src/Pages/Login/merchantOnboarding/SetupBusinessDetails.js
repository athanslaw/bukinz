import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { AuthContext } from '../../../contexts/AuthContext';
import { login } from '../../../lib/url.js';
import { apiRequest, logout } from '../../../lib/api.js';
import { showToast } from '../../../helpers/showToast';
import Loader from '../../../shared/components/Loader';
import SideBar from '../../../shared/components/SideBar';
import Select from '../../../shared/components/select';
import ActivityTracker from '../../../shared/components/ActivityTracker';
import Cities from '../../../shared/fixtures/cities.json'

const SetupBusinessDetails = ({ history, location }) => {
    const pathname = location?.state?.from.pathname;
    const [authState, dispatch] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [fieldValues, setFieldValues] = useState({city:"", services:""});

    const step = 1;

    useEffect(() => {
        logout();
    }, []);

    const onSelectField = (name, value) =>{
        setFieldValues({...fieldValues, [name]:value});
        if(!value) return false;
        return true;
    }

    const onChangeField = ({target}) =>{
        const value = target.value;
        setFieldValues({...fieldValues, [target.name]:value});
        
        if(!target.value) return false;
        return true;
    }

    const handleLogin = (values, { setSubmitting }) => {
        dispatch({ type: 'LOGIN' });
        setSubmitting(true);
        setLoading(true)
        apiRequest(login, 'post', { ...values })
            .then((res) => {
                localStorage.setItem('access_token', res.token);
                dispatch({ type: 'LOGIN_SUCCESS', payload: { response: res } });
                setSubmitting(false);
                setLoading(false);
                history.push(pathname || "dashboard/home");
            })
            .catch((err) => {
                dispatch({ type: 'LOGIN_FAILURE', payload: { error: err } });
                logout().then(() => {
                    showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
                });
                setSubmitting(false);
                setLoading(false);
            });
    }
    return (
        <div className="login-screen h-screen lg:flex justify-center items-center px-4 py-1">
            <SideBar />
            <div className='lg:w-5/10 text-center'>
            {loading ?
                <Loader />
                : <div className="xl:w-7/10 lg:w-9/12 relative">

                    <div className="shadow-sm p-8 md:p-16 bg-white rounded-lg justify-center">
                        <Formik
                            initialValues={{ username: '', password: '' }}
                            validate={values => {
                                const errors = {};
                                if (!values.username) {
                                    errors.username = 'Username is required';
                                } else if (!values.password) {
                                    errors.password = 'Password is required';
                                } else if (
                                    values.username.length < 3
                                ) {
                                    errors.username = 'Invalid username';
                                }
                                return errors;
                            }}
                            onSubmit={handleLogin}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div>
                                        <div className="mb-4">
                                            <div style={{display:"flex"}}>
                                                <div className="font-bold md:text-1xl text-left mb-3" style={{flex:1}}>Set-up your business details</div>
                                                <div className="md:text-1xl">1 of 3</div>
                                            </div>
                                            <ActivityTracker activityStep={step} />
                                        </div>
                                        <div className='text-left mb-6'>Tell us about your business</div>
                                        

                                        <div className="mt-4 mb-3 px-1" style={{textAlign:'left'}}>
                                        Business Name:<br/>
                                        <input
                                            type="text"
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            className="w-full border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="What is your business name?"
                                        />
                                        {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                    </div>
                                        <div className="mt-4 mb-3 px-1" style={{textAlign:'left'}}>
                                        Business Address:<br/>
                                        <input
                                            type="text"
                                            name="username"
                                            onChange={(event) =>onChangeField(event)}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            className="w-full border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="What is your business address?"
                                        />
                                        {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                    </div>
                                    
                                    <div className="mt-4 mb-3 lg:flex" style={{textAlign:'left'}}>
                                    <div className="mt-4 mb-12">
                                    
                                </div>
                                
                                <div className='lg:w-5/10 px-1'>City:<br/>


                                <Select
                                    options={Cities}
                                    onChange={(event) =>
                                    onSelectField("city", event.target.value)
                                    }
                                    placeholder="Select or Enter your city"
                                    defaultValue={fieldValues.city}
                                />


                                    {errors.incidentLevel && touched.incidentLevel && <span className="text-xs text-red-600">{errors.incidentLevel}</span>}
                                        </div>
                                        <div className='lg:w-5/10 px-1'>Postcode:<br/>
                                            <input
                                                type="text"
                                                name="username"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.username}
                                                className="w-full border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                                placeholder="Enter your post code"
                                            />
                                            {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                        </div>
                                        
                                    </div>
                                    
                                    <div className="mt-4 mb-9 px-1" style={{textAlign:'left'}}>
                                        What service do you provide?:<br/>
                                        <Select
                                            options={Cities}
                                            onChange={(event) =>
                                            onSelectField("services", event.target.value)
                                            }
                                            placeholder="Select or enter what your business does"
                                            defaultValue={fieldValues.services}
                                        />
                                        {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                    </div>

                                    </div>
                                    <button type="submit" disabled={isSubmitting || errors.password?.length > 0 || errors.username?.length > 0} className="w-full bg-primary m-auto py-3 sm:py-3 text-white font-bold rounded-l focus:outline-none">
                                        Next
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </div>

                </div>
            }</div>
        </div>
    );
}


export default SetupBusinessDetails;

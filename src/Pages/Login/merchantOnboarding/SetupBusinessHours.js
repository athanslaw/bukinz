import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../lib/url.js';
import { apiRequest, logout } from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import Loader from '../../shared/components/Loader';
import SideBar from '../../shared/components/SideBar';
import Select from '../../shared/components/select';
import ActivityTracker from '../../shared/components/ActivityTracker';
import Cities from '../../shared/fixtures/cities.json'

const SetupBusinessHours = ({ history, location }) => {
    const pathname = location?.state?.from.pathname;
    const [authState, dispatch] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [fieldValues, setFieldValues] = useState({ time_close: "", time_open: "", period_type:"", });

    const step = 2;

    useEffect(() => {
        logout();
    }, []);

    const onSelectField = (name, value) => {
        setFieldValues({ ...fieldValues, [name]: value });
        if (!value) return false;
        return true;
    }

    const onChangeField = ({ target }) => {
        const value = target.value;
        setFieldValues({ ...fieldValues, [target.name]: value });

        if (!target.value) return false;
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
                                                <div style={{ display: "flex" }}>
                                                    <div className="font-bold md:text-1xl text-left mb-3" style={{ flex: 1 }}>Set-up your business hours</div>
                                                    <div className="md:text-1xl">2 of 3</div>
                                                </div>
                                                <ActivityTracker activityStep={step} />
                                            </div>
                                            <div className='text-left mb-9'>Tell us about how your business operates</div>

                                            <div className='px-1 text-left'>What are your service hours:</div>
                                            <div className="mt-4 mb-9 flex" style={{ textAlign: 'left' }}>


                                                <div className='w-5/10 px-1'>
                                                    <Select
                                                        options={Cities}
                                                        onChange={(event) =>
                                                            onSelectField("time_open", event.target.value)
                                                        }
                                                        placeholder="Select opening time"
                                                        defaultValue={fieldValues.time_open}
                                                    />
                                                    {errors.incidentLevel && touched.incidentLevel && <span className="text-xs text-red-600">{errors.incidentLevel}</span>}
                                                </div>
                                                <div className='w-5/10 px-1'>
                                                <Select
                                                        options={Cities}
                                                        onChange={(event) =>
                                                            onSelectField("time_close", event.target.value)
                                                        }
                                                        placeholder="Select closing time"
                                                        defaultValue={fieldValues.time_close}
                                                    />
                                                    {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                                </div>

                                            </div>

                                            <div className='px-1 text-left'>Cancellation Period:</div>
                                            <div className="mt-4 mb-12 flex" style={{ textAlign: 'left' }}>
                                                <div className='w-5/10 px-1'>
                                                    <input
                                                        type="text"
                                                        name="cancellation_period"
                                                        onChange={(e)=>{onChangeField(e)}}
                                                        value={fieldValues.cancellation_period}
                                                        placeholder="Enter a number"
                                                        className="w-full border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                                    />
                                                    {errors.incidentLevel && touched.incidentLevel && <span className="text-xs text-red-600">{errors.incidentLevel}</span>}
                                                </div>
                                                <div className='w-5/10 px-1'>
                                                <Select
                                                        options={Cities}
                                                        onChange={(event) =>
                                                            onSelectField("period_type", event.target.value)
                                                        }
                                                        placeholder="Select period type"
                                                        defaultValue={fieldValues.period_type}
                                                    />
                                                    {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                                </div>

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


export default SetupBusinessHours;

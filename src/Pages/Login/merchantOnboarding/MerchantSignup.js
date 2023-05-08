import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { AuthContext } from '../../../contexts/AuthContext';
import { login } from '../../../lib/url.js';
import { apiRequest, logout } from '../../../lib/api.js';
import { showToast } from '../../../helpers/showToast';
import { ReactComponent as BarChart } from '../../../shared/assets/bar-chart.svg';
import Loader from '../../../shared/components/Loader';
import SideBar from '../../../shared/components/SideBar';

const MerchantSignup = ({ history, location }) => {
    const pathname = location?.state?.from.pathname;
    const [authState, dispatch] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        logout();
    }, []);

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
        <div className="login-screen lg:flex h-screen justify-center items-center px-4 py-2">
            <SideBar />
            <div className='lg:w-5/10 text-center'>
            {loading ?
                <Loader />
                : <div className="xl:w-7/10 lg:w-9/12 relative">
                <span className="absolute -left-48 -top-24"><BarChart /></span>

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
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div style={{textAlign:'left'}}>
                                    <div className="font-bold md:text-2xl">Start managing your customer, time & money better</div>
                                        <input type="text"
                                            readOnly /></div>
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
                                    <div className="mt-4 mb-3 lg:flex" style={{textAlign:'left'}}>
                                        <div className='lg:w-5/10 px-1'>Email:<br/>
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
                                        <div className='lg:w-5/10 px-1'>Phone Number:<br/>
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
                                    </div>
                                    <div className="mt-4 mb-3" style={{textAlign:'left'}}>
                                        Password:<br/>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            className="w-full border p-2 focus:outline-none bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="Create a password"
                                        />
                                        {errors.password && touched.password && <span className="text-xs text-red-600">{errors.password}</span>}
                                    </div>
                                    <div className="mt-4 mb-12" style={{textAlign:'left'}}>
                                        Confirm Password:<br/>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            className="w-full border p-2 focus:outline-none bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="Retype your password"
                                        />
                                        {errors.password && touched.password && <span className="text-xs text-red-600">{errors.password}</span>}
                                    </div>
                                    <button type="submit" disabled={isSubmitting || errors.password?.length > 0 || errors.username?.length > 0} className="w-full bg-primary m-auto py-3 sm:py-3 text-white font-bold rounded-l focus:outline-none">
                                        Sign Up
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


export default MerchantSignup;

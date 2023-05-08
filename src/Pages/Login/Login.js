import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../lib/url.js';
import { apiRequest, logout } from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import { ReactComponent as BarChart } from '../../shared/assets/bar-chart.svg';
import Loader from '../../shared/components/Loader';
import SideBar from '../../shared/components/SideBar';
import { Link } from 'react-router-dom';

const Login = ({ history, location }) => {
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
        
        console.log("here")
        apiRequest(login, 'post', { ...values })
            .then((res) => {
                console.log("here 1 athans")
                history.push("/merchant-signup");
                /*
                localStorage.setItem('access_token', res.token);
                
                console.log("here 2 athans")
                dispatch({ type: 'LOGIN_SUCCESS', payload: { response: res } });
                setSubmitting(false);
                setLoading(false);
                console.log("here athans")
                history.push("/merchant-signup");*/
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
            <span className="absolute -left-48 -top-14 w-12"><BarChart /></span>
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
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div style={{textAlign:'left'}}>
                                        <div className="font-bold md:text-2xl">Welcome Back</div>
                                        Enter your details below to continue
                                        <input type="text"
                                            className="mb-3"
                                            readOnly /></div>
                                    <div className="mt-4 mb-3" style={{textAlign:'left'}}>
                                        Email:<br/>
                                        <input
                                            type="text"
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            className="w-full border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="Enter your business email"
                                        />
                                        {errors.username && touched.username && <span className="text-xs text-red-600">{errors.username}</span>}
                                    </div>
                                    <div className="mt-4 mb-12" style={{textAlign:'left'}}>
                                        Password:<br/>
                                        <input
                                            type="password"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            className="w-full border p-2 focus:outline-none bg-transparent placeholder-lightGray font-medium text-sm"
                                            placeholder="Enter your password"
                                        />
                                        {errors.password && touched.password && <span className="text-xs text-red-600">{errors.password}</span>}
                                    </div>
                                    <button type="submit" disabled={isSubmitting || errors.password?.length > 0 || errors.username?.length > 0} className="w-full bg-primary m-auto py-3 sm:py-3 text-white font-bold rounded-l focus:outline-none">
                                        Continue
                                    </button>
                                    
                                    <span className="w-full m-auto py-2 sm:py-2 text-primary"><Link to="/login/merchant-signup">Contact </Link>Don't have an account yet? <strong><a href="login/merchant-signup">Signup</a></strong></span>
                                </form>
                            )}
                        </Formik>
                    </div>

                </div>
            }</div>
        </div>
    );
}


export default Login;

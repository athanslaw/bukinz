import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { AuthContext } from '../../../contexts/AuthContext';
import { login } from '../../../lib/url.js';
import { apiRequest, logout } from '../../../lib/api.js';
import { showToast } from '../../../helpers/showToast';
import Loader from '../../../shared/components/Loader';
import SideBar from '../../../shared/components/SideBar';

const SignupOtp = ({ history, location }) => {
    const pathname = location?.state?.from.pathname;
    const [authState, dispatch] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [otpFields, setOtpFields] = useState({value1:"", value2:"", value3:"", value4:"", value5:"", value6:""});


    useEffect(() => {
        logout();
    }, []);

    const onChangeField = ({target}) =>{
        let value = target.value;
        value = value > 9? value % 10: value
        setOtpFields({...otpFields, [target.name]:value});
        if(!target.value) return false;
        return true;
    }

    const onFocus = (name) =>{
        console.log("Got here")
        if(otpFields[name] != "")
        setOtpFields({...otpFields, [name]:""});
        console.log(name)
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
                            initialValues={{ value1: '', value2: '' }}
                            validate={values => {
                                const errors = {};
                                if (!values.value1) {
                                    errors.value1 = 'Value 1 is required';
                                } else if (!values.value2) {
                                    errors.value2 = 'value2 is required';
                                } 
                                return errors;
                            }}
                            onSubmit={handleLogin}
                        >
                            {({
                                values,
                                errors,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div>
                                        <div className="font-bold md:text-2xl mb-6 text-left">Verify Identity</div>
                                        <div className='mb-6 text-left'>An OTP was sent to your mobile number, kindly enter the 6 digit code below and continue</div>
                                    </div>
                                    
                                    <div className="mt-4 mb-12 text-left">
                                        <input
                                            type="number"
                                            name="value1"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("value2").focus()}}
                                            value={otpFields.value1}
                                            autoFocus
                                            className="no-spin w-10 text-center border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />&nbsp;&nbsp;
                                        <input
                                            type="number"
                                            name="value2"
                                            id="value2"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("value3").focus()}}
                                            value={otpFields.value2}
                                            className="no-spin w-10 text-center border p-2 px-4 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />&nbsp;&nbsp;
                                        <input
                                            type="number"
                                            name="value3"
                                            id="value3"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("value4").focus()}}
                                            value={otpFields.value3}
                                            className="no-spin w-10 text-center border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />&nbsp;&nbsp;
                                        <input
                                            type="number"
                                            name="value4"
                                            id="value4"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("value5").focus()}}
                                            value={otpFields.value4}
                                            className="no-spin w-10 text-center border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />&nbsp;&nbsp;
                                        <input
                                            type="number"
                                            name="value5"
                                            id="value5"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("value6").focus()}}
                                            value={otpFields.value5}
                                            className="no-spin w-10 text-center border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />&nbsp;&nbsp;
                                        <input
                                            type="number"
                                            name="value6"
                                            id="value6"
                                            onChange={(e)=>{onChangeField(e) && document.getElementById("signup").focus()}}
                                            value={otpFields.value6}
                                            className="no-spin w-10 text-center border p-2 bg-transparent placeholder-lightGray font-medium text-sm"
                                        />
                                    </div>
                                    
                                    <button type="submit" id="signup" disabled={isSubmitting || errors.value1?.length > 0} className="w-full bg-primary m-auto py-3 sm:py-3 text-white font-bold rounded-l focus:outline-none">
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


export default SignupOtp;

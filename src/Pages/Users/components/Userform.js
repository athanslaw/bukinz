import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { showToast } from "../../../helpers/showToast";
import { apiRequest } from "../../../lib/api";
import { getLgasByStateId } from '../../../lib/url';

const UserForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    const [lgas, setLgas] = useState();
    const roles = [{id: 3, label: 'Executive'}, {id: 4, label: 'National Executive'}, {id: 1, label: 'Administrator'}, {id: 2, label: 'User'}];
    let initialValues = {
        firstname: '',
        lastname: '',
        email: 'Email',
        password: '',
        role: '',
        lgaId:'',
        phone:''
    }

      const handleLgaChange = (event, setFieldValue) => {
          const lga =  event.currentTarget.value;
          setFieldValue("lgaId", lga);
      }


    const getLgas = () => {
        apiRequest(`${getLgasByStateId}`, 'get')
            .then(res => {
                setLgas(res.lgas);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    useEffect(()=>{
      getLgas();
    },[]);

    const validate = (values) => {
        const errors = {};
        if (!values.firstname) {
            errors.firstname = 'First Name is required';
        }   else if (!values.lastname) {
            errors.lastname = 'Last Name is required';
        }   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }  else if(!values.password) {
            errors.password = 'Password is required';
        }  else if(!values.phone) {
            errors.phone = 'Phone is required';
        }   else if(!values.role) {
            errors.role = 'Role is required';
        }   else if(!values.lgaId) {
            errors.lgaId = 'LGA is required';
        }   else {
            setFormValid(true);
        }
        return errors;
    }

    return (
        <div className="w-3/10">
            <Formik
                initialValues={formFields || initialValues}
                validate={values => validate(values)}
                onSubmit={handleFormSubmit}
                handleReset
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleReset,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="firstname"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                title="First Name"
                                value={values.firstname}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="First Name"
                            />
                            {errors.firstname && touched.firstname && <span className="text-xs text-red-600">{errors.firstname}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="lastname"
                                title="Last Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lastname}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Last Name"
                            />
                            {errors.lastname && touched.lastname && <span className="text-xs text-red-600">{errors.lastname}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="phone"
                                title="Phone Number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Phone Number"
                            />
                            {errors.phone && touched.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="email"
                                title="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Email"
                            />
                            {errors.email && touched.email && <span className="text-xs text-red-600">{errors.email}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="role"
                                onChange={handleChange}
                                title="Role"
                                onBlur={handleBlur}
                                value={values.role}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value='' disabled>Select Role</option>
                                {roles.map(role => (<option key={role.id} value={role.label}>{role.label}</option>))}
                            </select>
                            {errors.role && touched.role && <span className="text-xs text-red-600">{errors.role}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="password"
                                name="password"
                                title="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Password"
                            />
                            {errors.password && touched.password && <span className="text-xs text-red-600">{errors.password}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="lgaId"
                               onChange={(e)=>handleLgaChange(e, setFieldValue)}
                                onBlur={(e)=>handleLgaChange(e, setFieldValue)}
                                value={values.lgaId}
                                title="LGA"
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Local Government Area</option>
                                {lgas?.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                            </select>
                            {errors.lgaId && touched.lgaId && <span className="text-xs text-red-600">{errors.lgaId}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 px-16 text-white font-bold rounded-sm focus:outline-none">
                                {formFields ? 'Update' : 'Save'}
                            </button>&nbsp;
                            <button className="border border-primary py-4 px-16 text-primary font-bold rounded-sm focus:outline-none" onClick={handleReset} >
                                Reset
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default UserForm;

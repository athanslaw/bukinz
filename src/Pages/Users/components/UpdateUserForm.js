import { Formik } from "formik";
import React, { useState } from "react";

const UpdateUserForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    const roles = [
        {id: 3, label: 'Executive'}, {id: 4, label: 'National Executive'}, {id: 1, label: 'Administrator'}, {id: 2, label: 'User'}
    ];
    let initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        role: ''
    }

    const validate = (values) => {
        const errors = {};
        if (!values.firstname) {
            errors.firstname = 'First Name is required';
        }   else if (!values.lastname) {
            errors.lastname = 'Last Name is required';
        }   else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }   else if(!values.role) {
            errors.role = 'Role is required';
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
                                name="email"
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
                                onBlur={handleBlur}
                                value={values.role}
                                placeholder="Role"
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value='' disabled></option>
                                {roles.map(role => (<option key={role.id} value={role.label}>{role.label}</option>))}
                            </select>
                            {errors.role && touched.role && <span className="text-xs text-red-600">{errors.role}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 px-16 text-white font-bold rounded-sm focus:outline-none">
                                Save
                            </button>
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

export default UpdateUserForm;

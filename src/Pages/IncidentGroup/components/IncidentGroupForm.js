import { Formik } from "formik";
import React, { useEffect, useState } from "react";

const IncidentGroupForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    
    let initialValues = {
        description: '',
        code: ''
    }
    const [init, setInit] = useState(initialValues);

    const validate = (values) => {
        const errors = {};
        if (!values.description) {
            errors.description = 'Description is required';
        }   else if (!values.code) {
            errors.code = 'Code is required';
        }   else {
            setFormValid(true);
        }
        return errors;
    }

    useEffect(() => {
        setInit(formFields);
    }, []);

    return (
        <div className="lg:w-3/10 w-full">
            <Formik
                initialValues={formFields || initialValues}
                validate={values => validate(values)}
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
                    setFieldValue,
                    isSubmitting,
                    setSubmitting
                }) => (
                    <form onSubmit={(e) => handleFormSubmit(e, values, setSubmitting)} autoComplete="off">
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Code"
                            />
                            {errors.code && touched.code && <span className="text-xs text-red-600">{errors.code}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Incident Group Label"
                            />
                            {errors.description && touched.description && <span className="text-xs text-red-600">{errors.description}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4/10">
                                {formFields ? 'Update' : 'Add'} Group
                            </button>
                            <button className="border border-primary py-4 text-primary font-bold rounded-sm focus:outline-none w-4/10" onClick={handleReset} >
                                Reset
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default IncidentGroupForm;

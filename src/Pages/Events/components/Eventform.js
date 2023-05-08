import { Formik } from "formik";
import React from "react";

const EventForm = ({formFields, handleFormSubmit}) => {
    let initialValues = {
        description: '',
        code: '',
    }

    const validate = (values) => {
        const errors = {};
        if (!values.description) {
            errors.description = 'Description is required';
        }   else if (!values.code) {
            errors.code = 'Event Code is required';
        }   else if (!values.status) {
            errors.status = 'Event status is required';
        }
        return errors;
    }

    return (
        <div className="lg:w-3/10 w-full">
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
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Event Code"
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
                                placeholder="Event Title"
                            />
                            {errors.description && touched.description && <span className="text-xs text-red-600">{errors.description}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select 
                                name="status" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.status}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value>Event Status</option>
                                <option>Activate</option>
                                <option>Deactivate</option>
                            </select>
                            {errors.status && touched.status && <span className="text-xs text-red-600">{errors.status}</span>}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <button type="submit" disabled={isSubmitting || errors.code || errors.description} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4/10">
                                {formFields ? 'Update' : 'Add'}&nbsp;Event
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

export default EventForm;

import { Formik } from "formik";
import React, { useState } from "react";
import { ChromePicker } from 'react-color';

const PartyForm = ({formFields, handleFormSubmit}) => {
    let initialValues = {
        name: '',
        code: '',
        colorCode: ''
    }
    const [background, setBackground] = useState('#fff')


    function handleChangeComplete(color) {
      setBackground(color.hex);
    };

    const validate = (values) => {
        const errors = {};
        const match = /[A-Z]+/g;
        if (!values.name) {
            errors.name = 'Party Name is required';
        }   else if (!values.code) {
            errors.code = 'Party Code is required';
        }   else if (!background) {
            errors.colorCode = 'Colour Code is required';
        }
        values.colorCode = background
        // else if(!match.test(values.code)) {
        //     errors.code = 'Party Code should be uppercase';
        // }
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
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Name"
                            />
                            {errors.name && touched.name && <span className="text-xs text-red-600">{errors.name}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code}
                                readOnly={formFields ? true : false}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Party Code"
                            />
                            {errors.code && touched.code && <span className="text-xs text-red-600">{errors.code}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <ChromePicker
                              color={ background }
                              onChangeComplete={ handleChangeComplete }
                            />
                            <input
                                type="text"
                                name="colorCode"
                                onChange={handleChange}
                                value={background}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Colour Code"
                            />
                            {errors.colorCode && touched.colorCode && <span className="text-xs text-red-600">{errors.colorCode}</span>}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <button type="submit" disabled={isSubmitting || errors.code || errors.name} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4/10">
                                {formFields ? 'Update' : 'Add'}&nbsp;Party
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

export default PartyForm;

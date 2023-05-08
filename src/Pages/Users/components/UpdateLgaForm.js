import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { showToast } from "../../../helpers/showToast";
import {getLgasByStateId} from '../../../lib/url';

const UpdateLgaForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    const [lgas, setLgas] = useState();
    const roles = [{id: 1, label: 'Administrator'}, {id: 2, label: 'User'}];
    let initialValues = {
        lgaId:''
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
        if (!values.lgaId) {
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
                            <select
                                name="lgaId"
                               onChange={(e)=>handleLgaChange(e, setFieldValue)}
                                onBlur={(e)=>handleLgaChange(e, setFieldValue)}
                                value={values.lgaId}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Local Government Area</option>
                                {lgas?.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                            </select>
                            {errors.lgaId && touched.lgaId && <span className="text-xs text-red-600">{errors.lgaId}</span>}
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

export default UpdateLgaForm;

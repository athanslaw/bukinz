import { Formik } from "formik";
import React, { useState, useEffect } from "react";
// import ImageThumb from "../../../shared/components/ImageThumb";
import { getGeoPoliticalZones } from "../../../lib/url";
import { apiRequest } from "../../../lib/api";
import { showToast } from "../../../helpers/showToast";

const StateForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    
    const [geoPoliticalZoneList, setGeoPoliticalZoneList] = useState([]);
    let initialValues = {
        name: '',
        map: null,
        geoPoliticalZone: '1'
    }
    const [init, setInit] = useState(initialValues);

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Name is required';
        }   else if (!values.geoPoliticalZone) {
            errors.geoPoliticalZone = 'Geo Political Zone is required';
        }   else {
            setFormValid(true);
        }
        return errors;
    }

    const getGeoPoliticalZone = () => {
        apiRequest(getGeoPoliticalZones, 'get')
            .then(res => {
                setGeoPoliticalZoneList(res.geoPoliticalZoneList);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    useEffect(() => {
        setInit(formFields);
        getGeoPoliticalZone();
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
                            <select 
                                name="geoPoliticalZone" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.geoPoliticalZone?.id}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value=''>GeoPolitical Zone</option>
                                {geoPoliticalZoneList.map(zone => (<option key={zone.id} value={zone.id}>{zone.name}</option>))}
                            </select>
                            {errors.geoPoliticalZone && touched.geoPoliticalZone && <span className="text-xs text-red-600">{errors.geoPoliticalZone}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4/10">
                                {formFields ? 'Update' : 'Add'} State
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

export default StateForm;

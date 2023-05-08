import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { showToast } from "../../../helpers/showToast";
import { apiRequest } from "../../../lib/api";
import { getLgasByStateId, getPollingUnitsByWardId, getWardsByLgaId } from "../../../lib/url";

const AgentForm = ({formFields, handleFormSubmit}) => {
    const [formValid, setFormValid] = useState(false);
    const [wards, setWards] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);
    const roles = ["PU", "Ward", "LGA", "State"];
    let initialValues = {
        pollingUnit: '',
        lga: '',
        ward: '',
        first_name: '',
        last_name: '',
        phoneNumber: '',
        email:'',
        pwd:'',
        role:''
    }
    const [init, setInit] = useState(initialValues);

    const validate = (values) => {
        const errors = {};
        if (!values.first_name) {
            errors.first_name = 'First Name is required';
        }   else if (!values.last_name) {
            errors.last_name = 'Last Name is required';
        }   else if (!values.lga) {
            errors.lga = 'Local Government Area is required is required';
        }   else if(!values.pollingUnit) {
            errors.pollingUnit = 'Polling unit is required';
        }   else if(!values.pwd) {
            errors.pwd = 'Password is required';
        }
        // else if(!values.phoneNumber) {
        //     errors.phoneNumber = 'Phone number is required';
        // }   
        else {
            setFormValid(true);
        }
        return errors;
    }

    const getLgas = () =>{
        apiRequest(getLgasByStateId, 'get')
            .then((res) => {
                setLgas(res.lgas)
            })
            .catch((err) => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });
    }

    const getWards = (lgaId) => {
        if(lgaId) {apiRequest(`${getWardsByLgaId}/${lgaId}`, 'get')
            .then(res => {
                setWards(res.wards);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })}
    }

    const getPollingUnits = (wardId) =>{
        if(wardId){apiRequest(`${getPollingUnitsByWardId}/${wardId}`, 'get')
            .then((res) => {
                setPollingUnits(res.pollingUnits)
            })
            .catch((err) => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });}
    }

    const handleLgaChange = (event, setFieldValue) => {
        const lga =  event.currentTarget.value;
        setFieldValue("lga", lga);
        getWards(lga);
    }

    const handleWardChange = (event, setFieldValue) => {
        const ward =  event.currentTarget.value;
        setFieldValue("ward", ward);
        getPollingUnits(ward);
    }

    useEffect(() => {
        setInit(formFields);
        getLgas();
        getWards();
        getPollingUnits();
    }, []);

    useEffect(() => {
        getWards(init?.lga);
        getPollingUnits(init?.ward);
    }, [init])

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
                    setFieldValue
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mt-4 mb-12">First Name:
                            <input
                                type="text"
                                name="first_name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.first_name}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="First Name"
                            />
                            {errors.first_name && touched.first_name && <span className="text-xs text-red-600">{errors.first_name}</span>}
                        </div>
                        <div className="mt-4 mb-12">Last Name:
                            <input
                                type="text"
                                name="last_name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.last_name}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Last Name"
                            />
                            {errors.last_name && touched.last_name && <span className="text-xs text-red-600">{errors.last_name}</span>}
                        </div>
                        <div className="mt-4 mb-12">LGA:
                            <select 
                                name="lga" 
                               onChange={(e)=>handleLgaChange(e, setFieldValue)}
                                onBlur={(e)=>handleLgaChange(e, setFieldValue)}
                                value={values.lga}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Local Government Area</option>
                                {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                            </select>
                            {errors.lga && touched.lga && <span className="text-xs text-red-600">{errors.lga}</span>}
                        </div>
                        <div className="mt-4 mb-12">Ward:
                            <select 
                                name="ward" 
                                onChange={(e)=>handleWardChange(e, setFieldValue)}
                                onBlur={(e)=>handleWardChange(e, setFieldValue)}
                                value={values.ward}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Ward</option>
                                {wards.map(ward => (<option key={ward.id} value={ward.id}>{`${ward.code} - ${ward.name}`}</option>))}
                            </select>
                            {errors.ward && touched.ward && <span className="text-xs text-red-600">{errors.ward}</span>}
                        </div>
                        <div className="mt-4 mb-12">Polling Unit
                            <select 
                                name="pollingUnit" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.pollingUnit}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Polling Unit</option>
                                {pollingUnits.map(unit => (<option key={unit.id} value={unit.id}>{unit.code} - {unit.name}</option>))}
                            </select>
                            {errors.pollingUnit && touched.pollingUnit && <span className="text-xs text-red-600">{errors.pollingUnit}</span>}
                        </div>
                        <div className="mt-4 mb-12">Phone Number:
                            <input
                                type="text"
                                name="phoneNumber"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phoneNumber}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Phone Number"
                            />
                            {errors.phoneNumber && touched.phoneNumber && <span className="text-xs text-red-600">{errors.phoneNumber}</span>}
                        </div>
                        <div className="mt-4 mb-12">Email:
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
                        <div className="mt-4 mb-12">Role
                            <select 
                                name="role" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.role}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Role</option>
                                {roles.map(role => (<option key={role} value={role}>{role} Agent</option>))}
                            </select>
                            {errors.role && touched.role && <span className="text-xs text-red-600">{errors.role}</span>}
                        </div>
                        <div className="mt-4 mb-12">Password:
                            <input
                                type="password"
                                name="pwd"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.pwd}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Password"
                            />
                            {errors.pwd && touched.pwd && <span className="text-xs text-red-600">{errors.pwd}</span>}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4/10">
                                {formFields ? 'Update' : 'Add'} Agent
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

export default AgentForm;

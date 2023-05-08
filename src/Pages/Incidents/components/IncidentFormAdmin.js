import { Formik } from "formik";
import React, { useEffect, useState, useContext } from "react";
import { showToast } from "../../../helpers/showToast";
import { apiRequest } from "../../../lib/api";
import { AuthContext } from "../../../contexts/AuthContext";
import { getPollingUnitsByWardId, getWardsByLgaId, getLgasBySenatorialDistrict,
    getSenatorialDistrictsByStateId, allIncidentLevels, allIncidentTypes } from "../../../lib/url";

const IncidentFormAdmin = ({formFields, handleFormSubmit}) => {
    const incidents = [
        {
            "code": "1",
            "name": "Ballot Box Snatching",
            "id": 2
        },
        {
            "code": "2",
            "name": "Delay of Electoral Material",
            "id": 3
        },
        {
            "code": "3",
            "name": "Absence of form EC8A",
            "id": 4
        },
        {
            "code": "4",
            "name": "Inadequaate Security",
            "id": 5
        },
        {
            "code": "5",
            "name": "Agent not picking",
            "id": 6
        },
        {
            "code": "6",
            "name": "Violence/Intimidation",
            "id": 7
        },
        {
            "code": "7",
            "name": "Card reader not working",
            "id": 8
        },
        {
            "code": "8",
            "name": "Inec officials not present",
            "id": 9
        },
        {
            "code": "9",
            "name": "Agent phone number unreachable",
            "id": 10
        },
        {
            "code": "10",
            "name": "Others",
            "id": 11
        }
    ];
    const levels = [
        {
            "code": "LGA",
            "name": "LGA",
            "id": 1
        },
        {
            "code": "Ward",
            "name": "Ward",
            "id": 2
        },
        {
            "code": "PU",
            "name": "Polling Unit",
            "id": 3
        }
    ];
    const [authState] = useContext(AuthContext);
    const [formValid, setFormValid] = useState(false);
    const [wards, setWards] = useState([]);
    const [pollingUnits, setPollingUnits] = useState([]);
    const [incidentLevels, setIncidentLevels] = useState(levels);
    const [incidentTypes, setIncidentTypes] = useState(incidents);
    const [districts, setDistricts] = useState([]);
    const [lgas, setLgas] = useState([]);
    
    const incidentStatuses = [{
            "code": "1",
            "name": "Resolved",
            "id": 1
        },
        {
            "code": "2",
            "name": "Unresolved",
            "id": 2
        }];
    let initialValues = {
        pollingUnit: '',
        lga: '',
        ward: '',
        incidentLevel: '',
        incidentType: '',
        incidentStatus: '',
        location: '',
        phoneNumber: '',
        description: ''
    }

    const validate = (values) => {
        const errors = {};
        if (!values.incidentLevel) {
            errors.incidentLevel = 'Incident Level is required';
        }   else if (!values.incidentType) {
            errors.incidentType = 'Incident Type is required';
        }   else if (!values.incidentStatus) {
            errors.incidentStatus = 'Incident Status is required';
        }
        else if(!values.weight) {
            errors.location = 'Weight is required';
        }
        else if(!values.phoneNumber) {
            errors.phoneNumber = 'Phone Number is required';
        }   else {
            setFormValid(true);
        }
        return errors;
    }

    const getIncidentLevels = () => {
        apiRequest(`${allIncidentLevels}`, 'get')
            .then(res => {
                setIncidentLevels(res.incidentLevels);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getIncidentTypes = () => {
        apiRequest(`${allIncidentTypes}`, 'get')
            .then(res => {
                setIncidentTypes(res.incidentTypes);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }

    const getSenatorialDistricts = () => {
        apiRequest(getSenatorialDistrictsByStateId+'/'+authState.user?.userDetails?.stateId, 'get')
        .then(res => {
            let senatorialDistrictRes = [...res.senatorialDistricts];
            setDistricts(senatorialDistrictRes);
        })
        .catch(err => {
            showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
        })

    }
    
    const getDistrictLgas = (id) => {
        if(id){
         apiRequest(`${getLgasBySenatorialDistrict}/${id}`, 'get')
            .then((res) => {
                setLgas(res.lgas);
            })
            .catch((err) => {
                err.response.data.status == 401 ?
                history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`);
            });
        }
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

    const handleDistrictChange = (event, setFieldValue) => {
        const senatorialDistrict =  event.currentTarget.value;
        setFieldValue("senatorialDistrict", senatorialDistrict);
        getDistrictLgas(senatorialDistrict);
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
        getIncidentLevels();
        getIncidentTypes();
        getSenatorialDistricts();
        if(formFields){
            formFields.senatorialDistrict?getDistrictLgas(formFields.senatorialDistrict):null;
            formFields.lga?getWards(formFields.lga):null;
            formFields.ward?getPollingUnits(formFields.ward):null;
        }
    }, []);

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
                        <div className="mt-4 mb-12">
                            <select
                                name="incidentLevel"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.incidentLevel}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Incident Level</option>
                                {incidentLevels.map(incidentLevel => (<option key={incidentLevel.id} value={incidentLevel.id}>{incidentLevel.name}</option>))}
                            </select>
                            {errors.incidentLevel && touched.incidentLevel && <span className="text-xs text-red-600">{errors.incidentLevel}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="incidentType"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.incidentType}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Incident Type</option>
                                {incidentTypes.map(type => (<option key={type.id} value={type.id}>{type.name}</option>))}
                            </select>
                            {errors.incidentType && touched.incidentType && <span className="text-xs text-red-600">{errors.incidentType}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="incidentStatus"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.incidentStatus}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Incident Status</option>
                                {incidentStatuses.map((status) => (<option key={status.id} value={status.id}>{status.name}</option>))}
                            </select>
                            {errors.incidentStatus && touched.incidentStatus && <span className="text-xs text-red-600">{errors.incidentStatus}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="weight"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.weight}
                                required
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value>Incident Weight</option>
                                <option key={1} value={1}>Not Critical</option>
                                <option key={2} value={2}>Not Very Critical</option>
                                <option key={3} value={3}>Manageable</option>
                                <option key={4} value={4}>Critical</option>
                                <option key={5} value={5}>Very Critical</option>
                            </select>
                            {errors.weight && touched.weight && <span className="text-xs text-red-600">{errors.weight}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="senatorialDistrict"
                                onChange={(e)=>handleDistrictChange(e, setFieldValue)}
                                value={values.senatorialDistrict}
                                className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value=''>Senatorial District</option>
                                {districts.map(district => (<option key={district.id} value={district.id}>{district.name}</option>))}
                            </select>
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="lga"
                                onChange={(e)=>handleLgaChange(e, setFieldValue)}
                                value={values.lga}
                                className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value=''>LGA</option>
                                {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                            </select>
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="ward"
                                onChange={(e)=>handleWardChange(e, setFieldValue)}
                                onBlur={(e)=>handleWardChange(e, setFieldValue)}
                                value={values.ward}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                                disabled={values.incidentLevel == 1}
                            >
                                <option value='' disabled>Ward</option>
                                {wards.map(ward => (<option key={ward.id} value={ward.id}>{ward.code} - {ward.name}</option>))}
                            </select>
                            {errors.ward && touched.ward && <span className="text-xs text-red-600">{errors.ward}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="pollingUnit"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.pollingUnit}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                                disabled={!values.ward || values.incidentLevel != 3}
                            >
                                <option value='' disabled>Polling Unit</option>
                                {pollingUnits.map(unit => (<option key={unit.id} value={unit.id}>{unit.code} - {unit.name}</option>))}
                            </select>
                            {errors.pollingUnit && touched.pollingUnit && <span className="text-xs text-red-600">{errors.pollingUnit}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="location"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.location}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Location"
                            />
                            {/* {errors.location && touched.location && <span className="text-xs text-red-600">{errors.location}</span>} */}
                        </div>
                        <div className="mt-4 mb-12">
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
                        <div className="mt-4 mb-12">
                            <textarea
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Description"
                            />
                            {/* {errors.description && touched.description && <span className="text-xs text-red-600">{errors.description}</span>} */}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <button type="submit" disabled={isSubmitting || !formValid} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4.5/10">
                                {formFields ? 'Update' : 'Add'} Incident
                            </button>
                            <button className="border border-primary py-4 text-primary font-bold rounded-sm focus:outline-none w-4.5/10" onClick={handleReset} >
                                Reset
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default IncidentFormAdmin;

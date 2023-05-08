import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { showToast } from "../../../helpers/showToast";
import { apiRequest } from "../../../lib/api";
import { allAgents, allVotingLevels, electionTypes, getLgasBySenatorialDistrict, getPollingUnitsByWardId, getSenatorialDistrictsByStateId, getWardsByLgaId } from "../../../lib/url";

const ResultFormAdmin = ({formFields, handleFormSubmit, politicalParties}) => {
    const levels = [
        {
            "code": "LGA",
            "name": "LGA",
            "id": 2
        },
        {
            "code": "Ward",
            "name": "Ward",
            "id": 3
        },
        {
            "code": "PU",
            "name": "Polling Unit",
            "id": 4
        }
    ];

    let party1Label = {id:1, name:'PDP', code:'party_1'}
    let party2Label = {id:1, name:'PDP', code:'party_2'}
    let party3Label = {id:1, name:'PDP', code:'party_3'}
    let party4Label = {id:1, name:'PDP', code:'party_4'}
    let party5Label = {id:1, name:'PDP', code:'party_5'}
    let party6Label = {id:1, name:'PDP', code:'party_6'}
    if(politicalParties?.length > 0){
      party1Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_1')[0];
      party2Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_2')[0];
      party3Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_3')[0];
      party4Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_4')[0];
      party5Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_5')[0];
      party6Label = politicalParties && politicalParties.filter(politicalParty => politicalParty.code==='party_6')[0];
    }
    const [formValid, setFormValid] = useState(false);
    const [updated, setUpdated] = useState("1");
    const [wards, setWards] = useState([]);
    const [authState] = useContext(AuthContext);
    const [districts, setDistricts] = useState([]);
    const [lgas, setLgas] = useState([]);

    const [pollingUnits, setPollingUnits] = useState([]);
    const [votingLevels, setVotingLevels] = useState(levels);
    const [agents, setAgents] = useState([]);
    const [electionTypeList, setElectionTypeList] = useState([]);
         
    let initialValues = {
        pollingUnit: '',
        lga: '',
        ward: '',
        votingLevel: '',
        senatorialDistrict: '',
        partyAgent: '',
        registeredVoters: '',
        voidVotes: '',
        accreditedVoters: '',
        electionType: '',
        party_1: '',
        party_2: '',
        party_3: '',
        party_4: ''
    }
    const [init, setInit] = useState(initialValues);

    const [isWardVisible, setIsWardVisible] = useState()
    const [isPUVisible, setIsPUVisible] = useState()

    const validate = (values) => {
        const errors = {};
        setFormValid(false);
        if (!values.votingLevel && values.votingLevel !== 0) {
            errors.votingLevel = 'Voting Level is required';
        }   else if(!values.registeredVoters) {
            errors.registeredVoters = 'Registered Voters is required';
        }   else if(values.voidVotes === '') {
            errors.voidVotes = 'Void Votes data is required';
        }   else if(!values.accreditedVoters) {
            errors.accreditedVoters = 'Accredited Voters is required';
        }   else if(!values.party_1) {
            errors.party_1 = `${party1Label.name} Votes is required`;
        }   else if(!values.party_2) {
            errors.party_2 = `${party2Label.name} Votes is required`;
        }   else if(!values.party_3) {
            errors.party_3 = `${party3Label.name} Votes is required`;
        }   else if(!values.party_4) {
            errors.party_4 = `${party4Label.name} Votes is required`;
        }   else if(!values.party_5) {
            errors.party_5 = `${party5Label.name} Votes is required`;
        }   else if(!values.party_6) {
            errors.party_6 = `${party6Label.name} Votes is required`;
        }   else if (!values.partyAgent) {
            errors.partyAgent = 'Party Agent is required';
        }   else if(values.party_1 < 0){
            errors.party_1 = `${party1Label.name} should not be less than 0`
        }   else if(values.party_2 < 0){
            errors.party_2 = `${party2Label.name} should not be less than 0`
        }   else if(values.party_3 < 0){
            errors.party_3 = `${party3Label.name} should not be less than 0`
        }   else if(values.party_4 < 0){
            errors.party_4 = `${party4Label.name} should not be less than 0`
        }   else if(values.party_5 < 0){
            errors.party_5 = `${party5Label.name} should not be less than 0`
        }   else if(values.party_6 < 0){
            errors.party_6 = `${party6Label.name} should not be less than 0`
        }   else if(values.accreditedVoters < 0){
            errors.accreditedVoters = 'Accredited voters should not be less than 0'
        }   else if(values.registeredVoters < 0){
            errors.registeredVoters = 'Registered voters should not be less than 0'
        }   else if(values.voidVotes < 0){
            errors.voidVotes = 'Void votes data should not be less than 0'
        }   else if(values.electionType === 0){
            errors.electionType = 'Election type should be selected'
        }   else {
            setFormValid(true);
        }
        return errors;
    }

    const getVotingLevels = () => {
        apiRequest(`${allVotingLevels}`, 'get')
            .then(res => {
                setVotingLevels(res.votingLevels);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }
    
    const getAgents = (lga) => {
        //apiRequest(`${filterAgentsByLga}/${lga}`, 'get')
        apiRequest(`${allAgents}/${authState.user?.userDetails?.stateId}`, 'get')
            .then(res => {
                setAgents(res.partyAgentDtoList);
            })
            .catch(err => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
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

    const getPollingUnits = (wardId) =>{
        if(wardId){apiRequest(`${getPollingUnitsByWardId}/${wardId}`, 'get')
            .then((res) => {
                setPollingUnits(res.pollingUnits)
            })
            .catch((err) => {
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            });}
    }

    const handleChanges = (value, setFieldValue) => {
        if(updated==="1" && formFields){
            setFieldValue("votingLevel", formFields.votingLevel);
            setFieldValue("partyAgent", formFields.partyAgent);
            setFieldValue("lga", formFields.lga);
            setFieldValue("ward", formFields.ward);
            setFieldValue("electionType", formFields.electionType);
            setFieldValue("pollingUnit", formFields.pollingUnit);
            setFieldValue("accreditedVoters", formFields.accreditedVoters);
            setFieldValue("registeredVoters", formFields.registeredVoters);
            setFieldValue("voidVotes", formFields.voidVotes);
            setFieldValue("senatorialDistrict", formFields.senatorialDistrict);
            value!=="party_1" && setFieldValue("party_1", formFields.party_1);
            value!=="party_2" && setFieldValue("party_2", formFields.party_2);
            value!=="party_3" && setFieldValue("party_3", formFields.party_3);
            value!=="party_4" && setFieldValue("party_4", formFields.party_4);
            value!=="party_5" && setFieldValue("party_5", formFields.party_5);
            value!=="party_6" && setFieldValue("party_6", formFields.party_6);
            setUpdated("0");
        }
    }

    const handleLevelChange = (event, setFieldValue) => {
        const votingLevelId =  event.currentTarget.value;
        setFieldValue("votingLevel", votingLevelId);
        setIsWardVisible(votingLevelId>0)
        setIsPUVisible(votingLevelId>1)
    }

    const handleWardChange = (event, setFieldValue) => {
        const ward =  event.currentTarget.value;
        setFieldValue("ward", ward);
        getPollingUnits(ward);
    }

    const handleDistrictChange = (event, setFieldValue) => {
        const senatorialDistrict =  event.currentTarget.value;
        setFieldValue("senatorialDistrict", senatorialDistrict);
        getDistrictLgas(senatorialDistrict);
    }

    const handleLgaChange = (event, setFieldValue) => {
        const lga =  event.currentTarget.value;
        getAgents(lga)
        setFieldValue("lga", lga);
        getWards(lga);
    }

    const getElectionTypes = () => {
        apiRequest(electionTypes+'/active', 'get')
            .then((res) => {
                setElectionTypeList(res.electionTypes)
            })
            .catch((err) => {
            });
    }

    useEffect(() => {
        getElectionTypes();
        setInit(formFields);
    }, []);

    useEffect(() => {
        getSenatorialDistricts();
        getVotingLevels();
        if(formFields){
            formFields.senatorialDistrict?getDistrictLgas(formFields.senatorialDistrict):null;
            formFields.lga?getWards(formFields.lga):null;
            formFields.ward?getPollingUnits(formFields.ward):null;

            setIsWardVisible(formFields.votingLevel && formFields.votingLevel>0);
            setIsPUVisible(formFields.votingLevel && formFields.votingLevel>1);
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
                                name="electionType"
                                onChange={handleChange}
                                value={values.electionType}
                                className="w-full border border-primary rounded-sm py-2 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-1xl mt-2"
                            >
                                <option value='0'>Election Type</option>
                                {electionTypeList.map(electionTyp => (<option key={electionTyp.id} value={electionTyp.id}>{electionTyp.name}</option>))}
                            </select>
                            {errors.electionType && touched.electionType && <span className="text-xs text-red-600">{errors.electionType}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="votingLevel"
                                onChange={(e)=>handleLevelChange(e, setFieldValue)}
                                value={values.votingLevel}
                                disabled={formFields ? true:false}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Voting Level</option>
                                {votingLevels.map(votingLevel => (<option key={votingLevel.id} value={votingLevel.id}>{votingLevel.name}</option>))}
                            </select>
                            {errors.votingLevel && touched.votingLevel && <span className="text-xs text-red-600">{errors.votingLevel}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <select
                                name="senatorialDistrict"
                                onChange={(e)=>handleDistrictChange(e, setFieldValue)}
                                value={values.senatorialDistrict}
                                disabled={formFields}
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
                                disabled={formFields}
                                className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                            >
                                <option value=''>LGA</option>
                                {lgas.map(lga => (<option key={lga.id} value={lga.id}>{lga.name}</option>))}
                            </select>
                        </div>
                        {isWardVisible && <div className="mt-4 mb-12">
                            <select
                                name="ward"
                                onChange={(e)=>handleWardChange(e, setFieldValue)}
                                onBlur={(e)=>handleWardChange(e, setFieldValue)}
                                disabled={formFields}
                                value={values.ward}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                                // disabled={!values.lga || values.votingLevel == 2}
                            >
                                <option value='' disabled>Ward</option>
                                {wards.map(ward => (<option key={ward.id} value={ward.id}>{ward.code} - {ward.name}</option>))}
                            </select>
                            {errors.ward && touched.ward && <span className="text-xs text-red-600">{errors.ward}</span>}
                        </div>}
                        {isPUVisible && <div className="mt-4 mb-12">
                            <select
                                name="pollingUnit"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.pollingUnit}
                                disabled={formFields || !values.ward}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                                >
                                <option value='' disabled>Polling Unit</option>
                                {pollingUnits.map(unit => (<option key={unit.id} value={unit.id}>{unit.code} - {unit.name}</option>))}
                            </select>
                            {errors.pollingUnit && touched.pollingUnit && <span className="text-xs text-red-600">{errors.pollingUnit}</span>}
                        </div>}
                        <div className="mt-4 mb-12">
                            <select
                                name="partyAgent"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.partyAgent}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm text-darkerGray"
                            >
                                <option value='' disabled>Party Agent</option>
                                {agents.map(agent => (<option key={agent.id} value={agent.id}>{`${agent.firstname} ${agent.lastname}`}</option>))}
                            </select>
                            {errors.partyAgent && touched.partyAgent && <span className="text-xs text-red-600">{errors.partyAgent}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="number"
                                name="registeredVoters"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.registeredVoters}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Registered Voters"
                            />
                            {errors.registeredVoters && touched.registeredVoters && <span className="text-xs text-red-600">{errors.registeredVoters}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="number"
                                name="accreditedVoters"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.accreditedVoters}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Accredited Voters"
                            />
                            {errors.accreditedVoters && touched.accreditedVoters && <span className="text-xs text-red-600">{errors.accreditedVoters}</span>}
                        </div>

                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_1"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_1",setFieldValue)}
                                value={values.party_1}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party1Label?.name} votes`}
                            />
                            {errors.party_1 && touched.party_1 && <span className="text-xs text-red-600">{errors.party_1}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_2"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_2",setFieldValue)}
                                value={values.party_2}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party2Label?.name} votes`}
                            />
                            {errors.party_2 && touched.party_2 && <span className="text-xs text-red-600">{errors.party_2}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_3"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_3",setFieldValue)}
                                value={values.party_3}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party3Label?.name} votes`}
                            />
                            {errors.party_3 && touched.party_3 && <span className="text-xs text-red-600">{errors.party_3}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_4"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_4",setFieldValue)}
                                value={values.party_4}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party4Label?.name} votes`}
                            />
                            {errors.party_4 && touched.party_4 && <span className="text-xs text-red-600">{errors.party_4}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_5"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_5",setFieldValue)}
                                value={values.party_5}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party5Label?.name} votes`}
                            />
                            {errors.party_5 && touched.party_5 && <span className="text-xs text-red-600">{errors.party_5}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="text"
                                name="party_6"
                                onChange={handleChange}
                                onClick={()=>handleChanges("party_6",setFieldValue)}
                                value={values.party_6}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder={`${party6Label?.name} votes`}
                            />
                            {errors.party_6 && touched.party_6 && <span className="text-xs text-red-600">{errors.party_6}</span>}
                        </div>
                        <div className="mt-4 mb-12">
                            <input
                                type="number"
                                name="voidVotes"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.voidVotes}
                                className="w-full border border-primary rounded-sm py-3 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                                placeholder="Void Votes"
                            />
                            {errors.voidVotes && touched.voidVotes && <span className="text-xs text-red-600">{errors.voidVotes}</span>}
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <button type="submit" disabled={isSubmitting || (!formValid && !formFields)} className="bg-primary py-4 text-white font-bold rounded-sm focus:outline-none w-4.5/10">
                                {formFields ? 'Update' : 'Add'} Result
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


export default ResultFormAdmin;

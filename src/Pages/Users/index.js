import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs, Breadcrumb } from "react-breadcrumbs";
import { Link } from "react-router-dom";
import { UserContext, UserController } from "../../contexts/UserContext";
import Layout from "../../shared/Layout";
import UserList from "./UserList";
import {users, uploadUser, usersSearch,
    allStates, getSenatorialDistrictsByStateId, getLgasBySenatorialDistrict, getUsers} from '../../lib/url.js';

import {apiRequest} from '../../lib/api.js';
import { showToast } from '../../helpers/showToast';
import Uploader from "../../shared/components/Uploader";
import Pagination from "../../shared/components/Pagination";

const Users = ({match, location, history}) => {
    const [search, setSearch] = useState('');
    const [userState, dispatch] = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentUser, setCurrentUsers] = useState([]);
    const [filter, setFilter] = useState({senatorialDistrict: '', state: '', lga: '', ward:''});
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState([]);

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const onPageChanged = data => {
        const allUsers = userState.users.users;
        const { currentPage, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const users = allUsers?.slice(offset, offset + pageLimit);
        setCurrentPage(currentPage);
        setCurrentUsers(users);
    }

    const getAllUsers = () => {
        dispatch({type: 'GET_USERS'});
        //  setSubmitting(true);
         apiRequest(users, 'get')
            .then((res) => {
                dispatch({type: 'GET_USERS_SUCCESS', payload: {response: res}});
                // setSubmitting(false);
            })
            .catch((err) => {
                dispatch({type: 'GET_USERS_FAILURE', payload: {error: err}});
                err.response?.data?.status === 401 ? history.replace("/login") :
                showToast('error', 'Something went wrong. Please try again later')
                // setSubmitting(false);
            });
    }

    const handleSearch = () => {
        dispatch({type: 'GET_USER_BY_NAME'});
        //  setSubmitting(true);
         apiRequest(usersSearch, 'get', {params: {"name": search}})
            .then((res) => {
                dispatch({type: 'GET_USERS_SUCCESS', payload: {response: res}});
                // setSubmitting(false);
            })
            .catch((err) => {
                dispatch({type: 'GET_USERS_FAILURE', payload: {error: err}});
                err.response.data.status === 401 ? history.replace("/login") :
                showToast('error', 'Something went wrong. Please try again later')
                // setSubmitting(false);
            });
    }




    
    const filterData = (id,type) => {
        const url = `${getUsers}/${type}/${id}`;
        setFilter({...filter, [type]: id});
        if(id) { dispatch({type: 'GET_USERS'});
         apiRequest(`${url}`, 'get')
            .then((res) => {
                dispatch({type: 'GET_USERS_SUCCESS', payload: {response: res}});
                setCurrentUsers(res.users.slice(0, 11));
            })
            .catch((err) => {
                dispatch({type: 'GET_USERS_FAILURE', payload: {error: err}});
            });
        }
    }

    const clearFilter = () => {
        setFilter({senatorialDistrict: '', state: '', lga: ''});
        setSearch("");
        getAllUsers();
    }

    const getStates = () => {
        apiRequest(allStates, 'get')
            .then(res => {
                let statesRes = [...res.states];
                setStates(statesRes);
            })
            .catch(err => {
                err?.response?.data?.status == 401 ? history.replace("/login") :
                showToast('error', `${err?.response?.data.statusCode || "Error"}: ${err?.response?.data.statusMessage || "Something went wrong. Please try again later."}`)
            })
    }
    
    const getSenatorialDistricts = (stateId) => {
        if(stateId) apiRequest(`${getSenatorialDistrictsByStateId}/${stateId}`, 'get')
            .then(res => {
                let senatorialDistrictRes = [...res.senatorialDistricts];
                setDistricts(senatorialDistrictRes);
            })
            .catch(err => {
                err?.response?.data?.status == 401 ? history.replace("/login") :
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

    useEffect(() => {
        getStates();
        getAllUsers();
    }, []);

    useEffect(() => {
        filterData(filter.state, 'state');
        getSenatorialDistricts(filter.state);
    }, [filter.state])

    useEffect(() => {
        filterData(filter.senatorialDistrict, 'senatorial-district');
        getDistrictLgas(filter.senatorialDistrict);
    }, [filter.senatorialDistrict])

    useEffect(() => {
        filterData(filter.lga, 'lga');
    }, [filter.lga])






    return (
        <UserController>
            <Layout location={location}>
                <Breadcrumbs className="shadow-container w-full lg:px-3.5 px-1 pt-7 pb-5 rounded-sm text-2xl font-bold"/>
                <Breadcrumb data={{
                    title: 'Users',
                    pathname: match.path
                }}>
                    <div className="my-6 shadow-container pl-2.5 pr-7">
                        <div className="flex justify-between px-1 mt-16">
                            <div className="xl:w-4.5/10 lg:w-6/10 flex items-center px-1 w-full">
                        <select
                            name="state"
                            onChange={(e) => setFilter({...filter, 'state': e.target.value})}
                            value={filter.state}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value='' disabled>State</option>
                            {states.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
                        </select>
                        <select
                            name="senatorialDistrict"
                            onChange={(e) => setFilter({'senatorialDistrict':filter.senatorialDistrict, 'senatorialDistrict': e.target.value})}
                            value={filter.senatorialDistrict}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm mx-4"
                        >
                            <option value=''>Senatorial District</option>
                            {districts.map(district => (<option key={district.id} value={district.code}>{district.name}</option>))}
                        </select>
                        <select
                            name="lga"
                            onChange={(e) => setFilter({'lga':filter.lga, 'lga': filter.lga, 'lga': e.target.value})}
                            value={filter.lga}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>LGA</option>
                            {lgas.map(lga => (<option key={lga.id} value={lga.code}>{lga.name}</option>))}
                        </select>
                        {/* <select
                            name="group"
                            onChange={(e) => setFilter({'state':filter.state, 'senatorialDistrict': filter.senatorialDistrict, 'lga': filter.lga, 'group': e.target.value})}
                            value={filter.group}
                            className="w-full border border-primary rounded-sm py-4 px-2 focus:outline-none bg-transparent placeholder-darkerGray font-medium text-sm"
                        >
                            <option value=''>Group</option>
                            {groups.map(group => (<option key={group.id} value={group.code}>{group.name}</option>))}
                        </select> */}
                        <div className="cursor-pointer" onClick={clearFilter}>clear</div>
                    </div>
                            <Link className="bg-primary py-4 px-16 text-white font-bold rounded-sm" to="/users/create">
                                Add User
                            </Link>
                        </div>
                        <div className="w-full flex mt-16 items-center px-1">
                            <div className="w-1/2">
                                <input className="border border-primary rounded-sm w-9.5/10 py-3 px-2 focus:outline-none" name="search" type="text" value={search} onChange={handleChange} placeholder="Search users by either first name or last name or phone number"/>
                            </div>
                            <div className="w-1/2">
                                <button disabled={search.length < 1} className="bg-primary button-padding py-3.5 text-white font-bold rounded-lg focus:outline-none" onClick={handleSearch}>
                                    search
                                </button>
                            </div>
                        </div>
                        <UserList users={userState.users.users} loading={userState.loading} getUsers={getAllUsers}/>
                        
                        {!userState.loading && <div className="flex justify-between items-center mt-4">
                            <div className="flex">
                                <Uploader dispatch={dispatch} action="UPLOAD_USER" action_success="UPLOAD_USER_SUCCESS" action_error="UPLOAD_USER_FAILURE" url={uploadUser} refresh={getAllUsers} logout={() => history.replace("/login")}/>
                            </div>
                            {userState.users.users?.length > 0 && <div>
                                <Pagination totalRecords={userState.users.users.length} pageLimit={10} pageNeighbours={2} onPageChanged={onPageChanged} />
                            </div>}
                        </div>}

                    </div>
                </Breadcrumb>
            </Layout>
        </UserController>
    );
}

export default Users;

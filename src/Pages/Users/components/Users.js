import React from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Ellipsis from '../../../shared/components/Ellipsis';

const Users = ({users, deleteUser}) => {

        const userList = users && users.map(user => {
          return (
            <div key={user.id} className="custom-table-row w-full flex">
                <div className="table-row-data w-2/10">{user.firstname}</div>
                <div className="table-row-data w-1/10">{user.lastname}</div>
                <div className="table-row-data w-2/10">{user.email}</div>
                <div className="table-row-data w-1/10">{user.phone}</div>
                <div className="table-row-data w-2/10">{user.role.toUpperCase()}</div>
                <div className="table-row-data w-1/10">{user.lgaId}</div>
                <div className="table-row-data w-1/10">
                    <span data-tip data-for={`ellipsis-user-${user.id}`} data-event='click'>
                        <Ellipsis />
                    </span>
                    <ReactTooltip id={`ellipsis-user-${user.id}`} place="bottom" type="light" effect="solid" border borderColor="#979797" clickable={true}>
                        {user.role !== 'agent' && <Link to={{pathname: `/users/${user.id}`, state: {user: user}}} className="text-sm text-darkerGray block text-left">Edit Profile</Link>}
                        <Link to={{pathname: `/users/password/${user.id}`, state: {user: user}}} className="text-sm text-darkerGray block text-left">Change Password</Link>
                        {user.role !== 'agent' && <Link to={{pathname: `/users/lga/${user.id}`, state: {user: user}}} className="text-sm text-darkerGray block text-left">Change LGA</Link>}
                        {user.role !== 'agent' && <button onClick={()=>deleteUser(user)} className="text-sm text-textRed block text-left focus:outline-none">Delete User</button>}
                    </ReactTooltip>
                </div>
            </div>)})

        return(
            <div className="table">
                <div className="table-header">
                    <div className="custom-table-row w-full flex">
                        <div className="table-header-data w-2/10">First Name</div>
                        <div className="table-header-data w-1/10">Last Name</div>
                        <div className="table-header-data w-2/10">Email</div>
                        <div className="table-header-data w-1/10">Phone</div>
                        <div className="table-header-data w-2/10">Group</div>
                        <div className="table-header-data w-1/10">LGA</div>
                        <div className="table-header-data w-1/10"></div>
                    </div>
                </div>

                <div className="table-body">
                  { userList}
                </div>
            </div>
        )

}

export default Users

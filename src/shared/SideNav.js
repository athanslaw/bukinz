import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import AgentIcon from "./assets/icons/AgentIcon";
import DashboardIcon from "./assets/icons/DahsboardIcon";
import EmptyIcon from "./assets/icons/EmptyIcon";
import IncidentIcon from "./assets/icons/IncidentIcon";
import PartyIcon from "./assets/icons/PartyIcon";
import ResultIcon from "./assets/icons/ResultIcon";
import TerritoryIcon from "./assets/icons/TerritoryIcon";
import UserIcon from "./assets/icons/UserIcon";

const SideNav = ({location}) => {
    
    const [authState] = useContext(AuthContext);
    let defaultMenuList = [
        {
            name: 'Logout',
            icon: (active) => <EmptyIcon active={active} />,
            active: false,
            subMenus: [],
            path: '/logout'
        }
    ];

    if(authState?.user?.userDetails?.role.toLowerCase()==='administrator'){
        defaultMenuList = [
            {
                name: 'Dashboard',
                icon: (active) => <DashboardIcon active={active} />,
                active: true,
                subMenus: [
                    {
                        name: 'Result',
                        active: false,
                        path: '/dashboard/results'
                    },
                    {
                        name: 'National Result',
                        active: false,
                        path: '/dashboard/resultsNational'
                    },
                    {
                        name: 'Incidents',
                        active: false,
                        path: '/dashboard/incidents'
                    },
                    {
                        name: 'Events',
                        active: false,
                        path: '/dashboard/events'
                    }
                ],
                path: '/dashboard'
            },
            {
                name: 'Results',
                icon: (active) => <ResultIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/results'
            },{
                name: 'ElectionTypes',
                icon: (active) => <ResultIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/electionTypes'
            },
            {
                name: 'Incident',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/incidents'
            },
            {
                name: 'Incident Groups',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/incident-group'
            },
            {
                name: 'Agents',
                icon: (active) => <AgentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/agents'
            },
            {
                name: 'Events',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/event'
            },
            {
                name: 'Events Tracker',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/event-records'
            },
            {
                name: 'Territories',
                icon: (active) => <TerritoryIcon active={active} />,
                active: false,
                subMenus: [
                    {
                        name: 'States',
                        active: false,
                        path: '/territories/states'
                    },
                    {
                        name: 'LGAs',
                        active: false,
                        path: '/territories/lgas'
                    },
                    {
                        name: 'Wards',
                        active: false,
                        path: '/territories/wards'
                    },
                    {
                        name: 'Polling Unit',
                        active: false,
                        path: '/territories/polling-units'
                    }
                ],
                path: '/territories'
            },
            {
                name: 'Users',
                icon: (active) => <UserIcon active={active}/>,
                active: false,
                subMenus: [],
                path: '/users'
            },
            {
                name: 'Parties',
                icon: (active) => <PartyIcon active={active}/>,
                active: false,
                subMenus: [],
                path: '/parties'
            },
            {
                name: 'Logout',
                icon: (active) => <EmptyIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/logout'
            }
        ];
    }
    else if(authState?.user?.userDetails?.role.toLowerCase()==='executive'){
        defaultMenuList = [
            {
                name: 'Dashboard',
                icon: (active) => <DashboardIcon active={active} />,
                active: true,
                subMenus: [
                    {
                        name: 'Result',
                        active: false,
                        path: '/dashboard/results'
                    },
                    {
                        name: 'Incidents',
                        active: false,
                        path: '/dashboard/incidents'
                    },
                    {
                        name: 'Events',
                        active: false,
                        path: '/dashboard/events'
                    }
                ],
                path: '/dashboard'
            },
            {
                name: 'Incident',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/incidents'
            },
            {
                name: 'Logout',
                icon: (active) => <EmptyIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/logout'
            }
        ];
    }
    else if(authState?.user?.userDetails?.role.toLowerCase()==='national executive'){
        defaultMenuList = [
            {
                name: 'Dashboard',
                icon: (active) => <DashboardIcon active={active} />,
                active: true,
                subMenus: [
                    {
                        name: 'National Result',
                        active: false,
                        path: '/dashboard/resultsNational'
                    },
                    {
                        name: 'Incidents',
                        active: false,
                        path: '/dashboard/incidents'
                    },
                    {
                        name: 'Events',
                        active: false,
                        path: '/dashboard/events'
                    }
                ],
                path: '/dashboard'
            },
            {
                name: 'Logout',
                icon: (active) => <EmptyIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/logout'
            }
        ];
    }
    else if(authState?.user?.userDetails?.role.toLowerCase()==='user'){
        defaultMenuList = [
            {
                name: 'Results',
                icon: (active) => <ResultIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/results'
            },
            {
                name: 'Incident',
                icon: (active) => <IncidentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/incidents'
            },
            {
                name: 'Agents',
                icon: (active) => <AgentIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/agents'
            },
            {
                name: 'Logout',
                icon: (active) => <EmptyIcon active={active} />,
                active: false,
                subMenus: [],
                path: '/logout'
            }
        ];
    }

    const [menus] = useState(defaultMenuList);
    const [top, setTop] = useState([]);
    const [bottom, setBottom] = useState(defaultMenuList.slice(0, defaultMenuList.length));
    const [activeMenu, setActiveMenu] = useState();

    const updateNav = () => {
        for(let i = 0; i < menus.length; ++i) {
            if(location.pathname === menus[i].path || location.pathname.indexOf(menus[i].path) === 0) {
                setTop(menus.slice(0, i));
                setActiveMenu({...menus[i], active : true});
                setBottom(menus.slice(i+1, menus.length))
            }   else {
                menus[i] = {...menus[i], active : false};
            }
        };
    }

    const updateSubmenu = () => {
        if(activeMenu?.subMenus.length > 0) {
            for(let i = 0; i < activeMenu.subMenus.length; ++i) {
                if(activeMenu.subMenus[i].path === location.pathname || location.pathname.indexOf(activeMenu.subMenus[i].path) === 0) {
                    activeMenu.subMenus[i] = {...activeMenu.subMenus[i], active:true}
                }   else  {
                    activeMenu.subMenus[i] = {...activeMenu.subMenus[i], active:false}
                }
            }
        }
    }

    useEffect(() => {
        updateNav();
    }, [location])

    useEffect(() => {
        updateSubmenu();
    }, [location, activeMenu])

    return (
        <>
        <div className="side-nav z-10 h-screen bg-white fixed text-sm text-primary" id="sidenav">
            <div className="flex flex-col h-full" style={{'overflow':'auto'}}>
                <div className="top pt-2.5 border-r border-b border-primary">
                    <div className="mt-24">
                        
                    </div>
                    <ul className="list-reset text-center md:text-left">
                        {top.map((item, index) => (
                            <li key={index} className="w-full border-t border-primary border-opacity-10">
                                <Link to={item.subMenus.length > 0 ? item.subMenus[0].path : item.path} className="flex w-full items-center py-3.5 px-5">
                                    <span className="w-2.5/10">{item.icon(item.active)}</span>
                                    <span className="6/10 mr-2 ml-4">{item.name}</span>
                                    {item.subMenus.length > 0 && 
                                        <span className="1/10">&uarr;</span>
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {activeMenu && <div>
                    <Link to={activeMenu.path} className="flex w-full items-center py-3.5 px-5">
                        <span className="w-2.5/10">{activeMenu.icon(activeMenu.active)}</span>
                        <span className={`font-bold 6/10 mr-2 ml-4`}>{activeMenu.name}</span>
                        {activeMenu.subMenus.length > 0 && 
                            <span className="1/10">&darr;</span>
                        }
                    </Link>
                    {activeMenu.subMenus.length > 0 && 
                        <div className="w-full flex mb-1">
                            <div className="w-4/10"></div>
                            <ul className="list-reset text-center md:text-left w-6/10 text-xs">
                                {activeMenu.subMenus.map((subMenu, idx) => (
                                    <li key={idx} className="">
                                        <Link to={subMenu.path} className="flex w-full items-center py-1.5">
                                            <span className={`${(subMenu.active || (subMenu.path === location.pathname || location.pathname.indexOf(subMenu.path) === 0)) ? "font-bold" : ""} mr-2 ml-4`}>{subMenu.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>}
                <div className="bottom border-r border-t border-primary flex-grow">
                    <ul className="list-reset text-center md:text-left">
                        {bottom.map((item, index) => (
                            <li key={index} className="w-full border-t border-primary border-opacity-10">
                                <Link to={item.subMenus.length > 0 ? item.subMenus[0].path : item.path} className="flex w-full items-center py-3.5 px-5">
                                    <span className="w-2.5/10">{item.icon(item.active)}</span>
                                    <span className="6/10 mr-2 ml-4">{item.name}</span>
                                    {item.subMenus.length > 0 && 
                                        <span className="1/10">&uarr;</span>
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>
         <div className="lg:hidden side-nav z-10 h-screen bg-white fixed text-sm text-primary" id="mobilesidenav">
            <div className="flex flex-col h-full overflow-auto">
                <div className="top pt-2.5 border-r border-b border-primary">
                    <div className="mt-24">
                        
                    </div>
                    <ul className="list-reset text-center md:text-left">
                        {top.map((item, index) => (
                            <li key={index} className="w-full border-t border-primary border-opacity-10">
                                <Link to={item.subMenus.length > 0 ? item.subMenus[0].path : item.path} className="flex w-full items-center py-3.5 px-5">
                                    <span className="w-2.5/10">{item.icon(item.active)}</span>
                                    <span className="6/10 mr-2 ml-4">{item.name}</span>
                                    {item.subMenus.length > 0 && 
                                        <span className="1/10">&uarr;</span>
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {activeMenu && <div>
                    <Link to={activeMenu.path} className="flex w-full items-center py-3.5 px-5">
                        <span className="w-2.5/10">{activeMenu.icon(activeMenu.active)}</span>
                        <span className="font-bold 6/10 mr-2 ml-4">{activeMenu.name}</span>
                        {activeMenu.subMenus.length > 0 && 
                            <span className="1/10">&darr;</span>
                        }
                    </Link>
                    {activeMenu.subMenus.length > 0 && 
                        <div className="w-full flex mb-1">
                            <div className="w-4/10"></div>
                            <ul className="list-reset text-center md:text-left w-6/10 text-xs">
                                {activeMenu.subMenus.map((subMenu, idx) => (
                                    <li key={idx} className="">
                                        <Link to={subMenu.path} className="flex w-full items-center py-1.5">
                                            <span className={`${(subMenu.active || (subMenu.path === location.pathname || location.pathname.indexOf(subMenu.path) === 0)) ? "font-bold" : ""} mr-2 ml-4`}>{subMenu.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>}
                <div className="bottom border-r border-t border-primary flex-grow">
                    <ul className="list-reset text-center md:text-left">
                        {bottom.map((item, index) => (
                            <li key={index} className="w-full border-t border-primary border-opacity-10">
                                <Link to={item.subMenus.length > 0 ? item.subMenus[0].path : item.path} className="flex w-full items-center py-3.5 px-5">
                                    <span className="w-2.5/10">{item.icon(item.active)}</span>
                                    <span className="6/10 mr-2 ml-4">{item.name}</span>
                                    {item.subMenus.length > 0 && 
                                        <span className="1/10">&uarr;</span>
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>
         </>
    );
}

export default SideNav;
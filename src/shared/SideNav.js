import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import EmptyIcon from "./assets/icons/EmptyIcon";
import UserIcon from "./assets/icons/UserIcon";

const SideNav = ({location}) => {
    
    const [authState] = useContext(AuthContext);

    defaultMenuList = [
        {
            name: 'Users',
            icon: (active) => <UserIcon active={active}/>,
            active: false,
            subMenus: [],
            path: '/users'
        },
        {
            name: 'Logout',
            icon: (active) => <EmptyIcon active={active} />,
            active: false,
            subMenus: [],
            path: '/logout'
        }
    ];
    

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
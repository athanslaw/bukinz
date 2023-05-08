import React, { useEffect, useState } from 'react';
import Bars from './assets/bars.svg';
import Cancel from './assets/cancel.svg';

const NavTrigger = () => {
    const [open, setOpen] = useState(false);
    const {width, height} = window.screen;
    
    const closeNav = () => {
        document.getElementById("mobilesidenav").style.width = "0";
        document.getElementById("mobilesidenav").style.display = "none";
        setOpen(false);
    }
    const openNav = () => {
        document.getElementById("mobilesidenav").style.width = "13rem";
        document.getElementById("mobilesidenav").style.display = "block";
        setOpen(true);
    }
    return (
        <div className="flex justify-end mx-3.5 py-3.5" id="bars"><img onClick={open ? closeNav : openNav} src={open ? Cancel : Bars} /></div>
    )
}

export default NavTrigger;
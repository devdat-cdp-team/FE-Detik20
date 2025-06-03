import PropTypes from 'prop-types';
import global from '../global';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileContext } from '../main';
import logo from '../assets/Logo.png';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {profile} = useContext(ProfileContext);

    const searchParams = new URLSearchParams(location.search);

    const [activeProfile, setActiveProfile] = useState(false);

    const handleLogout = () => {
        global.setToken(null);
        window.localStorage.setItem("permissions", null);
        navigate("/login");
    }

    return (
        <>
            <div className="flex justify-between items-center text-color-2 xxs:px-5 xxs:py-3 lg:px-10 lg:py-5">
                {/* <div className='lg:w-10'>
                    <img src={ logo } alt={ logo } />
                </div> */}

                <div className="lg:w-full">
                    <a href="/">
                        <img src={ logo } alt="" className="xxs:w-5 sm:w-6 lg:w-10" />
                    </a>
                </div>
                
                <div onClick={handleLogout} className='flex items-center font-bold cursor-pointer'>
                    <p className='mr-1.5 xxs:text-xs lg:text-base'>Logout</p>
                    <span className='ml-1.5'><i className="bi bi-box-arrow-right"></i></span>
                </div>
            </div>
            <hr />
        </>
    )
}

export default Navbar;
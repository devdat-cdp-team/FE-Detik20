import axios from "axios";
import { useContext, useEffect, useState } from "react";
import global from "./global";
import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        let token = global.getToken();

        if (token) {
            let ids = global.readSharedId();

        } else if (window.location.pathname != "/login") {
            window.location.pathname = "/login";
        }
    }, [])

    return (
        <Outlet />
    );
}

export default Layout;
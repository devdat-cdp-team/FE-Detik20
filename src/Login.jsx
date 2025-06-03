import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import MicrosoftLogin from "react-microsoft-login";
import global from "./global";
import microsoft from "../src/assets/microsoft_logo.png";
import google from "../src/assets/google_logo.png";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [enableButton, setEnableButton] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
    }, [])
    
    useEffect(() => {
        checkInput();
    }, [email, password]);

    useEffect(() => {
        setTimeout(() => {
           checkInput();
        }, 100);
    }, []);

    const handleEmailChange = (event) => {
        const { value } = event.target;
        setEmail(value);
        checkInput();
    };

    const handlePasswordChange = (event) => {
        const { value } = event.target;
        setPassword(value);
        checkInput();
    };

    const { instance } = useMsal();
    const handleMicrosoftLogin = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            const accessToken = response.accessToken;
            checkCredential(accessToken, "microsoft");
        } catch (error) {
            console.log("Microsoft login error: ", error);
        }
    };

    const onLoginGoogleSuccess = (res) => {
        checkCredential(res.access_token, "google");
    };
    
    const onLoginGoogleFailed = (err) => {
        console.log("google login error: ", err);
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: onLoginGoogleSuccess,
        onError: onLoginGoogleFailed,
    });
    

    const checkCredential = (cred, ssoProvider) => {
        setLoading(true);

        let data = { access_token: cred };

        const fetchAPI = async () => {
            try {
                const response = await axios.post(
                    'https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/auth/login/' + ssoProvider, data
                )

                global.setToken(response.data.data.access_token)

                // let now = new Date();
                // let date = now.getTime() + 24 * 3600 * 1000;
                // let accToken = {token: response.data.data.access_token, expired: new Date(date).getTime()}
                // window.localStorage.setItem('access_token', JSON.stringify(accToken));
                
                // navigate("/");

                checkSubscription(response.data.data.access_token);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchAPI();
    };

    // const checkInput = (email, password) => {
    //     setEnableButton(email !== "" && password !== "");
    // };

    const checkInput = () => {
        if (email !== "" && password !== "") {
            setEnableButton(true);
        } else {
            setEnableButton(false)
        }
    };

    const fetchAPI = async () => {
        if (!enableButton) return;
        setLoading(true);
        try {
            const response = await axios.post(
                'https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/auth/login', 
                { 
                    email, 
                    password 
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const token = response.data.data.access_token;

            global.email = email;
            global.password = password;
            global.setToken(token);
            window.localStorage.setItem("email", email);

            checkSubscription(token);

            navigate("/");
        } catch (error) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const checkSubscription = async (token) => {
        const fetchProfile = await axios.get(
            'https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/auth/profile',
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        // onSubscriptionSuccess(fetchProfile);
    }

    // const onSubscriptionSuccess = (res) => {
    //     let data = res.data.data;
    //     let permissions = null;
    //     for (let i = 0; i < data.company.subscriptions.length; i++) {
    //         let subs = data.company.subscriptions[i];
    //         if (subs.project_name === global.project_name) {
    //             permissions = subs.access_permissions;
    //         }
    //     }

    //     console.log("PERMISSIONS: ", permissions);
        
    //     if (permissions !== null) {
    //         localStorage.setItem("permissions", JSON.stringify(permissions));
    //         navigate("/");
    //     } else {
    //         onSubscriptionFailed("No Subscription Found");
    //     }
    // };
    
    // const onSubscriptionFailed = (err) => {
    //     console.log("subs failed: ", err);
    //     global.setToken(null);

    //     const { response } = err;
    //     if (response?.data?.status == 404 && response?.data?.message == "User does not have a subscription") {
    //         // navigate("/subsover");
    //     } else {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="w-full min-h-[100vh] flex justify-center items-center">
            <div className="rounded-[10px] flex flex-col justify-center items-center xxs:w-[90%] xxs:px-5 xxs:py-5 sm:w-[550px] sm:gap-3 sm:py-10 sm:px-[50px]" style={{ boxShadow: '0 2px 4px 0 #00000033' }}>
                <p className="text-[26px] font-bold">Login</p>

                {error && <p className="mt-5 text-center text-red-500 xxs:text-xs sm:text-base">{error}</p>}

                <form method="POST" className="w-full">
                    <div>
                        <label className="text-start" htmlFor="">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            className="h-7 mt-[5px] w-full rounded-[5px] border border-color-4 leading-6 ps-[10px] text-[12px]" 
                            value={email}
                            onChange={handleEmailChange} 
                            required 
                        />
                    </div>
                    <div className="mt-[10px]">
                        <label className="text-start" htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            className="h-7 mt-[5px] w-full rounded-[5px] border border-color-4 leading-6 ps-[10px] text-[12px]" 
                            value={password}
                            onChange={handlePasswordChange} 
                            required 
                        />
                    </div>

                    <div onClick={fetchAPI} className={`button mt-6 text-center w-full rounded-[5px] text-white py-1 px-[10px] bg-color-1 cursor-pointer`}>
                        {loading ?
                            <div className="spinner inline relative z-50">
                                <div className="spin-icon m-auto animate-spin xxs:text-xs xxs:w-4 xxs:h-4 lg:text-base lg:w-6 lg:h-6"></div>
                            </div>
                            : 
                            "Login"
                        }
                    </div>

                    <div className="flex justify-center items-center gap-3 my-3">
                        <div className="border border-black w-[150px] h-0"/> 
                        or 
                        <div className="border border-black w-[150px] h-0"/>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="relative w-full">
                            <div onClick={handleMicrosoftLogin} className="flex justify-center items-center w-full py-1 text-center border border-color-4 rounded-md cursor-pointer">
                                <img src={microsoft} alt="" className="xxs:w-3 xxs:mr-1 sm:w-5 sm:mr-2" />
                                Sign in with Microsoft
                            </div>
                        </div>
                        <div className="relative w-full">
                            <div onClick={handleGoogleLogin} className="flex justify-center items-center w-full py-1 text-center border border-color-4 rounded-md cursor-pointer">
                                <img src={google} alt="" className="xxs:w-3 xxs:mr-1 sm:w-5 sm:mr-2" />
                                Sign in with Google
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
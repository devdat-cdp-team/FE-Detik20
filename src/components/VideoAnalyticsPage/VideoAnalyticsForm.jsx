import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import global from "../../global";
import Search from "../Elements/Search/Search";

function VideoAnalyticsForm() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [videoFiles, setVideoFiles] = useState([]);
    const [result, setResult] = useState(null);
    const [progress, setprogress] = useState("0%");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [enableButton, setEnableButton] = useState(false);

    const outputIds = [];
    const [outputCurr, setOutputCurr] = useState({});

    const goToOutput = (ids) => {
        navigate('/result?id=[' + ids.join(',') + "]&dataType=videoAnalytics");
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            let temp = [...videoFiles];
            temp.push(file);
            setVideoFiles([...temp]);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const handleDeleteFile = (index) => {
        let temp = [...videoFiles]
        temp.splice(index, 1);
        setVideoFiles([...temp]);
    }

    const checkInput = () => {
        if (videoFiles !== null) {
            setEnableButton(true);
        } else {
            setEnableButton(false);
        }
    }

    useEffect(() => {
        checkInput();
    }, [videoFiles]);

    useEffect(() => {
        if (outputCurr.id) {
            console.log("output ids: ", outputCurr, outputIds)
            outputIds[outputCurr.index] = outputCurr.id;


            let pass = true;
             if (videoFiles.length == 0) {
                 pass = false;
             }
             for (let i = 0; i < outputIds?.length; i++) {
                 if (outputIds[i]) {
     
                 } else {
                     pass = false;
                 }
             }
             if (outputIds?.length !== videoFiles.length) {
                 pass = false;
             }
     
             if (pass) {
                 goToOutput(outputIds)
             }
        }
    }, [outputCurr])

    const fetchAPI = async () => {
        if (videoFiles?.length <= 0) {
            notify("Please complete the fields before proceeding.");
            return
        }
        setLoading(true);
        const outputIds = [];

        const checkOutput = () => {
            console.log("output ids2: ", outputIds)
            
            let pass = true;
             if (videoFiles.length == 0) {
                 pass = false;
             }
             for (let i = 0; i < outputIds?.length; i++) {
                 if (outputIds[i]) {
     
                 } else {
                     pass = false;
                 }
             }
             if (outputIds?.length !== videoFiles.length) {
                 pass = false;
             }
     
             if (pass) {
                 goToOutput(outputIds)
             }
        }


        for (let i = 0; i < videoFiles.length; i++) {

            const formData = new FormData();
            if (typeof videoFiles[i] == "string") {
                formData.append('video_url', videoFiles[i]);
            } else {
                formData.append('video', videoFiles[i]);
            }

            try {
                const response = await axios.post(
                    "https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis", 
                    formData,
                    {
                        headers: {
                            'Authorization': global.getToken(), 
                        }
                    }
                );
                const { id } = response.data.data;
                
                outputIds[i] = id;

                checkOutput();

                // goToOutput([id]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }
       

    }


    const notify = (message) => {
        toast.dismiss();
        toast.error(message);
    }

    return (
        <div className="bg-white rounded-lg xxs:w-full xxs:m-5 xxs:p-5 lg:m-10 lg:p-10 sm:w-3/4" 
            style={{ 
                color: '#333333', 
                // boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' 
            }}
        >
            <ToastContainer 
                position="top-center" 
                autoClose={60000} 
            />
            

            <form action="" method="POST">
                <div className="xxs:mt-5 xxs:mb-3 lg:mt-10 lg:mb-5">

                    <Search
                        onChoose={(e) => {
                            let temp = [...videoFiles];
                            temp.push(e.image);
                            setVideoFiles([...temp]);
                        }}
                        dropdownHeight={230}
                        endpoint={"/video-analysis/search"}
                        thumbnailType={"video"}
                        imageVar={"file_url"}
                        valueVar={"file_name"}
                        labelVar={"file_name"}
                    />

                    {/* <div className="flex justify-center items-center xxs:mb-3">
                        <div className="relative inline-block group">
                            <i className="bi bi-info-circle"></i>
                            <span className="w-[250px] text-white text-center p-3 bg-[#333333] rounded absolute z-10 bottom-[125%] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' }}>
                            Support .3gp, .avi, .flv, .mov, .mpg, .webm, .wmv file format
                            </span>
                        </div>
                    </div> */}

                    {/* Video File */}
                    {/* <p className="font-bold xxs:mb-2 xxs:text-xs lg:mb-3 lg:text-base">Video File</p> */}
                    <div 
                        className={`w-full border border-color-4 rounded-md xxs:py-10 lg:py-10 ${loading ? "" : "hover:border-2 hover:border-dashed hover:border-color-4 hover:cursor-pointer"}`} 
                        onDragOver={handleDragOver} 
                        onClick={() => inputRef.current.click()} 
                    >
                        <div className="flex justify-center items-center text-color-2">
                            <i className="bi bi-upload block xxs:text-3xl lg:text-6xl"></i>
                        </div>
                        <input 
                            type="file" 
                            name="file" 
                            onChange={handleFileUpload} 
                            ref={inputRef} 
                            className="w-full opacity-0 cursor-pointer hidden" 
                            multiple={true}
                            disabled={loading} 
                            accept="video/*"
                        />
                        <div className="flex justify-center items-center text-color-2">
                            <p className="xxs:mt-3 xxs:text-sm xs:text-base sm:mt-10 lg:text-xl"><span className="font-bold cursor-pointer">Choose a file</span> or drag it here</p>
                        </div>
                    </div>
                    <div className="mt-1.5">
                        <p className="text-color-3 xxs:text-sm xs:text-base">Supported format: .3gp, .avi, .flv, .mov, .mpg, .webm, .wmv</p>
                    </div>

                    {/* Video File Preview */}
                    
                    <div className="flex justify-center items-center gap-2">
                        {videoFiles.map((video, videoIndex) => {
                            return (
                                <div className="relative xxs:mt-5 lg:mt-10"
                                    style={{
                                        width: '300px',
                                        maxHeight: '300px',
                                    }}
                                >
                                    <video 
                                        src={typeof video == "string" ? video : URL.createObjectURL(video)} 
                                        controls 
                                        className="rounded-lg w-full"
                                        style={{
                                        }}
                                    />
                                    <div 
                                        onClick={() => {handleDeleteFile(videoIndex)}} 
                                        className="absolute bg-[#D62D20] text-white rounded-full cursor-pointer hover:bg-[#AB241A] xxs:top-1 xxs:right-1 xxs:px-2 xxs:py-1 xs:top-2 xs:right-2 xs:px-3 xs:py-2"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className={`flex justify-center xxs:mt-5 lg:mt-5`}>
                    <div onClick={() => {fetchAPI()}} className={`button text-center cursor-pointer xxs:w-full text-white bg-color-1 xxs:py-1 xxs:text-xs xxs:rounded-md lg:py-2 lg:text-base lg:rounded-lg ${enableButton ? "" : "bg-color-3 cursor-not-allowed"}`}>
                        {loading ?
                            <div className="spinner inline relative z-50">
                                <div className="spin-icon m-auto animate-spin xxs:text-xs xxs:w-4 xxs:h-4 lg:text-base lg:w-6 lg:h-6"></div>
                            </div>
                            : 
                            "Analyze Now"
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default VideoAnalyticsForm;
import { useContext, useEffect, useRef, useState } from "react"
import global from "../../../global";
import searchIcon from "../../../assets/icons/search-icon.svg";
import axios from "axios";

export default function Search({
    onChoose,
    endpoint,
    width,
    dropdownHeight, 
    thumbnailType = "image",
    imageVar,
    valueVar,
    labelVar,
    placeholder
}) {
    const inputRef = useRef();
    
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const [show, setShow] = useState(false);


    useEffect(() => {
        if (options.length) {
            inputRef?.current?.focus();
            setShow(true)
        }
    }, [options])

    const onSearch = async () => {
        inputRef.current.focus();
        if (endpoint && searchValue) {
            let data = {
                "keyword": searchValue
            };
            try {
                const response = await axios.post(
                    global.getApi() + endpoint, data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': global.getToken()
                        }
                    }
                )
                let res = response.data.data;

                let convert = res.map((e, index) => {
                    return {
                        ...e,
                        image: e[imageVar],
                        value: e[valueVar],
                        label: e[labelVar]
                    }
                })

                setOptions(convert)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    
    return (
        <div className="relative mb-5 w-full z-9"

            onFocus={() => {setShow(true)}}
            onBlur={() => {setShow(false)}}
        >
            <input 
                ref={inputRef}
                className="border border-color-4 rounded w-full h-8 pl-2 pr-10"
                style={{
                    fontSize: '16px',
                }}
                placeholder="Search"
                value={searchValue}
                onChange={(e) => {setSearchValue(e.target.value)}}
                onKeyDown={(e) => {
                    console.log(e.key);
                    if (e.key == "Enter") {
                        e.preventDefault();
                        onSearch();
                    }
                }}
                
            />
            <img className="absolute bg-color-1 h-8 p-1 cursor-pointer"
                style={{
                    borderRadius: '0 5px 5px 0',
                    right: 0,
                    top: 0,
                }}
                src={searchIcon}
                onClick={(onSearch)}
            />
            {show &&
                <div className="absolute border bg-white w-full rounded mt-2 z-2 overflow-auto"
                    style={{
                        maxHeight: dropdownHeight,
                    }}
                >
                    {options.map((e, index) => {
                        return (
                            <div className="hover:bg-color-1 hover:text-white p-2 flex gap-2 items-center h-[80px] cursor-pointer"
                                // onMouseDown={() => {
                                //     setShow(true);
                                //     inputRef.current.focus();
                                // }}
                                onMouseDown={() => {
                                    onChoose(e);
                                    setTimeout(() => {
                                        inputRef.current.focus();
                                    }, (10));
                                }}
                            >
                                <div className="w-[70px] flex justify-center items-center">
                                    {thumbnailType == "image" ?
                                        <img
                                            src={e.image}
                                            alt={e.image}
                                            style={{
                                                maxHeight: "70px",
                                                maxWidth: "70px",
                                                objectFit: 'contain'
                                            }}
                                        />
                                        :
                                    thumbnailType == "video" ?
                                        <video
                                            style={{
                                                maxHeight: "70px",
                                                maxWidth: "70px",
                                                objectFit: 'contain'
                                            }}
                                        >
                                            <source src={e.image}/>
                                        </video>
                                        :
                                    null
                                    }
                                </div>
                                {e.label}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
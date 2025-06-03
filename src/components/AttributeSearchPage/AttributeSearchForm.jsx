import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import global from "../../global";
import Toggle from "../Elements/Toggle";

function AttributeSearchForm() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [enableButton, setEnableButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const [maxPage, setMaxPage] = useState(20);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim() === "") {
                setSearchResult([]);
            } else {
                fetchVideoSearchAPI();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query])

    useEffect(() => {
        fetchVideoSearchAPI();
    }, [selectedFilter])

    useEffect(() => {
        const accessToken = JSON.parse(window.localStorage.getItem("access_token"));

        const fetchFilterOptions = async () => {
            if (!accessToken || !accessToken.token) {
                return;
            }

            try {
                const response = await axios.get(
                    'https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis/search/attributes/option',
                    {
                        headers: {
                            'Authorization': accessToken.token,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const newFilterOptions = response.data.data.map(item => ({
                    label: item.name, 
                    value: item.slug
                }));
                
                setFilterOptions(newFilterOptions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        
        fetchFilterOptions();
    }, [])

    const fetchVideoSearchAPI = async () => {
        if (!query.trim()) return;

        setSearchLoading(true);

        try {
            let response = await axios.post(
                "https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis/search/attributes", 
                {
                    "q": query, 
                    "filter_by": selectedFilter, 
                    "limit": maxPage
                }, 
                {
                    headers: {
                        'Authorization': global.getToken(), 
                    }
                }
            );

            console.log("Response", response.data.data);
            setSearchResult(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setSearchLoading(false);
        }
    };

    // const fetchVideoDetailsAPI = async (video_id) => {
    //     try {
    //         let response = await axios.get(
    //             "https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis/detail/" + video_id, 
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': global.getToken(), 
    //                 }
    //             }
    //         );
            
    //         const details = response.data.data;
    //         global.video_id = response.data.data.id;
    //         console.log(response.data.data.id);
    //         navigate("/attribute-search-result");
    //         // setSelectedItem(details);
            
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

    const handleQueryChange = (event) => {
        const { value } = event.target;
        setQuery(value);
        console.log(value);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            fetchVideoSearchAPI();
        }
    }

    const handleFilterChange = (selected) => {
        if (!selected || selected.length === 0) {
            setSelectedFilter(null);
        } else {
            const slugs = selected ? selected.map(option => option.value) : [];
            setSelectedFilter(slugs);
            console.log("Selected slugs:", slugs);
        }
    };

    const showDetails = (video) => {
        navigate("/result?id=[" + video.video_id + "]&dataType=attributeSearch");
    }

    return (
        <div>
            <div className="flex justify-center mb-[80px]">
                <div className="flex flex-col justify-center xxs:w-full xxs:mx-5 lg:mx-0 sm:w-3/4" style={{ maxWidth: "min(1536px, 90%)" }}>
                    <div className="xxs:mt-5 lg:mt-10">
                        <div
                            className="flex justify-end items-center"
                        >
                            <Toggle
                                width={40}
                                height={18}
                                backgroundColorOn={"#2D4059"}
                                backgroundColorOff={"#9F9F9F"}
                                toggleColor={"white"}
                                defaultOn={false}
                                onChange={(e) => {setAdvanceSearch(e)}} 
                            />
                        </div>
                        <div className="flex justify-between items-center xxs:mt-3 lg:mt-6">
                            <form action="" className="flex w-full mr-1.5">
                                <input 
                                    type="text" 
                                    className="w-full border border-color-4 xxs:py-1 xxs:text-xs xxs:rounded-l-md xxs:px-3 lg:py-1.5 lg:text-base" 
                                    value={query} 
                                    onChange={handleQueryChange} 
                                    onKeyDown={handleKeyDown} 
                                    placeholder="Search..."
                                    required 
                                />
                                <div 
                                    onClick={() => {fetchVideoSearchAPI()}} 
                                    className="button flex justify-center items-center px-3 rounded-r-lg bg-color-1 cursor-pointer"
                                >
                                    <i className="bi bi-search text-white"></i>
                                </div>
                            </form>
                            {advanceSearch && (
                                <Select 
                                    options={filterOptions} 
                                    value={selectedFilter === null ? null : filterOptions.filter(opt => selectedFilter.includes(opt.value))} 
                                    onChange={handleFilterChange}
                                    className="ml-1.5 xxs:w-[150px] lg:w-[250px]" 
                                    isMulti 
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="relative rounded-md xxs:mt-3 xxs:text-[10px] xs:text-xs sm:text-xs lg:mt-6 lg:text-sm " style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                        <table className="attribute-table min-w-full text-center text-color-2 overflow-y-auto">
                            <thead>
                                <tr
                                    className="w-full xxs:font-normal sm:font-bold text-white sticky"
                                    style={{
                                        backgroundColor: "#2D4059",
                                        top: 0,
                                    }}
                                >
                                    <th scope="col" className="xxs:py-1 sm:py-2 lg:py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="xxs:py-1 sm:py-2 lg:py-3">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchLoading ? (
                                    <td colSpan={2}>
                                        <div className="flex justify-center items-center xxs:py-1 sm:py-2 lg:py-3">
                                            <div className="loading-spinner inline relative z-50">
                                                <div className="spin-icon m-auto animate-spin xxs:text-xs xxs:w-4 xxs:h-4 lg:text-base lg:w-6 lg:h-6"></div>
                                            </div>
                                        </div>
                                    </td>
                                ) : (
                                    searchResult.length > 0 ? (
                                        searchResult.map((result, index) => {
                                            return (
                                                <tr className="w-full">
                                                    <td>
                                                        <p className="font-medium text-center text-gray-500 whitespace-pre-wrap break-words xxs:py-1 sm:py-2 lg:py-3">
                                                            {result.title}
                                                        </p>
                                                    </td>
                                                    <td className="underline text-[#0000EE] cursor-pointer xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3" onClick={() => {showDetails(result)}}>Details</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <td colSpan={2}>
                                            <p className="font-medium text-center text-gray-500 xxs:py-1 sm:py-2 lg:py-3"
                                                style={{
                                                    width: "min(1536px, calc(75vw - 3px))"
                                                }}
                                            >
                                                There are no data available
                                            </p>
                                        </td>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={`flex justify-center xxs:mt-5 lg:mt-5`}>
                        <div 
                            // onClick={() => {fetchCreativeSimilarityAPI(false)}} 
                            className={`button text-center xxs:w-full text-white xxs:py-1 xxs:text-xs xxs:rounded-md lg:py-2 lg:text-base lg:rounded-lg ${enableButton ? "bg-color-1 cursor-pointer" : "bg-color-3 cursor-not-allowed"}`}
                        >
                            {loading ?
                                <div className="spinner inline relative z-50">
                                    <div className="spin-icon m-auto animate-spin xxs:text-xs xxs:w-4 xxs:h-4 lg:text-base lg:w-6 lg:h-6"></div>
                                </div>
                                : 
                                "Analyze Now"
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttributeSearchForm;
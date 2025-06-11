import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../Elements/Carousel/Carousel";
import ShareRow from "../Elements/ShareRow/ShareRow";
import ReactPlayer from 'react-player/lazy'
import axios from "axios";
import global from "../../global";
import ProgressBar from "@ramonak/react-progress-bar";
import notificationSound from '../../assets/sound-effect/notification-sound.mp3';
import Navbar from "../Navbar";
import Footer from "../Footer";

import arrowDropdown from '../../assets/icons/arrow-dropdown.svg';
import ColoredTable from "../Elements/ColoredTable/ColoredTable";

const Tables = [
    // {title: "People", var: "video_faces", colomns: [{label: "People", var: "name"}, {label: "Appearance", var: "instances"}]},
    {title: "Label", var: "video_labels", colomns: [{label: "Label", var: "name"}, {label: "Language", var: "language"}, {label: "Appearance", var: "Instances"}]},
    {title: "Object", var: "video_objects", colomns: [{label: "Object", var: "displayName"}, {label: "Appearance", var: "instances"}]},
    {title: "Text", var: "video_ocr", colomns: [{label: "Text", var: "text"}, {label: "Language", var: "language"}, {label: "Confidence", var: "confidence"}, {label: "Appearance", var: "instances"}]},
    {title: "Brand", var: "video_brands", colomns: [{label: "Brand", var: "name"}, {label: "Confidence", var: "confidence"}, {label: "Appearance", var: "instances"}]},
    
    {title: "Topics", var: "video_topics", colomns: [{label: "Topics", var: "name"}, {label: "Language", var: "language"}, {label: "Confidence", var: "confidence"}, {label: "Appearance", var: "instances"}]},
    {title: "Sentiments", var: "video_sentiments", colomns: [{label: "Sentiments", var: "sentimentType"}, {label: "Confidence", var: "averageScore"}, {label: "Appearance", var: "instances"}]},
    {title: "Emotions", var: "video_emotions", colomns: [{label: "Emotion", var: "type"}, {label: "Appearance", var: "instances"}]},
    {title: "Subtitles", var: "video_transcript", colomns: [{label: "Subtitles", var: "text"}, {label: "Language", var: "language"}, {label: "Confidence", var: "confidence"}, {label: "Appearance", var: "instances"}]},
    {title: "Locations", var: "video_named_locations", colomns: [{label: "Locations", var: "name"}, {label: "Confidence", var: "confidence"}, {label: "Appearance", var: "instances"}]},

]

export default function Result({
    backToInput,
}) {

    const navigate = useNavigate();
    const playerRef = useRef();
    const videoLineRef = useRef();
    const [shareIds, setShareIds] = useState([]);
    const [data, setData] = useState({});
    const dataRef = useRef();
    const [currDataIndex, setCurrDataIndex] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const [currTime, setCurrTime] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const [useGuidelines, setUseGuidelines] = useState(false);

    const [timelineData, setTimelineData] = useState([]); 

    const [appearanceId, setAppearanceId] = useState(-1);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailIndex, setDetailIndex] = useState(0);

    const [isShowVideo, setIsShowVideo] = useState(false);

    let load = false;
    useEffect(() => {
        if (!load) {
            let ids = global.readSharedId();
            if (ids?.length > 0) {
                setShareIds([...ids]);
            } else {
                if (backToInput) {
                    backToInput();
                }
            }

        }
    }, [])

    useEffect(() => {
        const tempData = [];
        
        if (global.getUrlQuery("dataType") == "attributeSearch") {
            const getData = async (id) => {
                try {
                    let response = await axios.get(
                        "https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis/detail/" + id,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': global.getToken(),
                            }
                        }
                    );

                    let res = response.data.data;

                    if (res && typeof res.result === "object") {
                        res.result = JSON.stringify(res.result);
                    }

                    if (res.status === "done") {
                        res.result = JSON.parse(res.result);

                        setTimeout(() => {
                            setIsShowVideo(false);
                        }, 500);

                        var audio = new Audio(notificationSound);
                        audio.play();

                        if (dataRef.current?.[id]?.status === "in-progress") {
                            console.log("reload page1");
                            // window.location.reload();
                        }

                    } else if (res.status === "in-progress") {
                        if (dataRef.current?.[id]?.currProgress) {
                            let currProgress = parseFloat(dataRef.current?.[id]?.currProgress);
                            res.currProgress = ((parseFloat(res.progress.split("%")[0]) - currProgress) / 3 + currProgress);
                        } else {
                            let currProgress = parseInt(res.progress.split("%")[0]);
                            res.currProgress = currProgress;
                        }

                        setTimeout(() => {
                            getData(id);
                        }, 5000);
                    }

                    tempData[id] = res;
                    setData({ ...tempData });

                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    // setLoading(false);
                }
            }

            for (let i = 0; i < shareIds.length; i++) {
                let currId = shareIds[i];
                getData(currId);
            }
        } else if (global.getUrlQuery("dataType") == "videoAnalytics") {
            const getData = async (id) => {
                try {
                    let response = await axios.get(
                        "https://detik20-be-api.lemonfield-cfcc1761.southeastasia.azurecontainerapps.io/video-analysis/" + id, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': global.getToken(), 
                            }
                        }
                    );
                    // console.log(response)
                    let res = response.data.data;
                    if (res.status == "done") {
                        res.result = JSON.parse(res.result);
                        setTimeout(() => {
                            setIsShowVideo(false);
                        }, 500);
                        
                        var audio = new Audio(notificationSound);
                        audio.play();
        
                        if (dataRef.current?.[id]?.status == "in-progress") {
                            console.log("reload page1")
                            // window.location.reload();
                        }
        
                    } else if (res.status == "in-progress") {
                        if (dataRef.current?.[id]?.currProgress) {
                            let currProgress = parseFloat(dataRef.current?.[id]?.currProgress);
                            res.currProgress = ((parseFloat(res.progress.split("%")[0])- currProgress)/3 + currProgress)
                        } else {
                            let currProgress = parseInt(res.progress.split("%")[0]);
                            res.currProgress = currProgress;
                        }
        
                        // console.log("progress: ", res.currProgress, dataRef.current)
                        setTimeout(() => {
                            getData(id);
                        }, 5000);
                    } else {
        
                    }
        
                    tempData[id] = res;
                    setData({...tempData})
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    // setLoading(false);
                }
            }

            for (let i = 0; i < shareIds.length; i++) {
                let currId = shareIds[i];
                getData(currId);
            }
        }
    
    }, [shareIds])

    useEffect(() => {
        onChangeCurrTime();
    }, [currTime])

    useEffect(() => {
        dataRef.current = data;
        console.log("compvis data: ", data);
    }, [data])

    useEffect(() => {
        setAppearanceId(-1);
    }, [detailIndex])

    useEffect(() => {
        if (!isShowVideo) {
            setTimeout(() => {
                setIsShowVideo(true);
            }, 1000);
        }
    }, [isShowVideo])

    // useEffect(() => {
    //     if (data[shareIds[currDataIndex]]?.result) {
    //         let variable = Tables[detailIndex].var;

    //         let temp = data[shareIds[currDataIndex]]?.result?.[variable].map((e, index) => {
    //             let temp = [];
    //             for (let i = 0; i < e.instances.length; i++) {
    //                 let start = parseInt(e.instances[i].start.split(":")[0])*3600 + parseInt(e.instances[i].start.split(":")[1])*60 + parseFloat(e.instances[i].start.split(":")[2])
    //                 let end = parseInt(e.instances[i].end.split(":")[0])*3600 + parseInt(e.instances[i].end.split(":")[1])*60 + parseFloat(e.instances[i].end.split(":")[2])
    //                 temp.push({
    //                     id: e.id,
    //                     start: start,
    //                     end: end,
    //                     name: e.name,
    //                     object: e.displayName,
    //                     text: e.text
    //                 })
    //             }
    //             return temp;
    //         })
    //         setTimelineData([...temp])
    //     }
        
    // }, [data, currDataIndex, detailIndex])

    useEffect(() => {
        if (data[shareIds[currDataIndex]]?.result) {
            let variable = Tables[detailIndex].var;

            let temp = data[shareIds[currDataIndex]]?.result?.[variable]?.map((e, index) => {
                return e.instances.map((instance) => {
                    return {
                        id: e.id,
                        start: parseFloat(instance.start),
                        end: parseFloat(instance.end),
                        name: e.name || "",
                        object: e.displayName || "",
                        text: e.text || ""
                    };
                });
            });

            setTimelineData([...temp]);
        }
    }, [data, currDataIndex, detailIndex]);


   
    const onVideoReady = useCallback((player) => {
        console.log("video ready", player)
        if (!isPlayerReady) {
            playerRef.current = player;
            setIsPlayerReady(true);
            // const timeToStart = 1;
            // playerRef.current.seekTo(timeToStart, "seconds")
        }
    }, [isPlayerReady]);

    const onVideoProgress = (e) => {
        if (!isClicked) {
            let {loaded, loadedSeconds, played, playedSeconds} = e
            setCurrTime(playedSeconds)
        }
    }

    const onChangeCurrTime = () => {
        if (playerRef?.current && isPlayerReady && isClicked) {
            console.log("curr time: ", currTime, playerRef.current.getActivePlayer())
            playerRef.current.seekTo(currTime, "seconds")
        }
    }

    // const jumpTo = (label) => {
    //     let instances = label.instances;
    //     let i = 0;
    //     let id = label.id;
    //     console.log("jumpto: ", instances, id)
    //     if (appearanceId == -1) {
            
    //     } else {
    //         if (appearanceId.id == label.id) {
    //             if (label.instances.length - 1 > appearanceId.index) {
    //                 i = appearanceId.index+1;
    //             } else {
    //                 i = 0;
    //             }
    //         } else {
    //             id = label.id;
    //         }
    //     }
    //     setAppearanceId({
    //         id: id,
    //         index: i,
    //     })

    //     let start = parseInt(instances[i].start.split(":")[0])*3600 + parseInt(instances[i].start.split(":")[1])*60 + parseFloat(instances[i].start.split(":")[2])
    //     if (playerRef?.current && isPlayerReady) {
    //         playerRef.current.seekTo(start, "seconds")
    //     }
    // }

    const jumpTo = (label) => {
        let instances = label.instances;
        let i = 0;
        let id = label.id;

        if (appearanceId == -1) {
            
        } else {
            if (appearanceId.id == label.id) {
                if (label.instances.length - 1 > appearanceId.index) {
                    i = appearanceId.index + 1;
                } else {
                    i = 0;
                }
            } else {
                id = label.id;
            }
        }

        setAppearanceId({
            id: id,
            index: i,
        });

        let start = parseFloat(instances[i].start);

        if (playerRef?.current && isPlayerReady) {
            playerRef.current.seekTo(start, "seconds");
        }
    };


    const onClickRight = () => {
        if (currDataIndex < shareIds.length - 1) {
            setCurrDataIndex(currDataIndex+1);
        } else {
            setCurrDataIndex(0);
        }
    }

    
    const onClickLeft = () => {
        if (currDataIndex > 0) {
            setCurrDataIndex(currDataIndex-1);
        } else {
            setCurrDataIndex(shareIds.length-1);
        }
    }

    const getDataTable = (data, tabIndex) => {
        if (data) {

            let temp = data[Tables[tabIndex].var].map((row, rowIndex) => {
                let tempRow = {}
                for (let i = 0; i < Tables[tabIndex].colomns.length; i++) {
                    let col = Tables[tabIndex].colomns[i];
                    tempRow[col.label] = row[col.var];
                }

                return tempRow
            });
            return temp;
        } else {
            return [];
        }
    }

    return (
        <>
            <Navbar />
            <div className="py-5">
                <div
                    className="mb-10 py-5 px-5 rounded-lg flex gap-5 flex-wrap justify-center"
                    style={{
                        // boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                    }}
                >

                    <div 
                        style={{
                            minWidth: '460px'
                        }}
                    >
                        
                        <div className="flex gap-2 items-center justify-between">
                            <div className="cursor-pointer"
                                onClick={onClickLeft}
                            >
                                <img
                                    src={arrowDropdown}
                                    style={{
                                        transform: 'rotate(90deg)'
                                    }}
                                />
                            </div>
                            <div 
                                className="flex flex-col items-center"
                            >
                                <div 
                                    className="flex flex-col gap-2 items-center"
                                    style={{width:"min-content"}}
                                >
                                    <div 
                                        className="text-center cursor-pointer"
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            maxWidth: 500,
                                            wordBreak: 'break-all',
                                            whiteSpace: 'wrap'
                                        }}
                                        onClick={() => {setIsShowVideo(false)}}
                                    >
                                        {data[shareIds[currDataIndex]]?.result?.video_name}
                                    </div>
                                    
                                    {data[shareIds[currDataIndex]]?.result && isShowVideo?
                                        <ReactPlayer 
                                            ref={isShowVideo? playerRef : null}
                                            url={data[shareIds[currDataIndex]]?.result?.video_url?? null} 
                                            controls={true}
                                            progressInterval={100}
                                            onProgress={onVideoProgress}
                                            onReady={onVideoReady}
                                            width={500}
                                            height={"min-content"}
                                        />
                                        :
                                        <div 
                                            className="flex items-center justify-center"
                                            style={{
                                                width: 500,
                                                height: 300
                                            }}
                                        >
                                            {data[shareIds[currDataIndex]]?.status=="in-progress" ? 
                                                <div 
                                                    className=""
                                                >
                                                    <ProgressBar
                                                        completed={data[shareIds[currDataIndex]]?.currProgress}
                                                        maxCompleted={100}
                                                        width="500px"
                                                        customLabel={data[shareIds[currDataIndex]]?.currProgress.toFixed(2) + "%"}
                                                    />
                                                    <div
                                                        className="text-center"
                                                    >
                                                        {data[shareIds[currDataIndex]]?.currProgress.toFixed(2)}%
                                                    </div>
                                                </div>
                                                :
                                                data[shareIds[currDataIndex]]?.status=="failed" ?
                                                    <div>
                                                        The Video Analysis process has failed
                                                    </div>
                                                :
                                                
                                                "loading..."
                                            }
                                        </div>
                                    }
                                    
                                    <div 
                                        className="relative w-full h-10"
                                        style={{
                                            border: '1px solid black',
                                            cursor: 'ew-resize'
                                        }}
                                    >
                                        
                                        {timelineData?.map((e, eIndex) => {
                                            return e.map((timeline, timeIndex) => {
                                                return (
                                                    <div 
                                                        className="absolute"
                                                        style={{
                                                            backgroundColor: global.colors[eIndex], 
                                                            left: `${timeline.start/playerRef?.current?.getDuration() * 100}%`,
                                                            width: `${(timeline.end - timeline.start)/playerRef?.current?.getDuration() * 100}%`,
                                                            height: '100%',
                                                            zIndex: 0,
                                                        }}
                                                    >
                
                                                    </div>
                                                )
                                            })
                                            
                                        })}
                                        <div
                                            className="absolute"
                                            ref={videoLineRef}
                                            style={{
                                                height: '120%',
                                                border: '1px solid black',
                                                width: 0,
                                                left: `${currTime/playerRef?.current?.getDuration() * 100}%`,
                                                zIndex: 0
                                            }}
                                        />
                                        <div
                                            className="absolute w-full h-full"
                                            style={{
                                                zIndex: 10
                                            }}
                                            onMouseDown={(e) => {setIsClicked(true)}}
                                            onMouseMove={isClicked ? (event) => {
                                                const bounds = event.target.getBoundingClientRect();
                                                const posX = event.clientX - bounds.left;
                                                setCurrTime(posX/event.target.offsetWidth * playerRef?.current?.getDuration())
                                            } : null}
                                            onClick={(event) => {
                                                const bounds = event.target.getBoundingClientRect();
                                                const posX = event.clientX - bounds.left;
                                                
                                                setCurrTime(posX/event.target.offsetWidth * playerRef?.current?.getDuration())
                                                setTimeout(() => {
                                                    setIsClicked(false)
                                                }, 50);
                                            }}
                                            // onMouseLeave={(e) => {console.log("leave");setIsClicked(false)}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="cursor-pointer"
                                onClick={onClickRight}
                            >
                                <img
                                    src={arrowDropdown}
                                    style={{
                                        transform: 'rotate(-90deg)'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center mt-5">
                            <a className="xxs:mr-1 lg:mr-2.5" onClick={() => {navigate("/video-analysis")}}>
                                <div className="button text-center cursor-pointer text-white bg-color-1 xxs:py-1 xxs:text-xs xxs:rounded lg:py-2 px-10 lg:text-base lg:rounded-lg whitespace-nowrap">
                                    Back
                                </div>
                            </a>
                            <ShareRow
                                url={window.location.origin + "/result?id=[" + shareIds.join(",") + "]&dataType=videoAnalytics"}
                                tool={"Video Analytics"}
                            />
                        </div>
                    </div>

                    <div className="w-[600px]">

                        <div className="flex gap-5 flex-wrap mb-5">
                            {Tables.map((tab, tabIndex) => {
                                return (
                                    <div className={`${tabIndex == detailIndex? "bg-color-1 text-white" : "bg-color-white"} hover:bg-color-1 hover:text-white cursor-pointer py-1 rounded w-[102px] text-center`}
                                        style={{
                                            border: '1px solid #2D4059',
                                        }}
                                        onClick={() => {setDetailIndex(tabIndex)}}
                                    >
                                        {tab.title}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {getDataTable(data?.[shareIds[currDataIndex]]?.result, detailIndex).length > 0 ?
                        <ColoredTable
                            data={getDataTable(data?.[shareIds[currDataIndex]]?.result, detailIndex)}
                            tableWidth={600}
                            tableHeight={"calc(100vh - 500px)"}
                            rowPerPage={Infinity}
                            cellBackgroundColor={["#FFFFFF", "#F5F5F5"]}
                            cellFontSize={"14px"}
                            titleFontSize={"14px"}
                            useTitleTranslation={true}
                            customCellVisual={{
                                "Appearance": (value , cellKey, row, rowIndex) => {
                                    // console.log("data654: ", data?.[shareIds[currDataIndex]]?.result)
                                    return (
                                        <div className="flex justify-center w-full">
                                            <div 
                                                className="button text-center cursor-pointer xxs:w-20 text-white bg-color-1 xxs:py-1 xxs:rounded lg:rounded-lg"
                                                onClick={() => {
                                                    jumpTo(data?.[shareIds[currDataIndex]]?.result?.[Tables[detailIndex].var][rowIndex])
                                                }}
                                            >
                                                {`->`}
                                            </div>
                                        </div>
                                    )
                                },
                                "Language": (value , cellKey, row, rowIndex) => {
                                    // console.log("data654: ", data?.[shareIds[currDataIndex]]?.result)
                                    return (
                                        <div className="flex justify-center w-full">
                                            {value}
                                        </div>
                                    )
                                },
                                "Confidence": (value , cellKey, row, rowIndex) => {
                                    // console.log("data654: ", data?.[shareIds[currDataIndex]]?.result)
                                    return (
                                        <div className="flex justify-center w-full">
                                            {(value*100).toFixed(2)}%
                                        </div>
                                    )
                                },
                                "Average Score": (value , cellKey, row, rowIndex) => {
                                    // console.log("data654: ", data?.[shareIds[currDataIndex]]?.result)
                                    return (
                                        <div className="flex justify-center w-full">
                                            {(value*100).toFixed(2)}%
                                        </div>
                                    )
                                }
                            }}
                            disableSort={true}
                        />
                        :
                        <div>
                            No {Tables[detailIndex].title} detected
                        </div>
                        }
                    </div>
                </div>

            </div>     
            {/* <Footer position="lg:fixed" /> */}
        </>
    )
}


function Details({
    detailIndex,
    data
}) {

    useEffect(() => {
        console.log("data 36: ", data)
    }, [data])

    switch(detailIndex) {
        case 0:
            return (
                <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                    <table className="table-auto min-w-full text-center text-color-2">
                        <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                            <tr>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Video Width</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Video Height</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Video Duration</p>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                            
                        >
                            <tr  className="table table-fixed w-full">
                                <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    {data?.result?.width}px
                                </td>
                                <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    {data?.result?.height}px
                                </td>
                                <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    {data?.result?.video_duration} seconds
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            )
        case 1:
            return (
                <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                    <table className="table-auto min-w-full text-center text-color-2">
                        <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                            <tr>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Text</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Language</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Confidence</p>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                            
                        >
                            {data?.result?.video_transcript?.map((label, index) => {
                                return (
                                    <tr  className="table table-fixed w-full">
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {label.text}
                                        </td>
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {label.language}
                                        </td>
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        {(label.confidence*100).toFixed(2)}%
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            )
        case 2:
            return (
                <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                    <table className="table-auto min-w-full text-center text-color-2">
                        <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                            <tr>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Topic</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Language</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Confidence</p>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                            
                        >
                            {data?.result?.video_topics?.map((label, index) => {
                                return (
                                    <tr  className="table table-fixed w-full">
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {label.name}
                                        </td>
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {label.language}
                                        </td>
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        {(label.confidence*100).toFixed(2)}%
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            )
        case 3:
            return (
                <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                    <table className="table-auto min-w-full text-center text-color-2">
                        <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                            <tr>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Location</p>
                                </th>
                                <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                    <p>Confidence</p>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                            
                        >
                            {data?.result?.video_named_locations?.map((label, index) => {
                                return (
                                    <tr  className="table table-fixed w-full">
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {label.name}
                                        </td>
                                        <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {(label.confidence*100).toFixed(2)}%
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            )
            case 4:
                return (
                    <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                        <table className="table-auto min-w-full text-center text-color-2">
                            <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                                <tr>
                                    <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Sentiment</p>
                                    </th>
                                    <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Average Score</p>
                                    </th>
                                    {/* <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Confidence</p>
                                    </th> */}
                                </tr>
                            </thead>
    
                            <tbody
                                className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                                
                            >
                                {data?.result?.video_sentiments?.map((label, index) => {
                                    return (
                                        <tr  className="table table-fixed w-full">
                                            <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                                {label.sentimentType}
                                            </td>
                                            <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                                {label.averageScore}
                                            </td>
                                            {/* <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {(label.confidence*100).toFixed(2)}%
                                            </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
    
                        </table>
                    </div>
                )
            case 5:
                return (
                    <div className="relative overflow-x-auto rounded-md xxs:text-[10px] xs:text-xs sm:text-xs lg:text-sm" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                        <table className="table-auto min-w-full text-center text-color-2">
                            <thead className="table table-fixed w-full xxs:font-normal sm:font-bold text-white bg-color-1">
                                <tr>
                                    <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Emotion</p>
                                    </th>
                                    {/* <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Average Score</p>
                                    </th> */}
                                    {/* <th scope="col" className="xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                        <p>Confidence</p>
                                    </th> */}
                                </tr>
                            </thead>

                            <tbody
                                className="computer-vision-table block overflow-y-scroll xxs:max-h-[15em] lg:max-h-[20em] text-start"
                                
                            >
                                {data?.result?.video_emotions?.map((label, index) => {
                                    return (
                                        <tr  className="table table-fixed w-full">
                                            <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                                {label.type}
                                            </td>
                                            {/* <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                                {label.averageScore}
                                            </td> */}
                                            {/* <td className="text-center xxs:px-1 xxs:py-1 sm:px-3 sm:py-2 lg:px-6 lg:py-3">
                                            {(label.confidence*100).toFixed(2)}%
                                            </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    </div>
                )
    }

}
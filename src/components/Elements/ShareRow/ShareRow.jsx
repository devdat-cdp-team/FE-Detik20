import { EmailIcon, EmailShareButton, FacebookShareButton, LineIcon, LineShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import styles from './ShareRow.module.css';
import html2canvas from "html2canvas";
import { ToastContainer, toast } from 'react-toastify';
import { useContext, useState } from 'react';

export default function ShareRow({url, style, tool, screenshotTarget}) {

    const template = 
`Hey there,

Results from ${tool} are out now!
    
Check it out by opening the link below!

`
    
    const template2 =
`

If you still don't gain access
You need to get the Username and Password from your Company Admin
`


    const buttonStyle = {
        backgroundColor: '#ffffff',
        border: '#000000 1px solid',
        borderRadius: '1000px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px'
    }

    const iconSize = 30

    const notify = () => toast("Url Copied to Clipboard!");

    const [isOpen, setIsOpen] = useState(false);

    const screenshot = () => {
        // const screenshotTargetx = document.body;
        html2canvas(screenshotTarget, {scrollY: -window.scrollY}).then(canvas => {
            // to image as png use below line
            const base64image = canvas.toDataURL("image/png");
            // show the image in window use below line
            // window.location.href = 'data:application/' + base64image;
            
            // screenshot appended to the body as canvas
            // document.body.appendChild(canvas);  
            let dataURL = canvas.toDataURL();  
            // to print the screenshot in console use below line
            // console.log(dataURL);
            
            // following line is optional and it is to save the screenshot
            // on the server side. It initiates an ajax call
            // window.open(base64image); 

            var a = document.createElement("a"); //Create <a>
            a.href =  base64image; //Image Base64 Goes here
            a.download = "Image.png"; //File name Here
            a.click(); //Downloaded file
        });  
    }

    const onClickCopyLink = () => {
        navigator.clipboard.writeText(url);
        notify();
    }

    return (
        <div className={styles.container} style={{...style}}>
            <div className='cursor-pointer px-10 py-[7px] relative'
                style={{
                    border: "1px solid black",
                    borderRadius: '5px',
                    
                }}
                onClick={() => {setIsOpen(!isOpen)}}
            >
                Share
                <div
                    className='absolute ml-2 px-2 py-2'
                    style={{
                        backgroundColor: 'white',
                        width: '200px',
                        left: '100%',
                        top: '0px',
                        border: '1px solid black',
                        borderRadius: 5,
                        display: isOpen? 'flex' :'none',
                        flexDirection: 'column',
                        gap: 10,
                        zIndex: 10,
                    }}
                >
                    Share To
                    <div
                        className='flex gap-4'
                    >
                        <EmailShareButton 
                            // url={url}
                            url={template + url + template2}
                            style={buttonStyle}
                            // onClick={screenshot}
                        >
                            <EmailIcon 
                                size={iconSize}
                                round={true}
                            />
                        </EmailShareButton>

                        <WhatsappShareButton 
                            // url={url}
                            url={template + url + template2}
                            style={buttonStyle}
                        >
                            <WhatsappIcon 
                                size={iconSize}
                                round={true}
                            />
                        </WhatsappShareButton>


                        <TelegramShareButton 
                            // url={url}
                            url={template + url + template2}
                            style={buttonStyle}
                        >
                            <TelegramIcon 
                                size={iconSize}
                                round={true}
                            />
                        </TelegramShareButton>
                        <div
                            style={{
                                ...buttonStyle,
                                // backgroundColor: "var(--blue)",
                                // padding: '3px',
                                width: 'min-content',
                                cursor: 'pointer',
                            }}
                            onClick={onClickCopyLink}
                        >
                            <i className="bi bi-link-45deg text-white bg-[#333333] rounded-full w-8 h-8 py-1 px-2"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share result to:
            <EmailShareButton 
                // url={url}
                url={template + url + template2}
                style={buttonStyle}
                // onClick={screenshot}
            >
                <EmailIcon 
                    size={iconSize}
                    round={true}
                />
            </EmailShareButton>

            <WhatsappShareButton 
                // url={url}
                url={template + url + template2}
                style={buttonStyle}
            >
                <WhatsappIcon 
                    size={iconSize}
                    round={true}
                />
            </WhatsappShareButton>


            <TelegramShareButton 
                // url={url}
                url={template + url + template2}
                style={buttonStyle}
            >
                <TelegramIcon 
                    size={iconSize}
                    round={true}
                />
            </TelegramShareButton>
            <div
                style={{
                    ...buttonStyle,
                    // backgroundColor: "var(--blue)",
                    // padding: '3px',
                    cursor: 'pointer',
                }}
                onClick={onClickCopyLink}
            >
                <i className="bi bi-link-45deg text-white bg-[#333333] rounded-full w-8 h-8 py-1 px-2"></i>
            </div> */}
        </div>
    )
}
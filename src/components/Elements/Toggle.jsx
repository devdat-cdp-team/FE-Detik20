import { useEffect, useState } from "react";

function Toggle({
    width,
    height,
    backgroundColorOn,
    backgroundColorOff,
    toggleColor,
    defaultOn=false,
    onChange,
}) {

    const [isOn, setIsOn] = useState(defaultOn);

    useEffect(() => {
        if (onChange) {
            onChange(isOn)
        }
    }, [isOn])

    return (
        <div 
            className="rounded-full flex cursor-pointer"
            style={{
                backgroundColor: isOn? backgroundColorOn : backgroundColorOff,
                width: width,
                height: height,
                transition: '0.3s',
                padding: 2,
            }}
            onClick={() => {setIsOn(!isOn)}}
        >
            <div 
                className="rounded-full"
                style={{
                    marginLeft: isOn? width-4-(height-4) : 0,
                    backgroundColor: toggleColor,
                    width: height-4,
                    height: height-4,
                    transition: '0.3s'
                }}
                
            />
        </div>
    )
}

export default Toggle;
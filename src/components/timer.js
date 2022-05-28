import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MaxTime } from '../gameConstants';

function Timer(props) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            if (props.startTime === undefined && !props.isRunning)
                return 0;
            const msElapsed = +new Date() - +props.startTime;
            return Math.min(MaxTime * 10, Math.floor(msElapsed / 100));
        };
        let timer;
        if (props.isRunning) {
            timer=setTimeout(() => {
                setTime(updateTime());
            }, 100);
        } else
            setTime(updateTime());
        // Clear timeout if the component is unmounted
        return () => {
            if (timer !== undefined)
                clearTimeout(timer);
        };
    }, [props.isRunning, props.startTime]);

    return (
    <div className={props.className}>
        {(time/10).toLocaleString(undefined, { minimumFractionDigits: 1}) }
    </div>
    );
}

Timer.defaultProps = {
    isRunning: false,
    startTime: undefined
}

Timer.propTypes = {
    isRunning: propTypes.bool,
    startTime: propTypes.instanceOf(Date)
}

export default Timer;

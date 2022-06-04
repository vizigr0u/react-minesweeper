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
            timer=setInterval(() => {
                setTime(updateTime());
            }, 100);
        } else
            setTime(updateTime());
        // Clear timeout if the component is unmounted
        return () => {
            if (timer !== undefined)
                clearInterval(timer);
        };
    }, [props.isRunning, props.startTime]);

    function pad(num, size) {
        var s = "0000" + num;
        return s.substring(s.length-size);
    }

    return (
    <div className={props.className}>
        <span className="seven-segment-background">888.8</span>
        <span className="timer-text">
            {pad((time/10).toLocaleString(undefined, { minimumFractionDigits: 1}),5) }
        </span>
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

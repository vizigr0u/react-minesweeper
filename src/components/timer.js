import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MaxTime } from '../gameConstants';

function Timer(props) {
    const [time, setTime] = useState(updateTime());

    useEffect(() => {
        let timer;
        if (props.isRunning) {
            timer=setTimeout(() => {
            setTime(updateTime());
            }, 1000);
        }
        // Clear timeout if the component is unmounted
        return () => {
            if (timer !== undefined)
                clearTimeout(timer); }
      });

      function updateTime() {
          if (props.startTime === undefined && !props.isRunning)
            return 0;
          const msElapsed = +new Date() - +props.startTime;
          return Math.min(MaxTime, Math.floor(msElapsed / 1000));
      }

      return (
      <div className={props.className}>
          {time}
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

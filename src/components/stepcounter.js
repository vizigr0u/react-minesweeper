const StepCounter = (props) => {
    const message = (props.maxSteps === 0) ? "" : "Steps: ";
    const counter = <input type="range" min="0" max={props.maxSteps} value={props.currentStep} onChange={props.onChange} />;
    return (
        <div id="stepcounter">
            {message}
            {(props.maxSteps === 0) ? "" : counter}
        </div>
    );
}

export default StepCounter;

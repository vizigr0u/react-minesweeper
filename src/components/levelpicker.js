import React from 'react';
import { Levels } from '../gameConstants'

const LevelPicker = (props) => {
    const levels = [
        {
            name: 'Easy',
            level: Levels.Easy
        },
        {
            name: 'Medium',
            level: Levels.Medium
        },
        {
            name: 'Expert',
            level: Levels.Expert
        },
    ]
    return (
        <div>
            {levels.map(l => {
                return (
                    <button onClick={() => props.onChangeLevel(l.level)} key={l.name}>
                        {l.name}
                    </button>
                )}
            )}
        </div>
    );
}

export default LevelPicker;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Levels } from './gameConstants';
import Game from './components/game';

// ========================================

ReactDOM.render(
<Game level={Levels.Easy} />,
document.getElementById('root')
);

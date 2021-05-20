import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Levels } from './gameConstants';
import Game from './components/game';

// ========================================

ReactDOM.render(
(
<div id="content">
    <Game level={Levels.Easy} />
    <div id="footer">
        <a href="https://github.com/vizigr0u/react-minesweeper">
            <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" />
            Clone on github
        </a>
    </div>
</div>),
document.getElementById('root')
);

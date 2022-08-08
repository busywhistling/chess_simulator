import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import { Chess } from 'chess.js';

import Chessboard from './features/chessboard/Chessboard'
import { selectHistory, resetChessboard, loadPGN, loadGame, selectMoves } from './features/chessboard/chessboardSlice';

import './App.css'
import { current } from '@reduxjs/toolkit';

export default function App() {
    const hist = useSelector(selectHistory);

    // const to store 0 or 1 depending on whether transcription or recording feature is selected
    const [selectedFeature, setSelectedFeature] = useState(0);

    const [notation, setNotation] = useState('');
    const [isWrongNotation, setIsWrongNotation] = useState(false);
    const [currentSelected, setCurrentSelected] = useState(hist.length - 1)

    return (
        <div className="App">
            <LeftSidebar selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} setNotation={setNotation} setIsWrongNotation={setIsWrongNotation} setCurrentSelected={setCurrentSelected} />
            <Chessboard inputAllowed={selectedFeature === 0} />
            <RightSidebar selectedFeature={selectedFeature} notation={notation} setNotation={setNotation} isWrongNotation={isWrongNotation} setIsWrongNotation={setIsWrongNotation} currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} />
        </div>
    )
}

interface LeftSidebarProps {
    selectedFeature: number
    setSelectedFeature: any
    setNotation: any
    setIsWrongNotation: any
    setCurrentSelected: any
}

function LeftSidebar({ selectedFeature, setSelectedFeature, setNotation, setIsWrongNotation, setCurrentSelected }: LeftSidebarProps) {
    const dispatch = useDispatch();
    return (
        <div className='leftSidebar'>
            <div className='features'>
                <h1>Chess game simulator</h1>
                <p>Select the feature you want to use below.</p>
                <div className='options'>
                    <div className={'option ' + (selectedFeature === 0 ? 'selected-feature' : '')} onClick={() => { if (selectedFeature === 1) { setSelectedFeature(1 - selectedFeature); dispatch(resetChessboard()); setNotation(''); setIsWrongNotation(false); setCurrentSelected(0); } }}>
                        <h3>Transcribe moves to algebraic notation</h3>
                        {/* Here is the description */}
                        <p>Standard Algebraic Notation (SAN) is a method for recording and
                            describing moves in a game of chess, recognized by the
                            international chess governing body FIDE. This app lets you play a
                            game on the adjacent chessboard, and obtain the corresponding
                            notation at the right.</p>
                    </div>
                    <div className={'option ' + (selectedFeature === 1 ? 'selected-feature' : '')} onClick={() => { if (selectedFeature === 0) { setSelectedFeature(1 - selectedFeature); dispatch(resetChessboard()) } }}>
                        <h3>Play recorded notation of a game</h3>
                        <p>This feature lets you input the notation for a given game and
                            walk through it using the controls provided on the right. Programmed
                            logic makes sure you can only input valid game notations.</p>
                    </div>
                </div>
            </div>

            <Credits />
        </div >
    )
}

interface RightSidebarProps {
    selectedFeature: number
    notation: string
    setNotation: any
    isWrongNotation: boolean
    setIsWrongNotation: any
    currentSelected: number // holds the position of the current move being observed
    setCurrentSelected: any
}

function RightSidebar({ selectedFeature, notation, setNotation, isWrongNotation, setIsWrongNotation, currentSelected, setCurrentSelected }: RightSidebarProps) {
    let stphistory: string[] = [];
    // setCurrentSelected(hist.length - 1);
    const dispatch = useDispatch();
    function testChessnotation(notat: string) {
        console.log(stphistory[currentSelected])
        let chess = new Chess();
        if (chess.load_pgn(notat)) {
            setIsWrongNotation(false);
            dispatch(loadPGN(notat));
        }
        else
            setIsWrongNotation(true);
    }
    function interactiveHistory() {
        let newchess = new Chess();
        newchess.load_pgn(notation)
        let hist = newchess.history()
        stphistory = []
        let last = '';
        let list = []
        for (let i = 0; i < hist.length; i++) {
            last = last + hist[i] + ' ';
            stphistory.push(last)
            // FIXME: setCurrentSelected doesn't seem to be setting the currentlySelected variable immediately and requires two clicks.
            list.push(<div key={i} className={(currentSelected === i) ? 'current' : ''} onClick={() => { setCurrentSelected(i); testChessnotation(stphistory[currentSelected]); }}>{hist[i]}</div>);
        }
        return <div className='interactive-history'>{list}</div>
    }
    return (
        <div className='rightSidebar'>
            {selectedFeature === 0 ? (
                <div>
                    <p>Below you can find the algebraic notation incrementally being
                        added for your moves. Promotions are not handled because it requires
                        user input to select which piece you want.</p>
                    <div className='chess-moves'>{parse(useSelector(selectMoves))}</div></div>)
                : (<div>
                    <fieldset>
                        <legend>Enter SAN</legend>
                        <p>Please enter your moves in algebraic notation in the input box
                            below. Click on submit once you've done so.</p>
                        <textarea id="san-input" rows={10} cols={54} name="SAN input" placeholder="Enter notation here" required onChange={(e) => { setNotation(e.target.value); setIsWrongNotation(false) }} >
                        </textarea><br />
                        <button onClick={() => testChessnotation(notation)}>Submit</button>
                        {(notation && isWrongNotation) && <div className='warning'>Your entered input is not valid.</div>}
                    </fieldset>
                    <p>Here are your moves. Double click on the one you want to jump to.</p>
                    {interactiveHistory()}
                    {/* {currentSelected} <br />
                    Current step history is <br /> {stphistory[currentSelected]}
                    {setCurrentSelected(2)} <br />
                    {load_pgn(stphistory[currentSelected])} */}
                </div >)
            }
        </div >
    )
}

function Credits() {
    return (
        <div className='Credits'>
            Made by <a href="https://paramjit.org" target="_blank">Paramjit</a> (see
            the rest of the <a href='https://paramjit.org/portfolio' target="_blank">portfolio</a>)<br />
            Using the headless <a href="https://github.com/jhlywa/chess.js">chess.js</a> library for the chess logic <br />
            Using <a href="https://reactjs.org/">React</a>, <a href="https://redux.js.org">Redux</a>, HTML, CSS, <a href="https://www.npmjs.com/">npm</a> &amp; <a href="https://vitejs.dev/">vite</a>
        </div >
    )
}

import * as React from "react";
import * as ReactDOM from "react-dom";
import { useState } from "react";
import "./index.css";

let Square = (props: {
  value: string
  onClick: () => void
}) => {
  return <>
    <button
      className = "square"
      onClick = {props.onClick}
    >
      {props.value}
    </button>
  </>
};

let Board = (props: {
  squares: string []
  onClick: (i: number) => void
}) => {
  let renderSquare = (i: number) =>
    <Square
      value = {props.squares [i]}
      onClick = {() => props.onClick (i)}
    />;

  return <>
    <div>
      <div className="board-row">
        {renderSquare (0)}
        {renderSquare (1)}
        {renderSquare (2)}
      </div>
      <div className="board-row">
        {renderSquare (3)}
        {renderSquare (4)}
        {renderSquare (5)}
      </div>
      <div className="board-row">
        {renderSquare (6)}
        {renderSquare (7)}
        {renderSquare (8)}
      </div>
    </div>
  </>
};

let Game = () => {
  let init_squares = [
    "", "", "",
    "", "", "",
    "", "", "",
  ];

  let [history, setHistory] = useState ([
    { squares: init_squares }
  ]);

  let [next, setNext] = useState ("X");

  let [stepNumber, setStepNumber] = useState (0);

  let handleClick = (i: number) => {
    let h = history.slice (0, stepNumber + 1);
    let current = h [h.length - 1];
    let s = current.squares.slice ();
    if (calculateWinner (s) || s [i]) {
      return;
    }
    s [i] = next;
    if (next == "X") {
      setNext ("O");
    } else {
      setNext ("X");
    }
    setHistory (h.concat ([
      { squares: s }
    ]));
    setStepNumber (h.length);
  };

  let moves = history.map ((step, move) => {
    let desc;
    if (move !== 0) {
      desc = "Go to move #" + move;
    } else {
      desc = "Go to game start";
    }

    return <li key = {move}>
      <button onClick={() => jumpTo (move)}>
        {desc}
      </button>
    </li>
  });
  let jumpTo = (step: number) => {
    setStepNumber (step);
    if ((step % 2) === 0) {
      setNext ("X");
    } else {
      setNext ("O");
    }
  };

  let current = history [stepNumber];
  let status;
  let winner = calculateWinner (current.squares);
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + next;
  }

  return <>
    <div className = "game">
      <div className = "game-board">
        <Board
          squares = {current.squares}
          onClick = {(i) => handleClick (i)}
        />
      </div>
      <div className = "game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  </>
};

let calculateWinner = (
  squares: Array <string>
): null | string => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
};

let Root = () => <Game />

ReactDOM.render (
  <Root />,
  document.getElementById ("root"),
);

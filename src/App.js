import { useState } from "react";

const ROWS = 6;
const COLS = 7;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function checkWinner(board) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (!player) continue;

      for (const [dr, dc] of directions) {
        let count = 1;
        let rr = r + dr;
        let cc = c + dc;
        while (
          rr >= 0 &&
          rr < ROWS &&
          cc >= 0 &&
          cc < COLS &&
          board[rr][cc] === player
        ) {
          count++;
          if (count === 4) {
            return player;
          }
          rr += dr;
          cc += dc;
        }
      }
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== null));
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState("red");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  function handleColumnClick(col) {
    if (winner || isDraw) return;

    const newBoard = board.map((row) => [...row]);
    let placedRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][col]) {
        newBoard[r][col] = currentPlayer;
        placedRow = r;
        break;
      }
    }

    if (placedRow === -1) return; // coluna cheia

    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      return;
    }

    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
  }

  function handleReset() {
    setBoard(createEmptyBoard());
    setCurrentPlayer("red");
    setWinner(null);
    setIsDraw(false);
  }

  let statusMessage;
  if (winner) {
    statusMessage = `Jogador ${winner === "red" ? "Vermelho" : "Amarelo"} venceu!`;
  } else if (isDraw) {
    statusMessage = "Empate!";
  } else {
    statusMessage = `Vez do jogador ${currentPlayer === "red" ? "Vermelho" : "Amarelo"}`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#1e293b",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "8px" }}>Conecte 4</h1>
      <p
        style={{
          color: "white",
          marginBottom: "16px",
          fontSize: "18px",
          fontWeight: 500,
        }}
      >
        {statusMessage}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 56px)`,
          gap: "6px",
          background: "#2563eb",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleColumnClick(colIndex)}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: cell === "red" ? "#ef4444" : cell === "yellow" ? "#facc15" : "#0f172a",
                cursor: winner || isDraw ? "default" : "pointer",
                transition: "background 0.15s ease",
              }}
            />
          ))
        )}
      </div>

      <button
        onClick={handleReset}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: 500,
          color: "white",
          background: "#334155",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Reiniciar jogo
      </button>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Square from './Square';
import Piece from './Piece';

const ChessBoard = ({ gameId, playerColor }) => {
    const [boardState, setBoardState] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);

    useEffect(() => {
        fetchGameState();
    }, [gameId]);

    const fetchGameState = async () => {
        const response = await fetch(`/api/chess/games/${gameId}`);
        const data = await response.json();
        setBoardState(data.board_state);
    };

    const handlePieceSelect = (piece, position) => {
        setSelectedPiece({ piece, position });
    };

    const handleMove = async (toPosition) => {
        if (!selectedPiece) return;

        const response = await fetch(`/api/chess/games/${gameId}/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: selectedPiece.position,
                to: toPosition,
                piece: selectedPiece.piece
            }),
        });

        const data = await response.json();
        if (data.success) {
            setBoardState(data.game.board_state);
            setSelectedPiece(null);
        }
    };

    return (
        <div className="chess-board">
            {boardState && boardState.map((row, i) => (
                <div key={i} className="row">
                    {row.map((square, j) => (
                        <Square
                            key={`${i}-${j}`}
                            position={`${i}-${j}`}
                            onSelect={handleMove}
                        >
                            {square && (
                                <Piece
                                    type={square.type}
                                    color={square.color}
                                    onSelect={handlePieceSelect}
                                    position={`${i}-${j}`}
                                />
                            )}
                        </Square>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChessBoard;
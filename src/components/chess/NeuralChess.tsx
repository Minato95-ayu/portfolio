import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Board,
  Move,
  SearchResult,
  getInitialPosition,
  getBoard,
  getTurn,
  getGameStatus,
  evaluatePosition,
  getPieceMoves,
  applyMove,
  findBestMove,
} from './chessEngine.ts';
import { sound } from '../../utils/audio.ts';

// Piece unicode glyphs with clean rendering
const PIECE_SYMBOLS: Record<string, string> = {
  wp: '♙',
  wn: '♘',
  wb: '♗',
  wr: '♖',
  wq: '♕',
  wk: '♔',
  bp: '♟',
  bn: '♞',
  bb: '♝',
  br: '♜',
  bq: '♛',
  bk: '♚',
};

const PIECE_POINTS: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

interface NeuralChessProps {
  onClose?: () => void;
}

export const NeuralChess: React.FC<NeuralChessProps> = ({ onClose }) => {
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<string>(getInitialPosition);
  const [history, setHistory] = useState<{ position: string; move: Move }[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [difficulty, setDifficulty] = useState<number>(3);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('White to move. Select a piece to play.');
  const [lastSearch, setLastSearch] = useState<SearchResult | null>(null);
  const board: Board = getBoard(position);
  const turn = getTurn(position);
  const priorPositions = history.map(({ position: priorPosition }) => priorPosition);
  const gameStatus = getGameStatus(position, priorPositions);
  const positionEval = evaluatePosition(position);
  const capturedWhite = history
    .filter(({ move }) => move.captured?.color === 'w')
    .map(({ move }) => PIECE_SYMBOLS[`w${move.captured?.type}`] || '');
  const capturedBlack = history
    .filter(({ move }) => move.captured?.color === 'b')
    .map(({ move }) => PIECE_SYMBOLS[`b${move.captured?.type}`] || '');
  const whiteCapturePoints = history
    .filter(({ move }) => move.captured?.color === 'b')
    .reduce((points, { move }) => points + (move.captured ? PIECE_POINTS[move.captured.type] : 0), 0);
  const blackCapturePoints = history
    .filter(({ move }) => move.captured?.color === 'w')
    .reduce((points, { move }) => points + (move.captured ? PIECE_POINTS[move.captured.type] : 0), 0);

  // Execute AI Bot move
  const triggerBotMove = useCallback((currentPosition: string) => {
    setIsBotThinking(true);
    setStatusMessage('AAYU is searching legal continuations with alpha-beta pruning...');

    botTimer.current = setTimeout(() => {
      botTimer.current = null;
      const result = findBestMove(currentPosition, 'b', difficulty);
      if (result) {
        const bestMove = result.move;
        if (bestMove.captured) {
          sound.playClick();
        } else {
          sound.playBlip(540);
        }

        const newPosition = applyMove(currentPosition, bestMove);
        setPosition(newPosition);
        setHistory((prev) => [...prev, { position: currentPosition, move: bestMove }]);
        setLastSearch(result);
        setIsBotThinking(false);
        const nextStatus = getGameStatus(newPosition, [...priorPositions, currentPosition]);
        setStatusMessage(
          nextStatus === 'checkmate'
            ? 'Checkmate. AAYU Bot wins.'
            : nextStatus === 'draw'
              ? 'Draw. The game has ended.'
              : nextStatus === 'check'
                ? `AAYU played ${bestMove.notation} and gave check.`
                : `AAYU played ${bestMove.notation}. Your move.`
        );
      } else {
        setIsBotThinking(false);
        setStatusMessage('No legal move is available. The game has ended.');
      }
    }, 450);
  }, [difficulty, priorPositions]);

  useEffect(() => () => {
    if (botTimer.current) clearTimeout(botTimer.current);
  }, []);

  // Handle Square Selection / Click
  const handleSquareClick = (r: number, c: number) => {
    if (turn !== 'w' || isBotThinking || gameStatus === 'checkmate' || gameStatus === 'draw') return;

    // If square clicked is a valid destination for currently selected piece
    if (selectedSquare) {
      const targetMove = validMoves.find((m) => m.to[0] === r && m.to[1] === c);
      if (targetMove) {
        // Execute Player Move
        if (targetMove.captured) {
          sound.playClick();
        } else {
          sound.playBlip(780);
        }

        const newPosition = applyMove(position, targetMove);
        setPosition(newPosition);
        setHistory((prev) => [...prev, { position, move: targetMove }]);
        setSelectedSquare(null);
        setValidMoves([]);
        setLastSearch(null);
        const nextStatus = getGameStatus(newPosition, [...priorPositions, position]);
        if (nextStatus === 'checkmate') {
          setStatusMessage('Checkmate. You win!');
        } else if (nextStatus === 'draw') {
          setStatusMessage('Draw. The game has ended.');
        } else if (nextStatus === 'check') {
          setStatusMessage(`You played ${targetMove.notation} and gave check.`);
          triggerBotMove(newPosition);
        } else {
          setStatusMessage(`You played ${targetMove.notation}.`);
          triggerBotMove(newPosition);
        }

        return;
      }
    }

    // Select White piece
    const piece = board[r][c];
    if (piece && piece.color === 'w') {
      sound.playClick();
      setSelectedSquare([r, c]);
      const moves = getPieceMoves(position, r, c);
      setValidMoves(moves);
      setStatusMessage(`Selected ${String.fromCharCode(97 + c)}${8 - r}. Choose a legal destination.`);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const handleReset = () => {
    sound.playClick();
    if (botTimer.current) clearTimeout(botTimer.current);
    botTimer.current = null;
    setPosition(getInitialPosition());
    setHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
    setIsBotThinking(false);
    setLastSearch(null);
    setStatusMessage('Board reset. White to move.');
  };

  const handleUndo = () => {
    if (history.length === 0 || isBotThinking) return;
    sound.playClick();
    const pliesToUndo = history.length % 2 === 0 ? 2 : 1;
    const previousState = history[history.length - pliesToUndo];
    setPosition(previousState.position);
    setHistory(history.slice(0, -pliesToUndo));
    setSelectedSquare(null);
    setValidMoves([]);
    setLastSearch(null);
    setStatusMessage('Undid previous round of moves.');
  };

  return (
    <div className="bg-[#0c1017] border border-white/10 rounded-sm p-4 sm:p-6 text-white max-w-4xl mx-auto shadow-2xl">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-sm bg-[#161C24] border border-[#C6FF3D]/40 flex items-center justify-center font-bold text-lg text-[#C6FF3D]">
            ♚
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>NEURAL CHESS / BOT ENGINE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30">
                ALPHA-BETA MINIMAX
              </span>
            </h3>
            <p className="text-[11px] font-mono text-white/50">
              Legal chess rules · capture-aware search · position evaluation
            </p>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap items-center gap-1.5 sm:space-x-2 text-xs font-mono">
          <span className="text-white/40 text-[11px]">DEPTH:</span>
          {[
            { label: 'FAST · 1 PLY', val: 1 },
            { label: 'TACTICAL · 2 PLY', val: 2 },
            { label: 'STRONG · 3 PLY', val: 3 },
          ].map((d) => (
            <button
              key={d.val}
              type="button"
              onClick={() => {
                sound.playClick();
                setDifficulty(d.val);
              }}
              className={`px-2 py-1 rounded border text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                difficulty === d.val
                  ? 'border-[#C6FF3D] text-[#C6FF3D] bg-[#C6FF3D]/10 font-bold'
                  : 'border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Chess"
              className="ml-1 sm:ml-3 p-1 text-white/50 hover:text-white border border-white/10 rounded cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Chessboard + Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-start">
        {/* Board View (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center w-full">
          {/* Black Captured Tray */}
          <div className="w-full max-w-[360px] h-6 flex items-center justify-between text-sm px-1 mb-1 font-mono text-white/60">
            <span className="text-[11px] text-[#38bdf8]">AAYU TOOK · {blackCapturePoints} PTS</span>
            <span className="text-base tracking-widest text-[#84cc16] truncate max-w-[200px]" aria-label="White pieces captured by the bot">{capturedWhite.join(' ')}</span>
          </div>

          {/* 8x8 Chessboard */}
          <div className="relative border-2 border-white/20 rounded-sm p-1 bg-[#131922] shadow-[0_0_30px_rgba(0,0,0,0.8)] max-w-full">
            <div className="grid grid-cols-8 grid-rows-8 w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[360px] sm:h-[360px] max-w-full aspect-square">
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const isLight = (r + c) % 2 === 0;
                  const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;
                  const isValidTarget = validMoves.some((m) => m.to[0] === r && m.to[1] === c);

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => handleSquareClick(r, c)}
                      className={`relative flex items-center justify-center text-xl xs:text-2xl sm:text-3xl select-none transition-colors duration-150 cursor-pointer ${
                        isLight ? 'bg-[#1a2332]' : 'bg-[#0a0e17]'
                      } ${isSelected ? 'ring-2 ring-[#84cc16] ring-inset bg-[#84cc16]/20' : ''}`}
                    >
                      {/* Piece Rendering */}
                      {cell && (
                        <span
                          className={`transition-transform duration-150 hover:scale-110 ${
                            cell.color === 'w'
                              ? 'text-[#f8fafc] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                              : 'text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                          }`}
                        >
                          {PIECE_SYMBOLS[`${cell.color}${cell.type}`]}
                        </span>
                      )}

                      {/* Valid move target dot indicator */}
                      {isValidTarget && (
                        <span
                          className={`absolute w-3 h-3 rounded-full ${
                            cell ? 'border-2 border-[#84cc16] bg-transparent' : 'bg-[#84cc16]/70'
                          }`}
                        />
                      )}

                      {/* Small Coordinates on edges */}
                      {c === 0 && (
                        <span className="absolute top-0.5 left-1 text-[8px] font-mono text-white/30 pointer-events-none">
                          {8 - r}
                        </span>
                      )}
                      {r === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-white/30 pointer-events-none">
                          {String.fromCharCode(97 + c)}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* White Captured Tray */}
          <div className="w-full max-w-[380px] h-6 flex items-center justify-between text-sm px-1 mt-1 font-mono text-white/60">
            <span className="text-[11px] text-[#84cc16]">YOU TOOK · {whiteCapturePoints} PTS</span>
            <span className="text-base tracking-widest text-[#38bdf8]" aria-label="Black pieces captured by the player">{capturedBlack.join(' ')}</span>
          </div>
        </div>

        {/* Engine Readout & Controls (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#131922] border border-white/10 p-4 rounded-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-white/40">MATCH STATUS</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  turn === 'w' ? 'text-[#84cc16]' : 'text-[#38bdf8]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    turn === 'w' ? 'bg-[#84cc16]' : 'bg-[#38bdf8] animate-ping'
                  }`}
                />
                {isBotThinking
                  ? 'BOT CALCULATING...'
                  : gameStatus === 'checkmate'
                    ? 'CHECKMATE'
                    : gameStatus === 'draw'
                      ? 'DRAW'
                      : gameStatus === 'check'
                        ? `${turn === 'w' ? 'YOUR KING' : 'BOT KING'} IN CHECK`
                        : turn === 'w' ? 'YOUR TURN' : 'BOT TURN'}
              </span>
            </div>

            <p className="text-white/80 leading-relaxed text-[11px] italic min-h-[32px]">
              "{statusMessage}"
            </p>

            <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
              <div className="rounded bg-[#07090e] p-2">
                <div className="text-[10px] text-white/40">MATERIAL WON · YOU</div>
                <div className="mt-1 font-bold text-[#84cc16]">{whiteCapturePoints} pts</div>
              </div>
              <div className="rounded bg-[#07090e] p-2">
                <div className="text-[10px] text-white/40">MATERIAL WON · AAYU</div>
                <div className="mt-1 font-bold text-[#38bdf8]">{blackCapturePoints} pts</div>
              </div>
            </div>
            <p className="text-[10px] text-white/40">
              Piece points: pawn 1 · knight/bishop 3 · rook 5 · queen 9
            </p>
            <div className="rounded border border-white/5 bg-[#07090e] p-2">
              <div className="text-[10px] text-white/40">POSITION EVAL · WHITE POV</div>
              <div className="mt-1 font-bold text-white">
                {positionEval > 0 ? '+' : ''}
                {(positionEval / 100).toFixed(2)} pawns{' '}
                <span className="ml-2 font-normal text-white/40">
                  {positionEval > 0 ? 'White ahead' : positionEval < 0 ? 'Black ahead' : 'Position even'}
                </span>
              </div>
            </div>

            {lastSearch && (
              <div className="rounded border border-[#C6FF3D]/20 bg-[#C6FF3D]/[0.04] p-2 space-y-1">
                <div className="text-[10px] font-bold text-[#C6FF3D]">LAST BOT DECISION · {lastSearch.move.notation}</div>
                <div className="text-[10px] text-white/70">
                  {lastSearch.move.notation.includes('#')
                    ? 'Delivers checkmate.'
                    : lastSearch.move.captured
                    ? `Captured ${lastSearch.move.captured.type.toUpperCase()} (+${PIECE_POINTS[lastSearch.move.captured.type]} material points).`
                    : lastSearch.move.promotion
                      ? `Promoted to ${lastSearch.move.promotion.toUpperCase()}.`
                      : lastSearch.move.givesCheck
                        ? 'Gives check and narrows the opponent’s legal replies.'
                        : 'Selected as the best-scoring move in the searched lines.'}
                </div>
                <div className="text-[10px] text-white/40">
                  Depth {lastSearch.depth} · {lastSearch.nodes.toLocaleString()} positions searched · eval {(lastSearch.score / 100).toFixed(2)} pawns (White POV)
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
              <div className="text-white/40">MOVE LOG ({history.length} PLIES):</div>
              <div className="max-h-24 overflow-y-auto bg-[#07090e] p-2 rounded text-[10px] space-y-0.5 font-mono text-white/70">
                {history.length === 0 ? (
                  <span className="text-white/30">No moves recorded yet.</span>
                ) : (
                  history.map((h, i) => (
                    <span key={i} className="inline-block mr-2">
                      <span className="text-white/40">{i + 1}.</span> {h.move.notation}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0 || isBotThinking}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/10 text-white font-mono text-xs rounded transition-colors cursor-pointer"
            >
              ↶ UNDO MOVE
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2 bg-[#84cc16]/10 hover:bg-[#84cc16]/20 border border-[#84cc16]/40 text-[#84cc16] font-mono text-xs font-bold rounded transition-colors cursor-pointer"
            >
              ↻ RESTART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

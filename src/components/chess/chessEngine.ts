import { Chess, SQUARES, type Move as ChessMove } from 'chess.js';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = { type: PieceType; color: PieceColor };
export type Board = (Piece | null)[][];

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  captured?: Piece | null;
  notation: string;
  promotion?: PieceType;
  givesCheck: boolean;
}

export interface SearchResult {
  move: Move;
  score: number;
  depth: number;
  nodes: number;
}

const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 900,
  k: 0,
};

const MATE_SCORE = 100_000;
const MAX_QUIESCENCE_DEPTH = 5;
const MAX_SEARCH_NODES = 10_000;
const MAX_SEARCH_TIME_MS = 400;
type EvaluatedPiece = Pick<Piece, 'type' | 'color'>;

class SearchLimitReached extends Error {}

function checkSearchLimit(nodes: { count: number; startedAt: number }): void {
  if (nodes.count >= MAX_SEARCH_NODES || Date.now() - nodes.startedAt >= MAX_SEARCH_TIME_MS) {
    throw new SearchLimitReached();
  }
}

export function getInitialPosition(): string {
  return new Chess().fen();
}

export function getTurn(position: string): PieceColor {
  return new Chess(position).turn();
}

export function getBoard(position: string): Board {
  return new Chess(position).board().map((row) =>
    row.map((piece) => (piece ? { type: piece.type, color: piece.color } : null))
  );
}

function inBounds(row: number, column: number): boolean {
  return row >= 0 && row < 8 && column >= 0 && column < 8;
}

function squareName(row: number, column: number): string {
  return `${String.fromCharCode(97 + column)}${8 - row}`;
}

function squareCoordinates(square: string): [number, number] {
  return [8 - Number(square[1]), square.charCodeAt(0) - 97];
}

function fromChessMove(move: ChessMove): Move {
  return {
    from: squareCoordinates(move.from),
    to: squareCoordinates(move.to),
    piece: { type: move.piece, color: move.color },
    captured: move.captured ? { type: move.captured, color: move.color === 'w' ? 'b' : 'w' } : null,
    notation: move.san,
    promotion: move.promotion,
    givesCheck: move.san.includes('+') || move.san.includes('#'),
  };
}

export function getPieceMoves(position: string, row: number, column: number): Move[] {
  if (!inBounds(row, column)) return [];
  const chess = new Chess(position);
  const square = SQUARES[row * 8 + column];
  if (!square) return [];
  return (chess.moves({ square, verbose: true }) as ChessMove[])
    .map(fromChessMove);
}

export function applyMove(position: string, move: Move): string {
  const chess = new Chess(position);
  chess.move({
    from: squareName(...move.from),
    to: squareName(...move.to),
    promotion: move.promotion ?? 'q',
  });
  return chess.fen();
}

export function evaluateBoard(board: Board): number {
  return evaluatePieces(board);
}

function evaluatePieces(board: readonly (readonly (EvaluatedPiece | null)[])[]): number {
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      const piece = board[row][column];
      if (!piece) continue;

      const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - column);
      const centerBonus = Math.round((7 - centerDistance) * (piece.type === 'p' ? 4 : 8));
      const advancement = piece.type === 'p'
        ? (piece.color === 'w' ? 6 - row : row - 1) * 7
        : 0;
      const value = PIECE_VALUES[piece.type] + centerBonus + advancement;
      score += piece.color === 'w' ? value : -value;
    }
  }
  return score;
}

export function evaluatePosition(position: string): number {
  const chess = new Chess(position);
  if (chess.isCheckmate()) return chess.turn() === 'w' ? -MATE_SCORE : MATE_SCORE;
  if (chess.isDraw()) return 0;
  return evaluatePieces(chess.board());
}

export function getMaterialScore(position: string): number {
  const board = getBoard(position);
  let score = 0;
  for (const row of board) {
    for (const piece of row) {
      if (piece && piece.type !== 'k') {
        score += (piece.color === 'w' ? 1 : -1) * PIECE_VALUES[piece.type];
      }
    }
  }
  return score;
}

export function getGameStatus(
  position: string,
  previousPositions: string[] = [],
): 'playing' | 'check' | 'checkmate' | 'draw' {
  const chess = new Chess(position);
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isDraw()) return 'draw';
  const currentPositionKey = position.split(' ').slice(0, 4).join(' ');
  const repetitions = previousPositions.filter(
    (previous) => previous.split(' ').slice(0, 4).join(' ') === currentPositionKey
  ).length + 1;
  if (repetitions >= 3) return 'draw';
  if (chess.isCheck()) return 'check';
  return 'playing';
}

function moveOrderScore(move: ChessMove): number {
  let score = move.captured ? 10_000 + PIECE_VALUES[move.captured] - PIECE_VALUES[move.piece] / 10 : 0;
  if (move.promotion) score += 8_000 + PIECE_VALUES[move.promotion];
  if (move.san.includes('+')) score += 500;
  if (move.san.includes('#')) score += MATE_SCORE;
  return score;
}

function orderedMoves(chess: Chess, capturesOnly = false): ChessMove[] {
  const moves = chess.moves({ verbose: true }) as ChessMove[];
  return moves
    .filter((move) => !capturesOnly || move.captured || move.promotion)
    .sort((a, b) => moveOrderScore(b) - moveOrderScore(a));
}

function quiescence(
  chess: Chess,
  alpha: number,
  beta: number,
  ply: number,
  nodes: { count: number; startedAt: number },
): number {
  nodes.count++;
  checkSearchLimit(nodes);
  if (chess.isCheckmate()) return -MATE_SCORE + ply;
  if (chess.isDraw()) return 0;

  const checked = chess.isCheck();
  const staticScore = (chess.turn() === 'w' ? 1 : -1) * evaluatePieces(chess.board());
  const standPat = checked ? -Infinity : staticScore;

  if (!checked) {
    if (standPat >= beta) return beta;
    alpha = Math.max(alpha, standPat);
  }
  if (ply >= MAX_QUIESCENCE_DEPTH) return staticScore;

  let best = checked ? -Infinity : standPat;
  for (const move of orderedMoves(chess, !checked)) {
    chess.move(move);
    let score: number;
    try {
      score = -quiescence(chess, -beta, -alpha, ply + 1, nodes);
    } finally {
      chess.undo();
    }
    best = Math.max(best, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  return best;
}

function negamax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  nodes: { count: number; startedAt: number },
): number {
  nodes.count++;
  checkSearchLimit(nodes);
  if (chess.isCheckmate()) return -MATE_SCORE + ply;
  if (chess.isDraw()) return 0;
  if (depth <= 0) return quiescence(chess, alpha, beta, 0, nodes);

  const moves = orderedMoves(chess);
  if (moves.length === 0) return 0;

  let bestScore = -Infinity;
  for (const move of moves) {
    chess.move(move);
    let score: number;
    try {
      score = -negamax(chess, depth - 1, -beta, -alpha, ply + 1, nodes);
    } finally {
      chess.undo();
    }
    bestScore = Math.max(bestScore, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }
  return bestScore;
}

export function findBestMove(position: string, color: PieceColor, depth = 3): SearchResult | null {
  const chess = new Chess(position);
  if (chess.turn() !== color || chess.isGameOver()) return null;

  const rootMoves = orderedMoves(chess);
  if (rootMoves.length === 0) return null;

  const nodes = { count: 0, startedAt: Date.now() };
  let bestMove = rootMoves[0];
  let bestScore = -Infinity;
  for (const move of rootMoves) {
    chess.move(move);
    let score: number;
    try {
      score = (color === 'w' ? 1 : -1) * evaluatePieces(chess.board());
    } finally {
      chess.undo();
    }
    if (score > bestScore) {
      bestMove = move;
      bestScore = score;
    }
  }
  let completedDepth = 1;

  for (let currentDepth = 2; currentDepth <= depth; currentDepth++) {
    let iterationBestMove = bestMove;
    let iterationBestScore = -Infinity;
    let alpha = -Infinity;
    try {
      for (const move of rootMoves) {
        chess.move(move);
        let score: number;
        try {
          score = -negamax(chess, currentDepth - 1, -Infinity, -alpha, 1, nodes);
        } finally {
          chess.undo();
        }
        if (score > iterationBestScore) {
          iterationBestScore = score;
          iterationBestMove = move;
        }
        alpha = Math.max(alpha, score);
      }
    } catch (error) {
      if (!(error instanceof SearchLimitReached)) throw error;
      break;
    }

    bestMove = iterationBestMove;
    bestScore = iterationBestScore;
    completedDepth = currentDepth;
  }

  return {
    move: fromChessMove(bestMove),
    score: color === 'w' ? bestScore : -bestScore,
    depth: completedDepth,
    nodes: nodes.count,
  };
}

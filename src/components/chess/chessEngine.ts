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
  predictedReply: Move | null;
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
const MAX_TRANSPOSITION_ENTRIES = 20_000;
type EvaluatedPiece = Pick<Piece, 'type' | 'color'>;
type TranspositionBound = 'exact' | 'lower' | 'upper';

interface TranspositionEntry {
  depth: number;
  score: number;
  bound: TranspositionBound;
  bestMove: string;
}

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

export function getLegalMoves(position: string): Move[] {
  return (new Chess(position).moves({ verbose: true }) as ChessMove[]).map(fromChessMove);
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

function moveKey(move: ChessMove): string {
  return `${move.from}${move.to}${move.promotion ?? ''}`;
}

function positionKey(chess: Chess): string {
  return chess.fen().split(' ').slice(0, 5).join(' ');
}

function orderedMoves(
  chess: Chess,
  capturesOnly = false,
  preferredMove?: string,
  legalMoves?: ChessMove[],
): ChessMove[] {
  const moves = legalMoves ?? chess.moves({ verbose: true }) as ChessMove[];
  return moves
    .filter((move) => !capturesOnly || move.captured || move.promotion)
    .sort((a, b) => {
      if (moveKey(a) === preferredMove) return -1;
      if (moveKey(b) === preferredMove) return 1;
      return moveOrderScore(b) - moveOrderScore(a);
    });
}

function isRuleDraw(chess: Chess): boolean {
  return chess.isDrawByFiftyMoves()
    || chess.isInsufficientMaterial()
    || chess.isThreefoldRepetition();
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
  const checked = chess.isCheck();
  const moves = chess.moves({ verbose: true }) as ChessMove[];
  if (moves.length === 0) return checked ? -MATE_SCORE + ply : 0;
  if (isRuleDraw(chess)) return 0;

  const staticScore = (chess.turn() === 'w' ? 1 : -1) * evaluatePieces(chess.board());
  const standPat = checked ? -Infinity : staticScore;

  if (!checked) {
    if (standPat >= beta) return beta;
    alpha = Math.max(alpha, standPat);
  }
  if (ply >= MAX_QUIESCENCE_DEPTH) return staticScore;

  let best = checked ? -Infinity : standPat;
  for (const move of orderedMoves(chess, !checked, undefined, moves)) {
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
  transpositions: Map<string, TranspositionEntry>,
): number {
  nodes.count++;
  checkSearchLimit(nodes);
  if (depth <= 0) return quiescence(chess, alpha, beta, 0, nodes);

  const moves = chess.moves({ verbose: true }) as ChessMove[];
  if (moves.length === 0) return chess.isCheck() ? -MATE_SCORE + ply : 0;
  if (isRuleDraw(chess)) return 0;

  const key = positionKey(chess);
  const entry = transpositions.get(key);
  const originalAlpha = alpha;
  const originalBeta = beta;
  if (entry && entry.depth >= depth) {
    if (entry.bound === 'exact') return entry.score;
    if (entry.bound === 'lower') alpha = Math.max(alpha, entry.score);
    if (entry.bound === 'upper') beta = Math.min(beta, entry.score);
    if (alpha >= beta) return entry.score;
  }

  const ordered = orderedMoves(chess, false, entry?.bestMove, moves);

  let bestScore = -Infinity;
  let bestMove = '';
  for (const move of ordered) {
    chess.move(move);
    let score: number;
    try {
      score = -negamax(chess, depth - 1, -beta, -alpha, ply + 1, nodes, transpositions);
    } finally {
      chess.undo();
    }
    if (score > bestScore) {
      bestScore = score;
      bestMove = moveKey(move);
    }
    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }

  if (transpositions.size < MAX_TRANSPOSITION_ENTRIES || transpositions.has(key)) {
    transpositions.set(key, {
      depth,
      score: bestScore,
      bound: bestScore <= originalAlpha ? 'upper' : bestScore >= originalBeta ? 'lower' : 'exact',
      bestMove,
    });
  }
  return bestScore;
}

export function findBestMove(position: string, color: PieceColor, depth = 3): SearchResult | null {
  const chess = new Chess(position);
  if (chess.turn() !== color || chess.isGameOver()) return null;

  const rootMoves = orderedMoves(chess);
  if (rootMoves.length === 0) return null;

  const nodes = { count: 0, startedAt: Date.now() };
  const transpositions = new Map<string, TranspositionEntry>();
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
      const iterationMoves = orderedMoves(chess, false, moveKey(bestMove));
      for (const move of iterationMoves) {
        chess.move(move);
        let score: number;
        try {
          score = -negamax(chess, currentDepth - 1, -Infinity, -alpha, 1, nodes, transpositions);
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

  let predictedReply: Move | null = null;
  chess.move(bestMove);
  try {
    const replyKey = transpositions.get(positionKey(chess))?.bestMove;
    if (replyKey) {
      const reply = (chess.moves({ verbose: true }) as ChessMove[])
        .find((candidate) => moveKey(candidate) === replyKey);
      if (reply) predictedReply = fromChessMove(reply);
    }
  } finally {
    chess.undo();
  }

  return {
    move: fromChessMove(bestMove),
    predictedReply,
    score: color === 'w' ? bestScore : -bestScore,
    depth: completedDepth,
    nodes: nodes.count,
  };
}

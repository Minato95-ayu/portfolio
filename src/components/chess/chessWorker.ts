import { getLegalMoves, type SearchResult } from './chessEngine.ts';

interface SearchRequest {
  position: string;
  depth: number;
  baseUrl: string;
}

const MATE_SCORE = 100_000;

self.onmessage = (event: MessageEvent<SearchRequest>) => {
  const { position, depth, baseUrl } = event.data;
  let engine: Worker | null = null;
  let settled = false;
  let infoDepth = 0;
  let nodes = 0;
  let score = 0;
  const legalMoves = getLegalMoves(position);

  if (!legalMoves.length) {
    self.postMessage({ result: null });
    return;
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const finish = (result: SearchResult | null, error?: string) => {
    if (settled) return;
    settled = true;
    if (timeout) clearTimeout(timeout);
    engine?.terminate();
    self.postMessage(error ? { error } : { result });
  };

  const engineUrl = new URL(`${baseUrl}chess/stockfish-19-lite-single.js`, self.location.origin);
  const wasmUrl = new URL(`${baseUrl}chess/stockfish.wasm`, self.location.origin);
  engineUrl.hash = encodeURIComponent(wasmUrl.href);

  try {
    engine = new Worker(engineUrl, { type: 'classic' });
    timeout = setTimeout(() => finish(null, 'Stockfish timed out before returning a move.'), 12_000);

    engine.onmessage = (engineEvent: MessageEvent<string>) => {
      const line = String(engineEvent.data).trim();

      if (line === 'uciok') {
        engine?.postMessage('isready');
      } else if (line === 'readyok') {
        engine?.postMessage(`position fen ${position}`);
        const limits = depth <= 2
          ? 'depth 6 nodes 50000 movetime 600'
          : depth <= 3
            ? 'depth 10 nodes 300000 movetime 1800'
            : 'depth 18 nodes 2000000 movetime 5000';
        engine?.postMessage(`go ${limits}`);
      } else if (line.startsWith('info ')) {
        const depthMatch = line.match(/\bdepth (\d+)/);
        const nodesMatch = line.match(/\bnodes (\d+)/);
        const scoreMatch = line.match(/\bscore (cp|mate) (-?\d+)/);
        if (depthMatch) infoDepth = Number(depthMatch[1]);
        if (nodesMatch) nodes = Number(nodesMatch[1]);
        if (scoreMatch) {
          const value = Number(scoreMatch[2]);
          score = scoreMatch[1] === 'mate'
            ? Math.sign(value) * (MATE_SCORE - Math.abs(value))
            : value;
          if (position.split(' ')[1] === 'b') score = -score;
        }
      } else if (line.startsWith('bestmove ')) {
        const uci = line.split(/\s+/)[1];
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci[4];
        const move = legalMoves.find((candidate) => {
          const candidateFrom = `${String.fromCharCode(97 + candidate.from[1])}${8 - candidate.from[0]}`;
          const candidateTo = `${String.fromCharCode(97 + candidate.to[1])}${8 - candidate.to[0]}`;
          return candidateFrom === from
            && candidateTo === to
            && (candidate.promotion ?? '') === (promotion ?? '');
        });

        if (!move) {
          finish(null, `Stockfish returned an illegal move: ${uci}`);
          return;
        }

        finish({ move, predictedReply: null, score, depth: infoDepth, nodes });
      }
    };

    engine.onerror = (error) => finish(null, `Stockfish worker failed: ${error.message || 'unknown error'}`);
    engine.postMessage('uci');
  } catch (error) {
    finish(null, error instanceof Error ? error.message : String(error));
  }
};

import { findBestMove, type PieceColor } from './chessEngine.ts';

interface SearchRequest {
  position: string;
  color: PieceColor;
  depth: number;
}

self.onmessage = (event: MessageEvent<SearchRequest>) => {
  try {
    const result = findBestMove(event.data.position, event.data.color, event.data.depth);
    self.postMessage({ result });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

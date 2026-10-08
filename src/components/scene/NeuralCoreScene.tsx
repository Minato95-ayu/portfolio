import React from 'react';
import {
  TechGalaxySolarSystemScene,
  GalaxyViewMode,
} from './TechGalaxySolarSystemScene.tsx';

interface NeuralCoreSceneProps {
  reducedMotion?: boolean;
  onNodeHover?: (nodeName: string | null) => void;
  activeSection?: string;
  isInteractiveMode?: boolean;
  onToggleInteractiveMode?: () => void;
}

export const NeuralCoreScene: React.FC<NeuralCoreSceneProps> = (props) => {
  return <TechGalaxySolarSystemScene {...props} />;
};

export { TechGalaxySolarSystemScene };
export type { GalaxyViewMode };

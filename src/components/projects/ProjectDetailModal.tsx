import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PROFILE_DATA, ProjectData } from '../../data/projectsData.ts';
import { IconByTag, IconGitHub, IconWebsite } from '../ui/Icons.tsx';
import { sound } from '../../utils/audio.ts';

interface ProjectDetailModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Project-specific 3D Visualizer Canvas
  useEffect(() => {
    if (!project || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Choose geometry motif based on project
    let geom: THREE.BufferGeometry;
    const col = new THREE.Color(project.color || '#C6FF3D');

    if (project.slug === 'eureka') {
      // Molecular geometry motif
      geom = new THREE.DodecahedronGeometry(1.4, 1);
    } else if (project.slug === 'tribev2-main' || project.slug === 'neuralforge') {
      // Brain / Cortical neural torus knot
      geom = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 16);
    } else if (project.slug === 'compilerx' || project.slug === 'job-finder' || project.slug === 'aayu-lang') {
      // Octahedral compiler graph
      geom = new THREE.OctahedronGeometry(1.5, 1);
    } else if (project.slug === 'sentinel-ai' || project.slug === 'web3-guard') {
      // Shield / Icosahedron lattice
      geom = new THREE.IcosahedronGeometry(1.5, 0);
    } else {
      geom = new THREE.TorusGeometry(1.2, 0.35, 16, 50);
    }

    const wireMat = new THREE.MeshBasicMaterial({
      color: col,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geom, wireMat);
    scene.add(mesh);

    // Inner glowing core
    const innerGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerMesh);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.008;
      mesh.rotation.y += 0.012;
      innerMesh.rotation.y -= 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      geom.dispose();
      wireMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, [project]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0D10]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl bg-[#10141A] border border-white/20 rounded-sm shadow-2xl p-4 sm:p-8 lg:p-10 max-h-[92vh] overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-start justify-between pb-4 sm:pb-6 border-b border-white/10 gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="p-2 sm:p-2.5 rounded bg-white/[0.04] border border-white/10 text-[#C6FF3D] shrink-0">
              <IconByTag iconName={project.iconName} size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-[#C6FF3D] uppercase tracking-widest truncate">
                {project.category} · SPECIFICATION
              </div>
              <h2 id="modal-project-title" className="text-xl sm:text-4xl font-bold text-[#EDEFF2] truncate">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span
              className={`text-[9.5px] sm:text-[10px] font-mono px-2 sm:px-3 py-1 rounded border ${
                project.status.includes('ACTIVE') || project.status.includes('PUBLIC')
                  ? 'border-[#C6FF3D]/40 text-[#C6FF3D] bg-[#C6FF3D]/10'
                  : 'border-[#4CC9F0]/40 text-[#4CC9F0] bg-[#4CC9F0]/10'
              }`}
            >
              {project.status}
            </span>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close project modal"
              className="p-1.5 sm:p-2 border border-white/10 hover:border-white/30 text-white/60 hover:text-white rounded font-mono text-xs transition-colors cursor-pointer"
            >
              ESC ✕
            </button>
          </div>
        </div>

        {/* Hero 3D Motif & Research Thesis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 border-b border-white/10 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
              RESEARCH QUESTION & THESIS
            </div>
            <p className="text-lg sm:text-xl text-white font-medium italic leading-relaxed">
              "{project.researchQuestion}"
            </p>
            <p className="text-sm text-white/70 leading-relaxed pt-2">
              {project.summary}
            </p>
          </div>

          {/* Interactive 3D Wireframe Canvas */}
          <div className="lg:col-span-4 h-48 w-full bg-[#131922]/50 border border-white/10 rounded-sm relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/40">
              3D MOTIF / {project.slug.toUpperCase()}
            </div>
          </div>
        </div>

        {/* What Exists vs What To Build Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-white/10">
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
            <div className="text-xs font-mono text-[#84cc16] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
              <span>WHAT CURRENTLY EXISTS</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-mono">
              {project.whatExists}
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
            <div className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <span>WHAT I AM PREPARING TO BUILD NEXT</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-mono">
              {project.whatToBuildNext}
            </p>
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="py-8 border-b border-white/10 space-y-3">
          <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
            SYSTEM ARCHITECTURE FLOW
          </div>
          <div className="p-4 bg-[#07090e] border border-white/10 rounded-sm font-mono text-xs text-[#84cc16] overflow-x-auto leading-relaxed">
            {project.architectureNotes}
          </div>
        </div>

        {/* 7-Day Sprint Plan */}
        <div className="py-8 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
              SEVEN-DAY SPRINT BREAKDOWN
            </div>
            <span className="text-[11px] font-mono text-[#38bdf8]">
              ESTIMATED OUTPUT SPEC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.sprint7Day.map((sprint) => (
              <div
                key={sprint.day}
                className="p-3 bg-white/[0.02] border border-white/5 rounded-sm space-y-1"
              >
                <div className="text-[10px] font-mono text-[#84cc16] font-bold">
                  {sprint.day}
                </div>
                <div className="text-xs text-white/75 font-mono">
                  {sprint.task}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Stack & Proof Expected */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
              VERIFIED TECH STACK
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
              EXPECTED PROOF / ARTIFACTS
            </div>
            <p className="text-xs text-white/70 font-mono leading-relaxed">
              {project.proofExpected}
            </p>
          </div>
        </div>

        {/* Modal CTAs & Navigation */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 border border-white/20 hover:border-white/40 text-white text-xs font-mono rounded transition-colors cursor-pointer"
          >
            ← BACK TO PROJECTS
          </button>

          <div className="flex items-center space-x-3">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="px-4 py-2.5 border border-[#38bdf8]/40 hover:border-[#38bdf8] text-[#38bdf8] font-mono text-xs rounded transition-all bg-[#38bdf8]/10 flex items-center space-x-2"
              >
                <IconWebsite size={15} />
                <span>VISIT ADUMATE.IN</span>
              </a>
            )}

            {project.githubUrl !== PROFILE_DATA.links.github && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="px-5 py-2.5 bg-[#B6FF5C] hover:bg-[#caff87] text-[#07090e] font-mono text-xs font-bold rounded-xl transition-all flex items-center space-x-2 shadow-[0_0_22px_rgba(182,255,92,0.2)]"
              >
                <IconGitHub size={16} />
                <span>OPEN REPOSITORY</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

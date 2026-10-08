import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const IconNeural: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="20" cy="8" r="2" />
    <circle cx="4" cy="16" r="2" />
    <circle cx="20" cy="16" r="2" />
    <line x1="6" y1="8" x2="9.5" y2="10.5" />
    <line x1="18" y1="8" x2="14.5" y2="10.5" />
    <line x1="6" y1="16" x2="9.5" y2="13.5" />
    <line x1="18" y1="16" x2="14.5" y2="13.5" />
    <path d="M12 3v6M12 15v6" opacity="0.4" />
  </svg>
);

export const IconCompiler: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 3v6l6 6v6" />
    <path d="M18 3v6l-4 4" />
    <circle cx="6" cy="3" r="1.5" fill="currentColor" />
    <circle cx="18" cy="3" r="1.5" fill="currentColor" />
    <circle cx="12" cy="21" r="1.5" fill="currentColor" />
    <path d="M9 15l-3 3" opacity="0.5" />
  </svg>
);

export const IconSentinel: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2L4 5v6.5c0 5 3.5 9.7 8 10.5 4.5-.8 8-5.5 8-10.5V5l-8-3z" />
    <path d="M12 7v5l3 3" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const IconWeb3Guard: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <polygon points="12 2 21 9 12 22 3 9" />
    <path d="M12 2v20" opacity="0.4" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

export const IconAayuOS: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <polygon points="12 4 14.5 9.5 20 12 14.5 14.5 12 20 9.5 14.5 4 12 9.5 9.5" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const IconAdumate: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 19L12 4l6 15" />
    <line x1="8.5" y1="14" x2="15.5" y2="14" />
    <ellipse cx="12" cy="12" rx="9" ry="4" strokeDasharray="2 2" opacity="0.6" transform="rotate(-25 12 12)" />
  </svg>
);

export const IconNucleus: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const IconBrackets: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M8 4H4v16h4" />
    <path d="M16 4h4v16h-4" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const IconCortical: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8c0 3-1.6 5.5-4 7l-4 3-4-3c-2.4-1.5-4-4-4-7z" />
    <path d="M12 4v16" opacity="0.4" />
    <path d="M7 9c2 1 3 3 5 3s3-2 5-3" />
    <path d="M8 15c1.5.8 2.5 1.5 4 1.5s2.5-.7 4-1.5" />
  </svg>
);

export const IconAgents: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="6" r="2.5" />
    <circle cx="6" cy="16" r="2.5" />
    <circle cx="18" cy="16" r="2.5" />
    <line x1="12" y1="8.5" x2="7.5" y2="14" />
    <line x1="12" y1="8.5" x2="16.5" y2="14" />
    <line x1="8.5" y1="16" x2="15.5" y2="16" strokeDasharray="2 2" />
  </svg>
);

export const IconStarter: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <polygon points="12 2 2 7 12 12 22 7" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
);

export const IconGitHub: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const IconLinkedIn: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const IconEmail: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const IconWebsite: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 4l6.5 7.5L4 20h2l5.5-6.5L16 20h4l-7-8 6.5-8h-2l-5 6L8 4H4z" />
  </svg>
);

export const IconInstagram: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const IconYouTube: React.FC<IconProps> = ({ className = '', size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export const IconByTag: React.FC<{ iconName: string; size?: number; className?: string }> = ({
  iconName,
  size = 20,
  className = '',
}) => {
  switch (iconName) {
    case 'neural':
      return <IconNeural size={size} className={className} />;
    case 'compiler':
      return <IconCompiler size={size} className={className} />;
    case 'sentinel':
      return <IconSentinel size={size} className={className} />;
    case 'web3':
      return <IconWeb3Guard size={size} className={className} />;
    case 'os':
      return <IconAayuOS size={size} className={className} />;
    case 'adumate':
      return <IconAdumate size={size} className={className} />;
    case 'nucleus':
      return <IconNucleus size={size} className={className} />;
    case 'brackets':
      return <IconBrackets size={size} className={className} />;
    case 'cortical':
      return <IconCortical size={size} className={className} />;
    case 'agents':
      return <IconAgents size={size} className={className} />;
    case 'starter':
      return <IconStarter size={size} className={className} />;
    default:
      return <IconNeural size={size} className={className} />;
  }
};

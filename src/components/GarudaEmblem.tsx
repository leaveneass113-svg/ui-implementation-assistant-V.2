import React from 'react';

export const GarudaEmblem: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 75,
  height = 80,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 215"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ตราครุฑ"
    >
      {/* Crown (Phra Kiew / Chada) */}
      <path
        d="M100 12 L106 32 L103 48 L114 58 L100 70 L86 58 L97 48 L94 32 Z"
        fill="#1E1E1E"
      />
      <circle cx="100" cy="18" r="4" fill="#1E1E1E" />
      <path d="M100 22 L102 36 L98 36 Z" fill="#1E1E1E" />

      {/* Head & Beak */}
      <path
        d="M93 70 C93 64, 107 64, 107 70 C109 76, 106 82, 100 86 C94 82, 91 76, 93 70 Z"
        fill="#1E1E1E"
      />
      {/* Beak */}
      <path d="M100 83 L104 94 L100 97 L96 94 Z" fill="#1E1E1E" />
      {/* Eyes */}
      <circle cx="96" cy="74" r="1.5" fill="#FFFFFF" />
      <circle cx="104" cy="74" r="1.5" fill="#FFFFFF" />

      {/* Torso & Neck Ornaments */}
      <path d="M91 86 L109 86 L113 115 L100 132 L87 115 Z" fill="#1E1E1E" />
      <path d="M96 92 L104 92 L106 108 L100 118 L94 108 Z" fill="#FFFFFF" />
      <path d="M98 95 L102 95 L103 105 L100 110 L97 105 Z" fill="#1E1E1E" />

      {/* Main Wings Left */}
      <path
        d="M87 90 C70 75, 45 65, 15 65 C28 80, 40 98, 55 115 C40 112, 25 105, 10 95 C22 110, 36 128, 52 140 C38 138, 22 132, 12 125 C25 140, 42 152, 60 158 C50 158, 38 156, 28 152 C42 165, 62 170, 80 166 L86 125 Z"
        fill="#1E1E1E"
      />

      {/* Main Wings Right */}
      <path
        d="M113 90 C130 75, 155 65, 185 65 C172 80, 160 98, 145 115 C160 112, 175 105, 190 95 C178 110, 164 128, 148 140 C162 138, 178 132, 188 125 C175 140, 158 152, 140 158 C150 158, 162 156, 172 152 C158 165, 138 170, 120 166 L114 125 Z"
        fill="#1E1E1E"
      />

      {/* Wing Feather Accents */}
      <path d="M85 96 C72 86, 55 78, 35 78 C45 90, 58 104, 70 118 Z" fill="#FFFFFF" />
      <path d="M115 96 C128 86, 145 78, 165 78 C155 90, 142 104, 130 118 Z" fill="#FFFFFF" />

      {/* Lower Belt / Sangwan & Legs */}
      <path d="M83 130 L117 130 L122 155 L100 175 L78 155 Z" fill="#1E1E1E" />
      <path d="M88 135 L112 135 L115 152 L100 165 L85 152 Z" fill="#FFFFFF" />

      {/* Claws & Feet */}
      <path d="M75 150 L60 178 L70 180 L80 162 Z" fill="#1E1E1E" />
      <path d="M125 150 L140 178 L130 180 L120 162 Z" fill="#1E1E1E" />

      {/* Tail Feathers */}
      <path
        d="M100 145 L88 185 L78 208 L100 198 L122 208 L112 185 Z"
        fill="#1E1E1E"
      />
      <path d="M100 155 L93 185 L88 200 L100 192 L112 200 L107 185 Z" fill="#FFFFFF" />
      <path d="M100 165 L96 185 L94 195 L100 188 L106 195 L104 185 Z" fill="#1E1E1E" />
    </svg>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  showText?: boolean;
  iconOnly?: boolean;
}

export default function Logo({
  className = "h-12 w-auto",
  variant = 'color',
  iconOnly = false,
}: LogoProps) {
  if (iconOnly) {
    return (
      <svg 
        viewBox="0 0 120 120" 
        className={`${className} select-none`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definition of Gradients */}
        <defs>
          <linearGradient id="butterfly-yellow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#FFD400" />
          </linearGradient>
        </defs>

        {/* Colorful Butterfly */}
        <g id="butterfly" transform="translate(5, 5)">
          {/* Antennae */}
          <path 
            d="M 58,68 C 54,46 40,42 43,36" 
            className="stroke-neutral-800 dark:stroke-neutral-200"
            strokeWidth="1.8" 
            strokeLinecap="round" 
            fill="none"
          />
          <circle cx="43" cy="36" r="2" className="fill-neutral-800 dark:fill-neutral-200" />
          
          <path 
            d="M 60,68 C 64,46 78,42 75,36" 
            className="stroke-neutral-800 dark:stroke-neutral-200"
            strokeWidth="1.8" 
            strokeLinecap="round" 
            fill="none"
          />
          <circle cx="75" cy="36" r="2" className="fill-neutral-800 dark:fill-neutral-200" />

          {/* Left Top Wing - Magenta */}
          <path 
            d="M 58,80 C 40,78 12,68 10,52 C 8,36 32,32 58,68 Z" 
            fill="#E5007D" 
          />
          {/* Left Top Wing Accents */}
          <path 
            d="M 54,76 C 42,74 22,66 20,56 C 18,50 35,46 54,72 Z" 
            fill="#FF8EC6" 
            className="opacity-70"
          />
          <path 
            d="M 50,72 C 40,70 28,64 26,58 C 24,54 36,52 50,68 Z" 
            fill="#FFFFFF" 
            className="opacity-40"
          />

          {/* Left Bottom Wing - Cyan/Blue */}
          <path 
            d="M 58,80 C 42,94 15,102 18,116 C 21,126 43,122 58,88 Z" 
            fill="#009EE0" 
          />
          {/* Left Bottom Wing Accent - Yellow Petal */}
          <path 
            d="M 52,86 C 42,94 28,100 30,108 C 32,112 44,108 52,94 Z" 
            fill="#FFD400" 
          />
          <path 
            d="M 46,92 C 38,98 29,102 31,106 C 32,108 38,106 44,98 Z" 
            fill="#FFFFFF" 
            className="opacity-40"
          />

          {/* Right Top Wing - Golden Yellow */}
          <path 
            d="M 60,80 C 78,78 108,68 110,52 C 112,36 88,32 60,68 Z" 
            fill="url(#butterfly-yellow-grad)" 
          />
          {/* Right Top Wing Accent - Magenta */}
          <path 
            d="M 64,76 C 76,74 96,66 98,56 C 100,50 83,46 64,72 Z" 
            fill="#E5007D" 
            className="opacity-80"
          />
          <path 
            d="M 68,72 C 76,70 88,64 90,58 C 92,54 81,52 68,68 Z" 
            fill="#FFFFFF" 
            className="opacity-40"
          />

          {/* Right Bottom Wing - Cyan/Blue */}
          <path 
            d="M 60,80 C 78,94 103,102 100,116 C 97,126 75,122 60,88 Z" 
            fill="#009EE0" 
          />
          {/* Right Bottom Wing Accent */}
          <path 
            d="M 64,84 C 74,92 90,98 88,106 C 86,110 74,106 64,92 Z" 
            fill="#FFFFFF" 
            className="opacity-40"
          />

          {/* Body / Thorax */}
          <path 
            d="M 59,62 C 61,62 62,70 62,82 C 62,94 61,102 59,102 C 57,102 56,94 56,82 C 56,70 57,62 59,62 Z" 
            className="fill-neutral-900 dark:fill-neutral-100" 
          />
        </g>
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 460 160" 
      className={`${className} select-none`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definition of Gradients & Filters */}
      <defs>
        {/* J gradient - Royal deep blue to vibrant blue/cyan */}
        <linearGradient id="j-gradient" x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor="#012350" />
          <stop offset="60%" stopColor="#004DA3" />
          <stop offset="100%" stopColor="#0088CC" />
        </linearGradient>

        {/* h gradient - Warm yellow orange to gold */}
        <linearGradient id="h-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FFD400" />
        </linearGradient>

        {/* Butterfly yellow gradient */}
        <linearGradient id="butterfly-yellow-grad-full" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FFD400" />
        </linearGradient>
      </defs>

      {/* 1. Colorful Butterfly on the Left */}
      <g id="butterfly" transform="translate(5, 5)">
        {/* Antennae */}
        <path 
          d="M 58,68 C 54,46 40,42 43,36" 
          className="stroke-neutral-800 dark:stroke-neutral-200"
          strokeWidth="1.8" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="43" cy="36" r="2" className="fill-neutral-800 dark:fill-neutral-200" />
        
        <path 
          d="M 60,68 C 64,46 78,42 75,36" 
          className="stroke-neutral-800 dark:stroke-neutral-200"
          strokeWidth="1.8" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="75" cy="36" r="2" className="fill-neutral-800 dark:fill-neutral-200" />

        {/* Left Top Wing - Magenta */}
        <path 
          d="M 58,80 C 40,78 12,68 10,52 C 8,36 32,32 58,68 Z" 
          fill="#E5007D" 
        />
        {/* Left Top Wing Accents */}
        <path 
          d="M 54,76 C 42,74 22,66 20,56 C 18,50 35,46 54,72 Z" 
          fill="#FF8EC6" 
          className="opacity-70"
        />
        <path 
          d="M 50,72 C 40,70 28,64 26,58 C 24,54 36,52 50,68 Z" 
          fill="#FFFFFF" 
          className="opacity-40"
        />

        {/* Left Bottom Wing - Cyan/Blue */}
        <path 
          d="M 58,80 C 42,94 15,102 18,116 C 21,126 43,122 58,88 Z" 
          fill="#009EE0" 
        />
        {/* Left Bottom Wing Accent - Yellow Petal */}
        <path 
          d="M 52,86 C 42,94 28,100 30,108 C 32,112 44,108 52,94 Z" 
          fill="#FFD400" 
        />
        <path 
          d="M 46,92 C 38,98 29,102 31,106 C 32,108 38,106 44,98 Z" 
          fill="#FFFFFF" 
          className="opacity-40"
        />

        {/* Right Top Wing - Golden Yellow */}
        <path 
          d="M 60,80 C 78,78 108,68 110,52 C 112,36 88,32 60,68 Z" 
          fill="url(#butterfly-yellow-grad-full)" 
        />
        {/* Right Top Wing Accent - Magenta */}
        <path 
          d="M 64,76 C 76,74 96,66 98,56 C 100,50 83,46 64,72 Z" 
          fill="#E5007D" 
          className="opacity-80"
        />
        <path 
          d="M 68,72 C 76,70 88,64 90,58 C 92,54 81,52 68,68 Z" 
          fill="#FFFFFF" 
          className="opacity-40"
        />

        {/* Right Bottom Wing - Cyan/Blue */}
        <path 
          d="M 60,80 C 78,94 103,102 100,116 C 97,126 75,122 60,88 Z" 
          fill="#009EE0" 
        />
        {/* Right Bottom Wing Accent */}
        <path 
          d="M 64,84 C 74,92 90,98 88,106 C 86,110 74,106 64,92 Z" 
          fill="#FFFFFF" 
          className="opacity-40"
        />

        {/* Body / Thorax */}
        <path 
          d="M 59,62 C 61,62 62,70 62,82 C 62,94 61,102 59,102 C 57,102 56,94 56,82 C 56,70 57,62 59,62 Z" 
          className="fill-neutral-900 dark:fill-neutral-100" 
        />
      </g>

      {/* 2. Custom serif "J" with elegant sweeping cursive tail under the butterfly */}
      <path 
        d="M 135,46 
           L 185,46 
           L 185,53 
           L 173,53 
           L 173,95 
           C 173,115 160,128 140,135 
           C 115,143 80,143 55,128 
           C 35,115 32,90 42,72 
           C 48,60 62,55 72,62 
           C 80,68 82,78 76,84 
           C 70,90 62,88 58,80 
           C 56,76 58,70 64,70 
           C 56,70 50,78 48,88 
           C 46,102 55,116 72,122 
           C 92,128 118,124 135,112 
           C 150,100 156,88 156,78 
           L 156,53 
           L 145,53 
           Z" 
        fill="url(#j-gradient)"
      />

      {/* 3. Styled Typography "yothi" */}
      <g id="typography">
        {/* y - Magenta */}
        <text 
          x="178" 
          y="102" 
          fill="#E5007D" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="76" 
          fontWeight="900"
          className="select-none"
        >
          y
        </text>

        {/* o - Cyan with built-in CMYK register mark */}
        <text 
          x="222" 
          y="102" 
          fill="#009EE0" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="76" 
          fontWeight="900"
          className="select-none"
        >
          o
        </text>

        {/* CMYK Target Center in 'o' */}
        <g id="cmyk-target" transform="translate(251, 74)">
          {/* Circular frame */}
          <circle cx="0" cy="0" r="14" stroke="#231F20" strokeWidth="1.2" className="dark:stroke-neutral-300" fill="none" />
          
          {/* 4 Quadrants representing ink separations */}
          <path d="M 0,0 L 0,-14 A 14,14 0 0,1 14,0 Z" fill="#E5007D" /> {/* Magenta Top Right */}
          <path d="M 0,0 L 14,0 A 14,14 0 0,1 0,14 Z" fill="#FFD400" />  {/* Yellow Bottom Right */}
          <path d="M 0,0 L 0,14 A 14,14 0 0,1 -14,0 Z" fill="#231F20" />  {/* Black Bottom Left */}
          <path d="M 0,0 L -14,0 A 14,14 0 0,1 0,-14 Z" fill="#009EE0" /> {/* Cyan Top Left */}

          {/* Crosshairs */}
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#231F20" strokeWidth="1.5" className="dark:stroke-neutral-200" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="#231F20" strokeWidth="1.5" className="dark:stroke-neutral-200" />
          <circle cx="0" cy="0" r="4" fill="white" stroke="#231F20" strokeWidth="1" />
        </g>

        {/* t - Adaptive Charcoal */}
        <text 
          x="278" 
          y="102" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="76" 
          fontWeight="900"
          className="fill-neutral-900 dark:fill-neutral-100 select-none"
        >
          t
        </text>

        {/* h - Golden Yellow Gradient */}
        <text 
          x="310" 
          y="102" 
          fill="url(#h-gradient)" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="76" 
          fontWeight="900"
          className="select-none"
        >
          h
        </text>

        {/* i - Cyan with Magenta Dot */}
        <text 
          x="364" 
          y="102" 
          fill="#009EE0" 
          fontFamily="Georgia, 'Times New Roman', serif" 
          fontSize="76" 
          fontWeight="900"
          className="select-none"
        >
          i
        </text>
        <circle cx="376" cy="46" r="6.5" fill="#E5007D" />
      </g>

      {/* 4. Sinuous Wave / Color Sweeps underneath the text */}
      <g id="sweeps" transform="translate(0, 5)">
        {/* Cyan wave */}
        <path 
          d="M 145,116 C 220,128 320,130 435,104" 
          stroke="#009EE0" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
        {/* Magenta wave */}
        <path 
          d="M 160,121 C 230,133 325,135 430,110" 
          stroke="#E5007D" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
        {/* Yellow wave */}
        <path 
          d="M 175,126 C 240,138 330,140 425,116" 
          stroke="#FFD400" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
        {/* Charcoal wave */}
        <path 
          d="M 190,131 C 250,143 335,145 420,122" 
          className="stroke-neutral-900 dark:stroke-neutral-100" 
          strokeWidth="4" 
          strokeLinecap="round" 
          fill="none"
        />
      </g>

      {/* 5. Subtext: PRINT STUDIO with decorative horizontal lines */}
      <g id="print-studio" transform="translate(0, 5)">
        {/* Cyan accent line left */}
        <line x1="95" y1="145" x2="150" y2="145" stroke="#009EE0" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Subtitle */}
        <text 
          x="265" 
          y="150" 
          className="fill-neutral-900 dark:fill-neutral-100 select-none font-sans font-black tracking-[0.45em] text-[13px]" 
          textAnchor="middle"
        >
          PRINT STUDIO
        </text>
        
        {/* Cyan accent line right */}
        <line x1="380" y1="145" x2="435" y2="145" stroke="#009EE0" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

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
  variant = "color",
  showText = true,
  iconOnly = false,
}: LogoProps) {
  // Brand color scheme configuration
  const magentaColor = "#EC008C"; // Vibrant Pink/Magenta
  const cyanColor = "#0091FF";    // Process Cyan/Light Blue
  const yellowColor = "#FFD200";  // Golden Yellow
  const blueColor = "#003E8A";    // Deep Royal Blue
  
  // Charcoal elements dynamically adapt to white on dark backgrounds for accessibility
  const charcoalColor = variant === "dark" ? "#F5F5F5" : "#231F20";
  const butterflyBodyColor = variant === "dark" ? "#E5E5E5" : "#231F20";

  // Reusable Butterfly component to keep both modes high-fidelity
  const renderButterfly = () => (
    <g id="butterfly-graphics">
      {/* Top-Left Wing (Magenta-Pink) */}
      <path
        d="M135,160 C120,140 85,80 35,95 C10,105 15,140 40,155 C70,175 110,170 135,160 Z"
        fill={magentaColor}
      />
      {/* Left-Top internal details (lighter pink highlights for layered vector effect) */}
      <path
        d="M115,148 C100,135 75,115 50,122 C45,125 55,135 75,138 Z"
        fill="#FFA6DF"
        opacity="0.8"
      />
      <path
        d="M120,155 C105,150 85,142 70,148 C65,152 75,158 90,155 Z"
        fill="#FFA6DF"
        opacity="0.8"
      />

      {/* Bottom-Left Wing (Cyan-Blue) */}
      <path
        d="M135,165 C115,170 75,170 75,205 C75,235 105,250 120,235 C130,225 133,200 135,165 Z"
        fill={cyanColor}
      />
      {/* Yellow Drop inside Bottom-Left Wing (Matches original logo) */}
      <path
        d="M98,198 C88,206 82,218 85,225 C90,232 100,225 104,212 Z"
        fill={yellowColor}
      />
      {/* White accent inside Bottom-Left Wing */}
      <path
        d="M120,178 C112,183 100,188 95,200 C98,200 106,192 115,183 Z"
        fill="#FFFFFF"
        opacity="0.7"
      />

      {/* Top-Right Wing (Yellow-Orange) */}
      <path
        d="M145,158 C160,115 200,90 220,125 C235,150 215,190 185,205 C170,212 155,212 145,208 Z"
        fill={yellowColor}
      />
      {/* White Teardrop accent inside Top-Right Wing (Matches original logo) */}
      <path
        d="M160,150 C175,125 195,105 208,115 C215,122 205,142 185,162 C172,172 162,168 160,150 Z"
        fill="#FFFFFF"
        opacity="0.85"
      />

      {/* Bottom-Right Wing (Cyan/Light Blue) */}
      <path
        d="M145,215 C150,247 165,282 190,282 C210,282 210,247 190,227 C175,215 155,213 145,215 Z"
        fill={cyanColor}
      />
      {/* White accent inside Bottom-Right Wing */}
      <path
        d="M155,222 C168,230 180,248 185,260 C178,260 166,242 155,230 Z"
        fill="#FFFFFF"
        opacity="0.75"
      />

      {/* Butterfly Antennae & Body */}
      {/* Antennae with circular heads */}
      <path
        d="M138,150 Q130,115 110,105 M142,148 Q152,112 165,100"
        stroke={butterflyBodyColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="110" cy="105" r="4.5" fill={butterflyBodyColor} />
      <circle cx="165" cy="100" r="4.5" fill={butterflyBodyColor} />

      {/* Body tilted slightly for organic flying angle */}
      <ellipse cx="140" cy="165" rx="3.5" ry="16" fill={butterflyBodyColor} transform="rotate(-15 140 165)" />
    </g>
  );

  // If iconOnly is specified (e.g., for tiny mobile avatars), we display just the premium butterfly
  if (iconOnly) {
    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <svg
          viewBox="30 80 195 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
          id="jyothi-logo-butterfly-svg"
        >
          {renderButterfly()}
        </svg>
      </div>
    );
  }

  // Otherwise, return the complete high-fidelity branded SVG wordmark
  return (
    <div className={`flex items-center select-none ${className}`}>
      <svg
        viewBox="15 35 590 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        id="jyothi-logo-svg"
      >
        {/* Left Side: Butterfly graphic */}
        {renderButterfly()}

        {/* Custom Typography "Jyothi" */}
        <g id="typography">
          {/* J - Elegant serif dark blue letter swooping down */}
          <path
            d="M185,140 H250 M218,140 V240 C218,290 170,305 130,285 C115,278 110,265 125,255 C145,240 185,250 185,225 V140 Z"
            fill={blueColor}
          />

          {/* y - Magenta/pink */}
          <path
            d="M245,180 L265,235 L285,180 H300 L270,255 C260,280 250,290 235,285 L230,270 C240,270 248,260 252,248 L232,180 H245 Z"
            fill={magentaColor}
          />

          {/* o - Blue circle with a CMYK color registration target inside */}
          <g id="letter-o">
            {/* Outer Circle of 'o' (vivid process blue) */}
            <path
              d="M335,175 C310,175 295,195 295,220 C295,245 310,265 335,265 C360,265 375,245 375,220 C375,195 360,175 335,175 Z M335,190 C348,190 357,202 357,220 C357,238 348,250 335,250 C322,250 313,238 313,220 C313,202 322,190 335,190 Z"
              fill="#0070C0"
            />
            {/* White masking circle disk under target to provide perfect legibility */}
            <circle cx="335" cy="220" r="18" fill="#FFFFFF" />
            
            {/* Registration Mark Center Alignment target inside the hole of 'o' */}
            <circle cx="335" cy="220" r="16" stroke={charcoalColor} strokeWidth="1.5" fill="none" />
            <circle cx="335" cy="220" r="8" fill="none" stroke={charcoalColor} strokeWidth="1" />
            {/* Hairlines */}
            <path d="M335,204 V236 M319,220 H351" stroke={charcoalColor} strokeWidth="1.5" />
            
            {/* Four high-contrast CMYK quadrants */}
            {/* Cyan quadrant (Top Left) */}
            <path d="M335,212 A8,8 0 0,0 327,220 H335 V212 Z" fill={cyanColor} />
            {/* Magenta quadrant (Top Right) */}
            <path d="M335,212 V220 H343 A8,8 0 0,0 335,212 Z" fill={magentaColor} />
            {/* Yellow quadrant (Bottom Right) */}
            <path d="M335,220 H343 A8,8 0 0,1 335,228 V220 Z" fill={yellowColor} />
            {/* Black/Key quadrant (Bottom Left) */}
            <path d="M327,220 A8,8 0 0,0 335,228 V220 H327 Z" fill={charcoalColor} />
          </g>

          {/* t - Charcoal/Black (Swaps to white/light on dark theme) */}
          <path
            d="M390,160 H402 V180 H415 V192 H402 V242 C402,250 406,254 413,254 C417,254 420,252 422,250 L425,262 C418,266 410,266 403,266 C392,266 388,258 388,245 V192 H380 V180 H388 V160 Z"
            fill={charcoalColor}
          />

          {/* h - Vibrant Yellow */}
          <path
            d="M435,145 H448 V192 C455,182 465,176 475,176 C492,176 500,188 500,208 V262 H487 V210 C487,198 482,190 472,190 C462,190 452,198 448,208 V262 H435 V145 Z"
            fill={yellowColor}
          />

          {/* i - Process Cyan body with Magenta/Pink dot */}
          <g id="letter-i">
            <rect x="512" y="180" width="13" height="82" rx="3" fill="#00A8FF" />
            <circle cx="518.5" cy="155" r="9" fill={magentaColor} />
          </g>
        </g>

        {/* CMYK Swoosh Waves flowing underneath typography */}
        <g id="waves">
          {/* Blue Swash */}
          <path
            d="M120,295 Q280,380 500,270 Q560,240 600,265 Q500,310 320,330 Q180,330 120,295 Z"
            fill="#0070C0"
            opacity="0.85"
          />
          {/* Magenta Swash */}
          <path
            d="M150,298 Q290,375 480,268 Q540,235 590,258 Q490,298 330,315 Q190,315 150,298 Z"
            fill={magentaColor}
            opacity="0.85"
          />
          {/* Yellow Swash */}
          <path
            d="M180,301 Q300,370 460,266 Q520,230 580,250 Q480,288 340,302 Q200,302 180,301 Z"
            fill={yellowColor}
            opacity="0.9"
          />
          {/* Black / Charcoal Swash */}
          <path
            d="M210,305 Q310,365 440,264 Q500,225 570,242 Q470,278 350,290 Q220,290 210,305 Z"
            fill={charcoalColor}
            opacity="0.95"
          />
        </g>

        {/* Subtitle text: "PRINTING WORKS" */}
        {showText && (
          <g id="printing-works">
            {/* Left rule line (Cyan) */}
            <line x1="145" y1="350" x2="210" y2="350" stroke="#0091FF" strokeWidth="4" strokeLinecap="round" />
            
            {/* Underline Subheading text */}
            <text
              x="360"
              y="358"
              fontFamily="'Montserrat', 'Inter', sans-serif"
              fontSize="28"
              fontWeight="700"
              letterSpacing="7"
              fill={charcoalColor}
              textAnchor="middle"
            >
              PRINTING WORKS
            </text>
            
            {/* Right rule line (Magenta) */}
            <line x1="510" y1="350" x2="575" y2="350" stroke={magentaColor} strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

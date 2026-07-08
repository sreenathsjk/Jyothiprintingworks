/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, 
  Sparkles, 
  Upload, 
  Type, 
  Palette, 
  Maximize2, 
  Check, 
  ShoppingBag, 
  RefreshCw,
  Sliders,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  FileText,
  X,
  FileCheck,
  FileUp
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { CustomApparelDesign, CartItem } from '../types';

interface CustomStudioProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onNavigateToCart: () => void;
}

const GARMENTS = [
  { id: 'tshirt', name: 'Premium Oversized Tee', basePrice: 499, desc: '240 GSM heavy combed cotton, modern boxy drape' },
  { id: 'hoodie', name: 'Streetwear Heavy Hoodie', basePrice: 1199, desc: '400 GSM heavyweight organic cotton fleece blend' },
  { id: 'sweatshirt', name: 'Minimalist Sweatshirt', basePrice: 999, desc: '350 GSM premium cotton loopback knit fabric' },
  { id: 'polo', name: 'Classic Pique Polo', basePrice: 599, desc: '220 GSM ring-spun cotton, durable structured rib collar' }
];

const FABRIC_COLORS = [
  { name: 'Midnight Black', hex: '#0B0B0C', textHex: '#FFFFFF' },
  { name: 'Off-White', hex: '#F5F5F7', textHex: '#0B0B0C' },
  { name: 'Sage Green', hex: '#586359', textHex: '#FFFFFF' },
  { name: 'Royal Blue', hex: '#1D4ED8', textHex: '#FFFFFF' },
  { name: 'Mustard Yellow', hex: '#EAB308', textHex: '#0B0B0C' },
  { name: 'Crimson Red', hex: '#DC2626', textHex: '#FFFFFF' }
];

const PRINT_METHODS = [
  { id: 'screen', name: 'High-Density Screen Print', surcharge: 50, desc: 'Multi-pass wash-resistant high contrast ink layering' },
  { id: 'digital', name: 'Photographic DTG Print', surcharge: 100, desc: 'High resolution digital printing with zero feel soft handfeel' },
  { id: 'foil', name: 'Luxury Metallic Gold Foil', surcharge: 150, desc: 'Highly reflective high-sheen gold alloy metallic bonding' },
  { id: 'embroidery', name: 'Precision Satin Embroidery', surcharge: 200, desc: 'Dense 3D dimensional stitching with high-lustre threads' }
];

const STICKERS = [
  { name: 'Vaporwave Samurai', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=200' },
  { name: 'Cyberpunk Oni Mask', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200' },
  { name: 'Aesthetic Sakura', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=200' },
  { name: 'Retro Astronaut', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200' }
];

const TEXT_COLORS = [
  { name: 'Volt Green', hex: '#CCFF00' },
  { name: 'Neon Pink', hex: '#FF1493' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Deep Black', hex: '#0B0B0C' },
  { name: 'Metallic Gold', hex: '#FFD700' }
];

const FONTS = [
  { name: 'Space Grotesk', class: 'font-sans' },
  { name: 'JetBrains Mono', class: 'font-mono' },
  { name: 'Playfair Display', class: 'font-serif' },
  { name: 'Impact Sans', class: 'font-sans font-black uppercase' }
];

export default function CustomStudio({ onAddToCart, onNavigateToCart }: CustomStudioProps) {
  const [design, setDesign] = useState<CustomApparelDesign>({
    garmentType: 'tshirt',
    color: FABRIC_COLORS[0],
    printMethod: 'screen',
    customText: 'STREET CULTURE',
    textPosition: 'chest',
    fontFamily: 'Space Grotesk',
    textColor: '#FFFFFF',
    stickerUrl: STICKERS[0].url
  });

  const [textSize, setTextSize] = useState<number>(14);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('L');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print preview interactive zoom state
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  // High-resolution print-ready drop zone file upload states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dropZoneInputRef = useRef<HTMLInputElement>(null);

  // Calculate customized final item pricing
  const currentGarment = GARMENTS.find(g => g.id === design.garmentType) || GARMENTS[0];
  const currentPrint = PRINT_METHODS.find(p => p.id === design.printMethod) || PRINT_METHODS[0];
  const itemPrice = currentGarment.basePrice + currentPrint.surcharge;

  const handleColorChange = (color: typeof FABRIC_COLORS[0]) => {
    setDesign(prev => ({ ...prev, color }));
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setDesign(prev => ({ ...prev, stickerUrl: undefined, customLogoUrl: url }));
    }
  };

  const handleClearUpload = () => {
    setUploadedImage(null);
    setDesign(prev => ({ ...prev, customLogoUrl: undefined, stickerUrl: STICKERS[0].url }));
  };

  // Real PDF/PNG production file upload to Firebase Storage
  const handleUploadPrintReadyFile = (file: File) => {
    const fileType = file.type;
    const name = file.name;
    const isPdf = fileType === 'application/pdf' || name.toLowerCase().endsWith('.pdf');
    const isPng = fileType === 'image/png' || name.toLowerCase().endsWith('.png');

    if (!isPdf && !isPng) {
      setUploadError('Invalid format. Please submit a print-ready vector PDF or high-resolution PNG file.');
      setUploadStatus('error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB. Please optimize your high-res design file.');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setUploadError(null);

    // Dynamic clean storage path
    const storageRef = ref(storage, `print_designs/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error('Firebase Storage upload error:', error);
        setUploadError('Upload failed due to a network interruption. Please retry.');
        setUploadStatus('error');
      }, 
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setDesign(prev => ({
            ...prev,
            printReadyFileUrl: downloadUrl,
            printReadyFileName: file.name
          }));
          setUploadedFileName(file.name);
          setUploadStatus('success');
        } catch (err) {
          console.error('Download URL extraction error:', err);
          setUploadError('Failed to parse final storage reference.');
          setUploadStatus('error');
        }
      }
    );
  };

  const handleClearPrintReadyFile = () => {
    setDesign(prev => ({
      ...prev,
      printReadyFileUrl: undefined,
      printReadyFileName: undefined
    }));
    setUploadedFileName('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
  };

  // Drag and Drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadPrintReadyFile(file);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      productId: `custom-${design.garmentType}`,
      title: `Custom ${currentGarment.name}`,
      price: itemPrice,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400', // representative image
      color: design.color,
      size: selectedSize,
      quantity: 1,
      isCustom: true,
      customDesign: design
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Live Apparel Customizer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-none mb-4">
            Customization Studio
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            Create custom streetwear items dynamically. Configure fabric backdrops, place premium vector illustrations, type customized slogans, and add them directly to your checkout cart.
          </p>
        </div>

        {/* Studio Workspace Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: 3D-Like Garment Mockup Stage (Cols 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 flex flex-col items-center justify-between shadow-sm relative min-h-[480px]">
            
            {/* Top info badge */}
            <div className="w-full flex justify-between items-center z-10">
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                Digital Mockup Stage (Active View)
              </span>
              <button
                onClick={() => {
                  setDesign({
                    garmentType: 'tshirt',
                    color: FABRIC_COLORS[0],
                    printMethod: 'screen',
                    customText: 'STREET CULTURE',
                    textPosition: 'chest',
                    fontFamily: 'Space Grotesk',
                    textColor: '#FFFFFF',
                    stickerUrl: STICKERS[0].url
                  });
                  setUploadedImage(null);
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-400 hover:text-orange-500 transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                title="Reset Workspace"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Interactive Virtual T-shirt Rendering Viewport */}
            <div className="relative w-full h-[380px] rounded-3xl overflow-hidden bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-150 dark:border-neutral-850 flex items-center justify-center mt-6">
              
              {/* Virtual Garment Backdrop (scaled based on zoomScale) */}
              <div 
                className="relative h-72 w-72 sm:h-80 sm:w-80 rounded-full flex items-center justify-center shadow-inner transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
                style={{ 
                  backgroundColor: design.color.hex,
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center'
                }}
              >
                {/* Virtual Stitch Neckline Accent */}
                <div className="absolute top-4 h-12 w-16 border-b border-white/10 rounded-full" />

                {/* Left/Right Sleeve stitching mockups */}
                <div className="absolute left-6 w-3 h-10 border-r border-white/10 rounded-full" />
                <div className="absolute right-6 w-3 h-10 border-l border-white/10 rounded-full" />

                {/* Placed Artwork Frame Container */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4 p-4 max-w-[70%] text-center select-none">
                  
                  {/* Uploaded or selected image */}
                  {(uploadedImage || design.stickerUrl) && (
                    <img
                      src={uploadedImage || design.stickerUrl}
                      alt="Custom sticker"
                      className="h-28 w-28 sm:h-32 sm:w-32 object-contain rounded-xl shadow-lg border border-white/5 bg-black/5"
                    />
                  )}

                  {/* Dynamic Text placement */}
                  {design.customText && (
                    <div 
                      className={`font-semibold tracking-wide transition-all`}
                      style={{ 
                        color: design.textColor,
                        fontSize: `${textSize}px`,
                        fontFamily: design.fontFamily
                      }}
                    >
                      {design.customText}
                    </div>
                  )}

                </div>

                {/* Subdued watermarked brand name */}
                <div className="absolute bottom-4 text-[9px] font-black uppercase tracking-widest text-white/15">
                  Jyothi studio lab
                </div>
              </div>

              {/* Floating Zoom Control Overlay */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 p-1.5 rounded-full shadow-lg">
                <button
                  onClick={() => setZoomScale(prev => Math.max(1.0, prev - 0.25))}
                  disabled={zoomScale <= 1.0}
                  className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-[10px] font-black tracking-wider text-neutral-500 dark:text-neutral-400 px-1 min-w-[36px] text-center select-none">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.25))}
                  disabled={zoomScale >= 2.5}
                  className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                {zoomScale !== 1.0 && (
                  <button
                    onClick={() => setZoomScale(1.0)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-500 hover:text-red-500 transition-all cursor-pointer border-l border-neutral-200 dark:border-neutral-800 pl-2"
                    title="Reset Zoom"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* Stage bottom info tag */}
            <div className="w-full text-center bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-850 mt-4 flex items-center justify-between">
              <div className="text-left">
                <span className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest">Active specifications</span>
                <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                  {currentGarment.name} • {design.color.name}
                </span>
              </div>
              <span className="text-xs font-black text-orange-500 uppercase tracking-wider">
                ₹{itemPrice}
              </span>
            </div>

          </div>

          {/* RIGHT: Dynamic Control Panel Studio Inputs (Cols 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Control Panel Bento Cell 1: Select Garment & Size */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Shirt className="h-5 w-5 text-orange-500" />
                <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">1. Fabric Base Selection</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {GARMENTS.map(garment => (
                  <button
                    key={garment.id}
                    onClick={() => setDesign(prev => ({ ...prev, garmentType: garment.id as any }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] ${
                      design.garmentType === garment.id
                        ? 'bg-orange-500/5 border-orange-500'
                        : 'border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-xs text-neutral-900 dark:text-white leading-tight">
                        {garment.name}
                      </span>
                      <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 leading-normal font-medium">
                        {garment.desc}
                      </span>
                    </div>
                    <span className="block text-xs font-black text-orange-500 mt-2">
                      Base: ₹{garment.basePrice}
                    </span>
                  </button>
                ))}
              </div>

              {/* Garment sizing choice */}
              <div className="pt-2">
                <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider mb-2">
                  Select Garment Size
                </label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-10 w-12 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-850 dark:text-neutral-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Control Panel Bento Cell 2: Fabric Color & Graphic / Uploads */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left space-y-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-orange-500" />
                <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">2. Aesthetics & Graphics</h3>
              </div>

              {/* Color Circles */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                  Fabric Color Backdrop
                </label>
                <div className="flex flex-wrap gap-3">
                  {FABRIC_COLORS.map(color => (
                    <button
                      key={color.name}
                      onClick={() => handleColorChange(color)}
                      className={`h-9 w-9 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                        design.color.name === color.name
                          ? 'border-orange-500 scale-110 shadow-md shadow-orange-500/10'
                          : 'border-transparent shadow-sm hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {design.color.name === color.name && (
                        <Check 
                          className="h-4.5 w-4.5" 
                          style={{ color: color.textHex }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticker Selector or Custom Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Vector Presets */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                    Select Graphic Preset
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {STICKERS.map(stk => (
                      <button
                        key={stk.name}
                        onClick={() => {
                          setUploadedImage(null);
                          setDesign(prev => ({ ...prev, stickerUrl: stk.url, customLogoUrl: undefined }));
                        }}
                        className={`aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 p-1 border cursor-pointer transition-all ${
                          design.stickerUrl === stk.url && !uploadedImage
                            ? 'border-orange-500 scale-105 shadow-md'
                            : 'border-neutral-200/50 dark:border-neutral-800 hover:scale-[1.03]'
                        }`}
                        title={stk.name}
                      >
                        <img src={stk.url} alt={stk.name} className="h-full w-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Custom File Upload */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                    Upload Custom Design Logo
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadImage}
                    accept="image/*"
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4.5 w-4.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Design Loaded
                        </span>
                      </div>
                      <button
                        onClick={handleClearUpload}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-15.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer"
                    >
                      <Upload className="h-4.5 w-4.5 text-orange-500" />
                      <span>Select design file (JPG/PNG)</span>
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Control Panel Bento Cell 3: Custom Text Slogans */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-orange-500" />
                <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">3. Typography Slogan Layers</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Custom Headline Text</label>
                  <input
                    type="text"
                    value={design.customText}
                    onChange={(e) => setDesign(prev => ({ ...prev, customText: e.target.value }))}
                    placeholder="Enter slogan"
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Typography Font Style</label>
                  <select
                    value={design.fontFamily}
                    onChange={(e) => setDesign(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full px-4 py-3 text-xs font-semibold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none dark:text-white"
                  >
                    {FONTS.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Text Color Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Text Font Color</label>
                  <div className="flex gap-2">
                    {TEXT_COLORS.map(tc => (
                      <button
                        key={tc.name}
                        onClick={() => setDesign(prev => ({ ...prev, textColor: tc.hex }))}
                        className={`h-7 w-7 rounded-full border border-neutral-200 dark:border-neutral-850 cursor-pointer transition-all ${
                          design.textColor === tc.hex ? 'ring-2 ring-orange-500 scale-105' : 'hover:scale-[1.03]'
                        }`}
                        style={{ backgroundColor: tc.hex }}
                        title={tc.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Text Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                    <span>Text Sizing Scale</span>
                    <span className="text-orange-500">{textSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="28"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Control Panel Bento Cell 4: High-Res Print-Ready Drop Zone */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">4. Print-Ready Artwork Document</h3>
              </div>
              <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                Submit your production-ready, high-resolution graphic vector design files (vector PDF or transparent 300+ DPI PNG). These files will be uploaded directly to Firebase Storage and linked securely to this print order.
              </p>

              {/* Real Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => dropZoneInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                  isDragging
                    ? 'border-orange-500 bg-orange-500/5 scale-[1.01]'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/40'
                }`}
              >
                <input
                  type="file"
                  ref={dropZoneInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPrintReadyFile(file);
                  }}
                  accept=".pdf,image/png"
                  className="hidden"
                />

                {uploadStatus === 'idle' && (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-full">
                      <FileUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        Drag & Drop or Click to Upload
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium mt-1">
                        Accepts high-res vector PDF or PNG (Max 15MB)
                      </p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <div className="w-full space-y-4 max-w-xs mx-auto">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                      <span>Uploading to Firebase Storage</span>
                      <span className="text-orange-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-500 h-full transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-1 text-center">
                      Transmitting production metadata...
                    </p>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full animate-bounce">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Upload Complete!
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-1 max-w-[200px] truncate mx-auto">
                        {uploadedFileName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearPrintReadyFile();
                      }}
                      className="text-[10px] font-black uppercase text-red-500 tracking-wider hover:underline flex items-center gap-1 cursor-pointer mt-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove & Replace
                    </button>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">
                        Upload Interrupted
                      </p>
                      <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1 max-w-[240px] mx-auto">
                        {uploadError}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearPrintReadyFile();
                      }}
                      className="text-[10px] font-black uppercase text-neutral-500 tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Reset Drag Zone
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel Bento Cell 5: Select Printing/Embroidery Method */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-orange-500" />
                <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">5. Craft Print/Embroidery Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PRINT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setDesign(prev => ({ ...prev, printMethod: method.id as any }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[95px] ${
                      design.printMethod === method.id
                        ? 'bg-orange-50/5 border-orange-500 dark:border-orange-500'
                        : 'border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div>
                      <span className="block font-black text-xs text-neutral-900 dark:text-white leading-tight">
                        {method.name}
                      </span>
                      <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 leading-normal font-medium">
                        {method.desc}
                      </span>
                    </div>
                    <span className="block text-xs font-black text-orange-500 mt-2">
                      Surcharge: +₹{method.surcharge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Section */}
            <div className="p-6 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-3xl text-left flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider block">
                  Final customized pricing
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-none">
                    ₹{itemPrice}
                  </span>
                  <span className="text-xs font-medium text-neutral-400 line-through">
                    ₹{itemPrice + 499}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-neutral-400 leading-normal max-w-xs">
                  Includes base premium garment + print/stitch setup. Fully backed by the Jyothi Printing satisfaction guarantee.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                {isAdded ? (
                  <button
                    onClick={onNavigateToCart}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <ShoppingBag className="h-4.5 w-4.5 shrink-0" />
                    <span>View In Cart</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-500/10 active:scale-[0.98]"
                  >
                    <ShoppingBag className="h-4.5 w-4.5 shrink-0" />
                    <span>Add Custom Design to Cart</span>
                  </button>
                )}
              </div>
            </div>

            {/* Direct WhatsApp Consultation Callout */}
            <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-3xl text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <svg 
                    className="h-5 w-5 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.366 9.864-9.736.001-2.596-1.002-5.037-2.83-6.87C16.471 2.163 14.043 1.157 11.451 1.15c-5.438 0-9.867 4.367-9.87 9.742-.001 1.954.512 3.86 1.482 5.585L2.01 22.013l5.837-1.523c.31.18.513.29.8.464zM16.634 13.91c-.27-.135-1.597-.788-1.845-.878-.248-.09-.43-.136-.61.135-.18.272-.697.879-.854 1.059-.157.18-.315.203-.585.068-.27-.136-1.14-.42-2.172-1.341-.803-.717-1.345-1.603-1.502-1.874-.157-.271-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.271.27-.451.09-.18.045-.339-.022-.474-.068-.135-.61-1.472-.836-2.013-.22-.53-.442-.458-.61-.466-.157-.008-.338-.01-.52-.01-.18 0-.473.067-.72.339-.247.271-.944.924-.944 2.253 0 1.329.967 2.61 1.102 2.79.135.18 1.9 2.901 4.6 4.068.643.278 1.144.444 1.536.568.646.206 1.233.176 1.697.108.517-.076 1.598-.653 1.823-1.282.225-.63.225-1.17.157-1.282-.067-.113-.247-.18-.517-.315z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">
                    Need specialty colors, embroidery setups, or dynamic sizing?
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                    Discuss complex print artwork and bulk pricing directly with our design consultant on WhatsApp.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/919182703766?text=${encodeURIComponent("Hello Jyothi Print Studio! I'm in the Design Studio and would like to discuss a custom apparel printing idea.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <span>Consult Designer</span>
                <svg className="h-3 w-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

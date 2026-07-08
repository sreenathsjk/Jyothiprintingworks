/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Clock, Send, ShieldCheck, MapPin, MessageSquare, Instagram, Smartphone, Upload, FileText, AlertCircle, X, ArrowUpRight } from 'lucide-react';
import { QuoteRequest } from '../types';

interface ContactProps {
  prefilledRequirement?: string;
}

export default function Contact({ prefilledRequirement = '' }: ContactProps) {
  const [formData, setFormData] = useState<QuoteRequest>({
    name: '',
    phone: '',
    email: '',
    requirement: prefilledRequirement || 'tshirt-printing',
    quantity: 50,
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File drop-zone state
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; file: File; type: string }[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndAddFiles = (filesList: FileList) => {
    setFileError(null);
    const validExtensions = ['.ai', '.pdf', '.png'];
    const addedFiles: { name: string; size: number; file: File; type: string }[] = [];
    let errorMsg = null;

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(extension)) {
        errorMsg = `Only .ai, .pdf, and .png custom artwork files are accepted. Tried to upload "${file.name}".`;
        continue;
      }
      
      if (file.size > 20 * 1024 * 1024) {
        errorMsg = `File "${file.name}" is larger than the 20MB limit.`;
        continue;
      }

      addedFiles.push({
        name: file.name,
        size: file.size,
        file: file,
        type: extension.substring(1)
      });
    }

    if (errorMsg) {
      setFileError(errorMsg);
    }

    if (addedFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...addedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
    if (uploadedFiles.length <= 1) {
      setFileError(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill in all required fields (Name, Phone, and Email).");
      return;
    }

    setIsSubmitting(true);
    // Simulate API routing/lead storage delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        requirement: 'tshirt-printing',
        quantity: 50,
        message: ''
      });
      setUploadedFiles([]);
      setFileError(null);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value
    }));
  };

  return (
    <section id="contact-section" className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-extrabold text-orange-500 tracking-wider uppercase bg-orange-50 dark:bg-orange-950/40 px-4 py-1.5 rounded-full border border-orange-200/50 dark:border-orange-800/30">
            Contact Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
            Connect with Our Print Consultants
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed font-medium">
            Get an exact wholesale quotation or coordinate a physical fabric sample shipment. Fill in your requirements below and our team will respond within 2 hours.
          </p>
        </div>

        {/* Centered Lead generation Form card */}
        <div className="max-w-3xl mx-auto w-full bg-neutral-50 dark:bg-neutral-800/40 p-6 sm:p-8 rounded-3xl border border-neutral-150/50 dark:border-neutral-800 shadow-sm relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 text-left"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Vikram Sharma"
                        required
                        className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 dark:focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone-input" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="phone-input"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g., +91 98765 43210"
                        required
                        className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 dark:focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email-input" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., vikram@yourbusiness.com"
                      required
                      className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 dark:focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Requirement Dropdown */}
                    <div>
                      <label htmlFor="requirement-select" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                        Selected Print Service
                      </label>
                      <select
                        id="requirement-select"
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleChange}
                        className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold shadow-sm focus:outline-none"
                      >
                        <option value="tshirt-printing">Custom T-Shirts</option>
                        <option value="blouse-printing">Designer Blouses</option>
                        <option value="sports-jersey">Sports Jerseys</option>
                        <option value="corporate-uniforms">Corporate Uniforms</option>
                        <option value="school-uniforms">School Uniforms</option>
                        <option value="bulk-printing">Industrial Bulk Orders</option>
                        <option value="custom-orders">Bespoke Roll fabric</option>
                      </select>
                    </div>

                    {/* Quantity Field */}
                    <div>
                      <label htmlFor="quantity-input" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                        Est. Order Quantity
                      </label>
                      <input
                        id="quantity-input"
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold font-mono shadow-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* File Upload Drop Zone */}
                  <div>
                    <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                      <span>Upload Custom Artwork (Optional)</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold lowercase">Accepts: .ai, .pdf, .png</span>
                    </label>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-input-field')?.click()}
                      className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isDragging
                          ? 'border-orange-500 bg-orange-500/10 dark:bg-orange-500/10'
                          : uploadedFiles.length > 0
                          ? 'border-emerald-500 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.02] hover:border-emerald-500'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-orange-500/50 dark:hover:border-orange-500/30'
                      }`}
                    >
                      <input
                        id="file-input-field"
                        type="file"
                        multiple
                        accept=".ai,.pdf,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <div className={`p-3 rounded-full mb-3 ${
                        uploadedFiles.length > 0 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        <Upload className="h-6 w-6 animate-pulse" />
                      </div>

                      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        {isDragging 
                          ? 'Drop your artwork here...' 
                          : 'Drag & drop artwork files, or browse'}
                      </p>
                      
                      <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-1.5 font-medium">
                        Supports high-res vector files up to 20MB
                      </p>
                    </div>

                    {/* Error message */}
                    {fileError && (
                      <div className="mt-2.5 flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{fileError}</span>
                      </div>
                    )}

                    {/* Selected files count and list */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          <span>Artwork Queue ({uploadedFiles.length})</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setUploadedFiles([]); setFileError(null); }}
                            className="text-red-500 hover:text-red-600 transition-colors cursor-pointer text-[10px]"
                          >
                            Clear All
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {uploadedFiles.map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850/80 hover:border-neutral-200 dark:hover:border-neutral-800 transition-all text-xs font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-2 rounded-lg ${
                                  item.type === 'ai' 
                                    ? 'bg-amber-500/10 text-amber-500' 
                                    : item.type === 'pdf' 
                                    ? 'bg-red-500/10 text-red-500' 
                                    : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="truncate text-left">
                                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[160px] sm:max-w-[280px]">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-neutral-400 font-medium font-mono">
                                    {formatFileSize(item.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                                aria-label={`Remove file ${item.name}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message-input" className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">
                      Your Print Requirements / Sizing
                    </label>
                    <textarea
                      id="message-input"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please detail your color choices, fabric GSM weight, print placements, or custom deadlines here..."
                      className="w-full px-4.5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-orange-500 dark:focus:border-orange-500 text-neutral-900 dark:text-white text-sm font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    id="submit-contact-form"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm tracking-widest shadow-md hover:shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>Processing Submission...</>
                    ) : (
                      <>
                        <Send className="h-4.5 w-4.5" />
                        Submit Secure Request
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center text-center p-10 space-y-5"
                >
                  <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 animate-bounce-slow">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                    Requirement Submitted!
                  </h3>
                  
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md font-semibold leading-relaxed">
                    Thank you! Our studio lead coordination manager has received your customized print spec sheets. We are compiling fabric pricing and will reach back to you via your phone or email within 2 hours.
                  </p>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-orange-500 font-bold text-xs tracking-wider uppercase hover:scale-103 transition-transform cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Quick WhatsApp Support Banner */}
          <div className="max-w-3xl mx-auto mt-10 p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <svg 
                  className="h-6 w-6 fill-current" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.366 9.864-9.736.001-2.596-1.002-5.037-2.83-6.87C16.471 2.163 14.043 1.157 11.451 1.15c-5.438 0-9.867 4.367-9.87 9.742-.001 1.954.512 3.86 1.482 5.585L2.01 22.013l5.837-1.523c.31.18.513.29.8.464zM16.634 13.91c-.27-.135-1.597-.788-1.845-.878-.248-.09-.43-.136-.61.135-.18.272-.697.879-.854 1.059-.157.18-.315.203-.585.068-.27-.136-1.14-.42-2.172-1.341-.803-.717-1.345-1.603-1.502-1.874-.157-.271-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.271.27-.451.09-.18.045-.339-.022-.474-.068-.135-.61-1.472-.836-2.013-.22-.53-.442-.458-.61-.466-.157-.008-.338-.01-.52-.01-.18 0-.473.067-.72.339-.247.271-.944.924-.944 2.253 0 1.329.967 2.61 1.102 2.79.135.18 1.9 2.901 4.6 4.068.643.278 1.144.444 1.536.568.646.206 1.233.176 1.697.108.517-.076 1.598-.653 1.823-1.282.225-.63.225-1.17.157-1.282-.067-.113-.247-.18-.517-.315z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">
                  Prefer instant WhatsApp messaging?
                </h4>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold mt-1 leading-relaxed">
                  Have artwork designs or urgent lead requests? Connect directly with our lead garment designer on WhatsApp for instant evaluation and file review.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/919182703766?text=${encodeURIComponent("Hello Jyothi Print Studio! I'm viewing your products and would like to inquire about custom requirements.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/10 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Chat with Designer</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    );
    const remaining = maxImages - images.length;
    const newImages = [...images, ...validFiles.slice(0, remaining)];
    onImagesChange(newImages);

    // Reset input
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-1.5">
        Photos (max {maxImages})
      </label>

      {/* Preview grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
        {images.map((file, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
            <img
              src={URL.createObjectURL(file)}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1.5 right-1.5 w-7 h-7 bg-slate-900/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-slate-900 cursor-pointer"
              aria-label="Supprimer l'image"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Add button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-brand-500/30 flex flex-col items-center justify-center text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Ajouter</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-slate-500">
        Formats acceptés : JPG, PNG, WebP. Taille max : 5 Mo par image.
      </p>
    </div>
  );
}

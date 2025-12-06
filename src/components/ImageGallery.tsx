import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { ExperimentImage } from '../types';

interface ImageGalleryProps {
  experimentId: string;
}

export default function ImageGallery({ experimentId }: ImageGalleryProps) {
  const [images, setImages] = useState<ExperimentImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [experimentId]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('experiment_images')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-slate-400">Loading images...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-700/50 border border-slate-600 rounded-lg text-center">
        <ImageIcon className="text-slate-500 mb-3" size={32} />
        <p className="text-slate-400">No images added to this experiment</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-slate-700 rounded-lg overflow-hidden">
        <img
          src={currentImage.image_url}
          alt={currentImage.caption}
          className="w-full h-96 object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {currentImage.caption && (
        <p className="text-slate-300 text-center">{currentImage.caption}</p>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                idx === currentIndex ? 'border-blue-400' : 'border-slate-600 hover:border-blue-300'
              }`}
            >
              <img
                src={img.image_url}
                alt={img.caption}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

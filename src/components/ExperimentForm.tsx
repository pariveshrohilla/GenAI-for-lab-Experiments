import React, { useState } from 'react';
import { Zap, Plus, X } from 'lucide-react';
import { SUBJECTS } from '../types';

interface ExperimentFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function ExperimentForm({ onSubmit, isLoading }: ExperimentFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    hypothesis: '',
  });
  const [images, setImages] = useState<Array<{ url: string; caption: string }>>([]);
  const [imageInput, setImageInput] = useState({ url: '', caption: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject && formData.title && formData.description && formData.hypothesis) {
      onSubmit({ ...formData, images });
      setFormData({ subject: '', title: '', description: '', hypothesis: '' });
      setImages([]);
      setImageInput({ url: '', caption: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addImage = () => {
    if (imageInput.url.trim()) {
      setImages([...images, imageInput]);
      setImageInput({ url: '', caption: '' });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Design Your Experiment</h2>
        <p className="text-slate-400 text-lg">
          Describe your experiment and let AI simulate the results
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-6"
      >
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-white mb-3">
            Subject Area
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a subject...</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-white mb-3">
            Experiment Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Pendulum Motion Under Gravity"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-white mb-3">
            Experiment Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your experiment in detail. Include materials, setup, and methodology..."
            required
            rows={5}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="hypothesis" className="block text-sm font-semibold text-white mb-3">
            Hypothesis
          </label>
          <textarea
            id="hypothesis"
            name="hypothesis"
            value={formData.hypothesis}
            onChange={handleChange}
            placeholder="What do you expect to happen? What's your prediction?"
            required
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-white mb-4">Add Images (Optional)</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={imageInput.url}
              onChange={(e) => setImageInput({ ...imageInput, url: e.target.value })}
              placeholder="Image URL (e.g., https://example.com/image.jpg)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={imageInput.caption}
              onChange={(e) => setImageInput({ ...imageInput, caption: e.target.value })}
              placeholder="Image caption (describe what the image shows)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addImage}
              disabled={!imageInput.url.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Image
            </button>
          </div>

          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <img src={img.url} alt={img.caption} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{img.caption || 'No caption'}</p>
                    <p className="text-slate-500 text-xs truncate">{img.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.subject || !formData.title || !formData.description || !formData.hypothesis}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              <Zap size={20} />
              Run Simulation
            </>
          )}
        </button>
      </form>
    </div>
  );
}

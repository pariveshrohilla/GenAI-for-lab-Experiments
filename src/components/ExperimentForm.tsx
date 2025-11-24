import React, { useState } from 'react';
import { Zap } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject && formData.title && formData.description && formData.hypothesis) {
      onSubmit(formData);
      setFormData({ subject: '', title: '', description: '', hypothesis: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

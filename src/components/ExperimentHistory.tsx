import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import type { Experiment } from '../types';

interface ExperimentHistoryProps {
  experiments: Experiment[];
  onViewResults: (experimentId: string) => void;
}

export default function ExperimentHistory({
  experiments,
  onViewResults,
}: ExperimentHistoryProps) {
  if (experiments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No experiments yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {experiments.map((experiment) => (
        <button
          key={experiment.id}
          onClick={() => onViewResults(experiment.id)}
          className="w-full text-left p-5 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500 hover:bg-slate-800 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-blue-900 text-blue-300 rounded">
                  {experiment.subject}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white truncate">{experiment.title}</h4>
              <p className="text-slate-400 text-sm line-clamp-2 mt-1">{experiment.description}</p>
              <div className="flex items-center gap-2 mt-3 text-slate-500 text-xs">
                <Clock size={14} />
                {new Date(experiment.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <ChevronRight className="text-slate-400 flex-shrink-0" size={24} />
          </div>
        </button>
      ))}
    </div>
  );
}

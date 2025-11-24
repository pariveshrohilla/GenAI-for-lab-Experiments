import React from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import type { ExperimentResult } from '../types';

interface ResultsDisplayProps {
  result: ExperimentResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const simulationData = result.simulation_data || {};
  const dataEntries = Object.entries(simulationData);

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (Array.isArray(value)) {
      return `[${value.map((v) => (typeof v === 'number' ? v.toFixed(2) : v)).join(', ')}]`;
    }
    return String(value);
  };

  return (
    <div className="py-12">
      <div className="space-y-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Simulation Results</h2>
          </div>

          {dataEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataEntries.map(([key, value]) => (
                <div key={key} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <p className="text-slate-400 text-sm font-medium mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-white text-lg font-semibold">{formatValue(value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
              <AlertCircle className="text-amber-400" size={20} />
              <p className="text-slate-400">No simulation data available</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-green-400" size={28} />
            <h3 className="text-2xl font-bold text-white">Conclusion</h3>
          </div>
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <p className="text-slate-100 leading-relaxed text-lg whitespace-pre-wrap">
              {result.conclusion}
            </p>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">
          <p>
            Simulated on{' '}
            {new Date(result.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

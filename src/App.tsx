import React, { useState, useEffect } from 'react';
import { Beaker, ArrowRight } from 'lucide-react';
import ExperimentForm from './components/ExperimentForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExperimentHistory from './components/ExperimentHistory';
import { supabase } from './lib/supabaseClient';
import type { Experiment, ExperimentResult } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'form' | 'results'>('home');
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [currentResult, setCurrentResult] = useState<ExperimentResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching experiments:', error);
    } else {
      setExperiments(data || []);
    }
  };

  const handleExperimentSubmit = async (experimentData: any) => {
    setLoading(true);
    try {
      const { images, ...expPayload } = experimentData;

      const { data: expData, error: expError } = await supabase
        .from('experiments')
        .insert([expPayload])
        .select()
        .single();

      if (expError) throw expError;

      if (images && images.length > 0) {
        const imageRecords = images.map((img: any) => ({
          experiment_id: expData.id,
          image_url: img.url,
          caption: img.caption,
        }));

        const { error: imgError } = await supabase
          .from('experiment_images')
          .insert(imageRecords);

        if (imgError) console.error('Error saving images:', imgError);
      }

      const simulationResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/simulate-experiment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            experiment: expData,
          }),
        }
      );

      if (!simulationResponse.ok) {
        throw new Error('Simulation failed');
      }

      const simulationData = await simulationResponse.json();

      const { data: resultData, error: resultError } = await supabase
        .from('experiment_results')
        .insert([
          {
            experiment_id: expData.id,
            simulation_data: simulationData.data,
            detailed_data: simulationData.detailed_data,
            conclusion: simulationData.conclusion,
            theory_explanation: simulationData.theory_explanation,
            methodology_notes: simulationData.methodology_notes,
          },
        ])
        .select()
        .single();

      if (resultError) throw resultError;

      setCurrentResult(resultData);
      setCurrentScreen('results');
      fetchExperiments();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to run simulation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (experimentId: string) => {
    const { data, error } = await supabase
      .from('experiment_results')
      .select('*')
      .eq('experiment_id', experimentId)
      .single();

    if (error) {
      console.error('Error fetching results:', error);
    } else if (data) {
      setCurrentResult(data);
      setCurrentScreen('results');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Beaker className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">LabSim</h1>
          </div>
          <nav className="flex gap-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`transition-colors ${
                currentScreen === 'home'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentScreen('form')}
              className={`transition-colors ${
                currentScreen === 'form'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Experiment
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-20 pb-12">
        {currentScreen === 'home' && (
          <div className="max-w-7xl mx-auto px-4">
            <section className="min-h-screen flex flex-col items-center justify-center gap-8 text-center">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Simulate Lab Experiments
                  <span className="block text-blue-400">with AI</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Explore physics, chemistry, biology, and more. Describe your experiment and watch as our AI simulates it for you.
                </p>
              </div>

              <button
                onClick={() => setCurrentScreen('form')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:gap-3"
              >
                Start Simulating <ArrowRight size={20} />
              </button>

              <div className="grid md:grid-cols-3 gap-6 mt-16 w-full">
                {[
                  { title: 'Physics', desc: 'Motion, energy, forces' },
                  { title: 'Chemistry', desc: 'Reactions, states of matter' },
                  { title: 'Biology', desc: 'Life processes, ecosystems' },
                ].map((subject) => (
                  <div
                    key={subject.title}
                    className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {subject.title}
                    </h3>
                    <p className="text-slate-400">{subject.desc}</p>
                  </div>
                ))}
              </div>

              {experiments.length > 0 && (
                <div className="w-full mt-16 pt-16 border-t border-slate-700">
                  <h3 className="text-2xl font-bold text-white mb-8">Recent Experiments</h3>
                  <ExperimentHistory
                    experiments={experiments}
                    onViewResults={handleViewResults}
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {currentScreen === 'form' && (
          <div className="max-w-3xl mx-auto px-4">
            <ExperimentForm onSubmit={handleExperimentSubmit} isLoading={loading} />
          </div>
        )}

        {currentScreen === 'results' && currentResult && (
          <div className="max-w-4xl mx-auto px-4">
            <ResultsDisplay result={currentResult} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

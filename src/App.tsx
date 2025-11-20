import { MetronomeControls } from './components/MetronomeControls';
import { MetronomeProvider } from './context/MetronomeContext';

function App() {
  return (
    <MetronomeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Pocket Metronome
        </h1>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
          <MetronomeControls />
        </div>
      </div>
    </MetronomeProvider>
  );
}

export default App;

import React, { useEffect, useState, useRef } from 'react';
import EntropyPool from './components/EntropyPool';
import OracleDisplay from './components/OracleDisplay';
import useEntropyStore from './store/entropyStore';
import { loadManifest, loadSpirit } from './services/corpusLoader';
import { MarkovEngine } from './engine/markov';
import { GrammarEngine } from './engine/grammar';

function App() {
  const [corpusLoaded, setCorpusLoaded] = useState(false);
  const [availableSpirits, setAvailableSpirits] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");

  const {
    selectedSpirits,
    toggleSpirit,
    entropyLevel,
    consumeEntropy,
    setGeneratedText,
    generationMode
  } = useEntropyStore();

  const markovRef = useRef(new MarkovEngine());
  const grammarRef = useRef(new GrammarEngine());

  useEffect(() => {
    const initCorpus = async () => {
      setLoadingStatus("Loading Manifest...");
      const manifest = await loadManifest();

      if (manifest) {
        setAvailableSpirits(manifest.spirits);

        setLoadingStatus("Summoning Spirits...");

        const spiritPromises = manifest.spirits.map(id => loadSpirit(id));
        const spiritsData = await Promise.all(spiritPromises);

        setLoadingStatus("Training Engines...");
        await markovRef.current.loadCorpus(spiritsData);
        grammarRef.current.loadCorpus(spiritsData);

        setCorpusLoaded(true);
        setLoadingStatus("Ready.");
      } else {
        setLoadingStatus("Failed to load corpus manifest. Did you run the ingestor?");
      }
    };

    initCorpus();
  }, []);

  const handleGenerate = () => {
    if (!corpusLoaded) return;

    let text = "";
    if (generationMode === 'markov') {
      text = markovRef.current.generate(entropyLevel);
    } else {
      text = grammarRef.current.generate(entropyLevel);
    }

    setGeneratedText(text);

    // Consume some entropy
    consumeEntropy(50);
  };

  return (
    <div className="app-container">
      <header>
        <h1>HyperstitionEngine</h1>
        <div className="status-bar">{loadingStatus}</div>
      </header>

      <main>
        <div className="top-section">
          <EntropyPool />
        </div>

        <div className="middle-section">
          <OracleDisplay onGenerate={handleGenerate} />
        </div>

        <div className="bottom-section">
          <h3>Spirits</h3>
          <div className="spirit-list">
            {availableSpirits.map(spirit => (
              <button
                key={spirit}
                className={`spirit-tag ${selectedSpirits.includes(spirit) ? 'active' : ''}`}
                onClick={() => toggleSpirit(spirit)}
              >
                {spirit}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import useEntropyStore from '../store/entropyStore';

const BatchGenerator = () => {
    const {
        entropyLevel,
        consumeEntropy,
        generationMode,
        setGeneratedText
    } = useEntropyStore();

    const [results, setResults] = useState([]);
    const [isBatching, setIsBatching] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // We need access to the generation logic. 
    // Ideally this logic should be in a service or the store, but for now we'll simulate it
    // by triggering the store's generation flow if possible, or just calling the engine directly.
    // Since we don't have direct access to the engine instances here (they are likely in App.jsx or similar),
    // we will create a simple mock for this test or assume we can import the engines.

    // Actually, let's just make this a UI that requests the App to generate.
    // But since we can't easily change App.jsx right now without seeing it, 
    // let's assume we can import the engines directly if they are singletons or exports.
    // Checking previous files... `src/engine/markov.js` and `src/engine/grammar.js` export classes.
    // We can instantiate them here for testing purposes!

    const runBatch = async () => {
        setIsBatching(true);
        setResults([]);

        // Dynamic import to avoid circular deps or issues if not needed
        const { MarkovEngine } = await import('../engine/markov');
        const { GrammarEngine } = await import('../engine/grammar');
        const { default: corpusLoader } = await import('../services/corpusLoader');

        const markov = new MarkovEngine();
        const grammar = new GrammarEngine();

        // Load data
        const spiritsData = await corpusLoader.loadSpirits(["N_Land", "Bible", "AI"]); // Load a mix for testing
        markov.loadCorpus(spiritsData);
        grammar.loadCorpus(spiritsData);

        let newResults = [];
        for (let i = 0; i < 50; i++) {
            let text = "";
            // Randomly choose mode if we want, or use current
            if (generationMode === 'markov') {
                text = markov.generate(entropyLevel);
            } else {
                text = grammar.generate(entropyLevel);
            }
            newResults.push(text);
        }

        setResults(newResults);
        setIsBatching(false);
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    opacity: 0.3,
                    fontSize: '0.8rem',
                    background: '#000',
                    color: '#FFB000',
                    border: '1px solid #FFB000'
                }}
            >
                DEV_TOOLS
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            background: '#050505',
            border: '2px solid #FFB000',
            zIndex: 10000,
            padding: '2rem',
            overflow: 'auto',
            fontFamily: 'monospace'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>BATCH_GENERATOR_V1</h3>
                <button onClick={() => setIsVisible(false)}>CLOSE</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={runBatch}
                    disabled={isBatching}
                    style={{
                        background: '#FFB000',
                        color: '#000',
                        padding: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    {isBatching ? "GENERATING..." : "GENERATE 50 OUTPUTS"}
                </button>
                <span style={{ marginLeft: '1rem' }}>Mode: {generationMode}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {results.map((res, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid #333', padding: '0.5rem' }}>
                        <span style={{ color: '#666', marginRight: '1rem' }}>{idx + 1}.</span>
                        <span style={{ color: '#e0e0e0' }}>{res}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BatchGenerator;

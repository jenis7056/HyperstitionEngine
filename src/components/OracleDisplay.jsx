import React, { useEffect, useState } from 'react';
import useEntropyStore from '../store/entropyStore';

const OracleDisplay = ({ onGenerate }) => {
    const {
        generatedText,
        entropyLevel,
        selectedSpirits,
        generationMode,
        setGenerationMode
    } = useEntropyStore();

    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        if (generatedText) {
            setIsGlitching(true);
            const timer = setTimeout(() => setIsGlitching(false), 300);
            return () => clearTimeout(timer);
        }
    }, [generatedText]);

    return (
        <div className="oracle-display">
            <div className="controls">
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${generationMode === 'markov' ? 'active' : ''}`}
                        onClick={() => setGenerationMode('markov')}
                    >
                        MARKOV_CHAIN
                    </button>
                    <button
                        className={`mode-btn ${generationMode === 'grammar' ? 'active' : ''}`}
                        onClick={() => setGenerationMode('grammar')}
                    >
                        GRAMMAR_SIGIL
                    </button>
                </div>

                <button
                    onClick={onGenerate}
                    disabled={entropyLevel < 20}
                    className="generate-btn"
                >
                    {entropyLevel < 20 ? "GATHER_ENTROPY..." : "CONSULT_ORACLE"}
                </button>
            </div>

            <div className="output-area">
                {generatedText ? (
                    <p className={`oracle-text ${isGlitching ? 'glitch' : ''}`}>{generatedText}</p>
                ) : (
                    <p className="placeholder-text">AWAITING_TRANSMISSION...</p>
                )}
            </div>

            <div className="stats">
                <span style={{ fontSize: '0.7rem', color: '#666' }}>
                    SPIRITS_BOUND: {selectedSpirits.length} | PROTOCOL: {generationMode.toUpperCase()}
                </span>
            </div>
        </div>
    );
};

export default OracleDisplay;

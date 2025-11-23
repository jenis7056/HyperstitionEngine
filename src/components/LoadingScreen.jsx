import React, { useState, useEffect, useRef } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [logs, setLogs] = useState([]);
    const logContainerRef = useRef(null);

    const bootSequence = [
        "INITIALIZING HYPERSTITION_ENGINE...",
        "LOADING KERNEL...",
        "MOUNTING VIRTUAL FILE SYSTEM...",
        "ALLOCATING ENTROPY POOL...",
        "CONNECTING TO NOOSPHERE...",
        "SUMMONING SPIRITS...",
        "Parsing N_Land.pdf...",
        "Parsing Bible_KJV.txt...",
        "Parsing CCru_Writings.pdf...",
        "CALIBRATING MARKOV CHAINS...",
        "ALIGNING GRAMMAR SIGILS...",
        "VERIFYING REALITY CONSENSUS...",
        "WARNING: HIGH ENTROPY DETECTED",
        "ESTABLISHING NEURAL LINK...",
        "SYSTEM READY."
    ];

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < bootSequence.length) {
                setLogs(prev => [...prev, bootSequence[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 150); // Speed of log scrolling

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="loading-screen">
            <h1 className="loading-title">HYPERSTITION_ENGINE</h1>
            <div className="loading-log-container" ref={logContainerRef}>
                {logs.map((log, index) => (
                    <div key={index} className="log-line">
                        <span className="log-prefix">{">"}</span> {log}
                    </div>
                ))}
                <div className="log-cursor">_</div>
            </div>
            <div className="loading-bar-container">
                <div className="loading-bar" style={{ width: `${(logs.length / bootSequence.length) * 100}%` }}></div>
            </div>
            <div className="version-tag">v0.9.0 (BETA)</div>
        </div>
    );
};

export default LoadingScreen;

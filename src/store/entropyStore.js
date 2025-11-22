import { create } from 'zustand';
import { create } from 'zustand';

const useEntropyStore = create((set) => ({
    entropyLevel: 0,
    maxEntropy: 1000,
    selectedSpirits: [],
    generatedText: "",
    isGenerating: false,
    generationMode: 'markov', // 'markov' | 'grammar'

    addEntropy: (amount) => set((state) => ({
        entropyLevel: Math.min(state.entropyLevel + amount, state.maxEntropy)
    })),

    consumeEntropy: (amount) => set((state) => ({
        entropyLevel: Math.max(state.entropyLevel - amount, 0)
    })),

    toggleSpirit: (spiritId) => set((state) => {
        const isSelected = state.selectedSpirits.includes(spiritId);
        if (isSelected) {
            return { selectedSpirits: state.selectedSpirits.filter(id => id !== spiritId) };
        } else {
            return { selectedSpirits: [...state.selectedSpirits, spiritId] };
        }
    }),

    setGenerationMode: (mode) => set({ generationMode: mode }),

    setGeneratedText: (text) => set({ generatedText: text }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
}));

export default useEntropyStore;

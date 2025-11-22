import rita from 'rita';

export const findRhyme = (word) => {
    try {
        return rita.rhymes(word);
    } catch (e) {
        console.warn("RiTa rhyme error:", e);
        return [];
    }
};

export const getPOS = (word) => {
    try {
        return rita.pos(word);
    } catch (e) {
        return [];
    }
};

export const analyzeText = (text) => {
    return rita.analyze(text);
};


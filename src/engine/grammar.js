export class GrammarEngine {
    constructor() {
        this.posData = {
            nouns: [],
            verbs: [],
            adjectives: []
        };

        this.templates = [
            "The <adj> <noun> <verb>s into the <adj> void.",
            "Why does the <noun> <verb> so <adj>?",
            "A <adj> <noun> is merely a <noun> that has forgotten how to <verb>.",
            "To <verb> is to <verb>, but the <noun> remains <adj>.",
            "In the <adj> shadow of the <noun>, we <verb>.",
            "<adj> <noun>s <verb> <adj> <noun>s.",
            "The <noun> <verb>s, and the <noun> answers: '<adj>!'",
            "Beware the <adj> <noun>.",
            "Entropy <verb>s the <adj> <noun>."
        ];
    }

    loadCorpus(spiritsData) {
        // Aggregate POS data from all spirits
        spiritsData.forEach(spirit => {
            if (spirit && spirit.pos) {
                if (spirit.pos.nouns) this.posData.nouns.push(...spirit.pos.nouns);
                if (spirit.pos.verbs) this.posData.verbs.push(...spirit.pos.verbs);
                if (spirit.pos.adjectives) this.posData.adjectives.push(...spirit.pos.adjectives);
            }
        });

        console.log(`Grammar engine loaded: ${this.posData.nouns.length} nouns, ${this.posData.verbs.length} verbs, ${this.posData.adjectives.length} adjs.`);
    }

    getRandom(list) {
        if (!list || list.length === 0) return "[(void)]";
        return list[Math.floor(Math.random() * list.length)];
    }

    generate(entropyLevel) {
        // Entropy could select more chaotic templates or mix words more randomly
        const template = this.templates[Math.floor(Math.random() * this.templates.length)];

        return template.replace(/<noun>/g, () => this.getRandom(this.posData.nouns))
            .replace(/<verb>/g, () => this.getRandom(this.posData.verbs))
            .replace(/<adj>/g, () => this.getRandom(this.posData.adjectives));
    }
}

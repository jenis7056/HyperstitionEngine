# HyperstitionEngine Instructions

## 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **Python**: Ensure you have Python 3.9+ installed.
- **Git**: Ensure Git is installed.

## 2. Setup

### A. Install Dependencies
1.  **Frontend (React)**:
    ```bash
    npm install
    ```
2.  **Ingestor (Python)**:
    ```bash
    cd ingestor
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    cd ..
    ```

### B. Process the Corpus
The `raw_corpus_source` directory contains your source texts (PDFs and TXTs).
To process them into the format required by the engine:

1.  Run the ingestor script:
    ```bash
    python ingestor/process_corpus.py
    ```
2.  This will create:
    - `src/assets/corpus/*.json`: Processed data for each "Spirit" (author/topic).
    - `src/assets/corpus/corpus_manifest.json`: An index of all processed data.

### C. Run the Application
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser to the URL shown (usually `http://localhost:5173`).

## 3. Version Control
Since the `gh` CLI was not available, you need to manually push to GitHub:

1.  Create the repository `HyperstitionEngine` on your GitHub (`MachineKomi`).
2.  Link your local repository:
    ```bash
    git remote add origin https://github.com/MachineKomi/HyperstitionEngine.git
    ```
3.  Push the initial commit:
    ```bash
    git push -u origin master
    ```

## 4. Project Structure
- `src/`: React source code.
- `ingestor/`: Python scripts for data processing.
- `raw_corpus_source/`: Your private collection of texts (Ignored by Git).
- `bootstrap/`: Design documents.

## 5. Troubleshooting
- **Missing Corpus**: If the app shows "Corpus not loaded", ensure you ran the python script.
- **Encoding Errors**: If `process_corpus.py` fails on a file, check if it's a valid PDF or UTF-8 encoded TXT.

import { useState } from "react";

type JournalResult = {
  reflection: string;
  question: string;
  action: string;
};

type JournalEntry = {
  id: number;
  date: string;
  entry: string;
  reflection: string;
  question: string;
  action: string;
};

function JournalPage() {
  const [entry, setEntry] = useState("");
  const [result, setResult] = useState<JournalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function copyReflection() {
    if (!result) return;

    const text = `
🌸 Reflection
${result.reflection}

💭 Question
${result.question}

🌱 Tiny Action
${result.action}
`;

    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied reflection 📋");
    } catch (error) {
      console.error(error);
      setMessage("Could not copy");
    }
  }

  async function reflectWithAI() {
    if (!entry.trim()) {
      setResult({
        reflection: "Write a few words first. Your thoughts are welcome here.",
        question: "What are you feeling most strongly right now?",
        action: "Take one slow breath and begin with one honest sentence.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("https://ai-wellness-backend-q0ui.onrender.com/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry,
        }),
      });

      const data = await response.json();

      const journalResult: JournalResult = {
        reflection: data.reflection,
        question: data.question,
        action: data.action,
      };

      setResult(journalResult);

      const existingEntries: JournalEntry[] = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      );

      const newEntry: JournalEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        entry,
        reflection: data.reflection,
        question: data.question,
        action: data.action,
      };

      localStorage.setItem(
        "journalEntries",
        JSON.stringify([newEntry, ...existingEntries])
      );
    } catch (error) {
      console.error(error);

      setResult({
        reflection: "Something went wrong, but your feelings are still valid.",
        question: "What is one thing you need most right now?",
        action: "Pause for a moment and drink some water.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <p className="eyebrow">Daily Journal</p>

      <h1>Reflect gently on your day</h1>

      <p className="subtitle">
        Write what is on your mind. AI will create a reflection, a question,
        and one tiny action. Your reflections are saved on this device.
      </p>

      <textarea
        placeholder="Example: Today I felt overwhelmed with work, but I still managed to finish one important task..."
        rows={7}
        value={entry}
        onChange={(event) => setEntry(event.target.value)}
      />

      <button onClick={reflectWithAI} disabled={loading}>
        {loading ? "Reflecting..." : "Reflect with AI"}
      </button>

      {result && (
        <div className="journal-result">
          <div className="journal-card">
            <h2>🌸 Reflection</h2>
            <p>{result.reflection}</p>
          </div>

          <div className="journal-card">
            <h2>💭 Question</h2>
            <p>{result.question}</p>
          </div>

          <div className="journal-card">
            <h2>🌱 Tiny Action</h2>
            <p>{result.action}</p>
          </div>

          <button
            className="secondary-button"
            onClick={copyReflection}
          >
            📋 Copy Reflection
          </button>

          {message && (
            <p className="favorite-message">{message}</p>
          )}
        </div>
      )}

      <p className="footer-note">
        You do not have to write perfectly. Just write honestly.
      </p>
    </section>
  );
}

export default JournalPage;
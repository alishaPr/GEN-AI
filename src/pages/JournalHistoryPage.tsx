import { useEffect, useState } from "react";

type JournalEntry = {
  id: number;
  date: string;
  entry: string;
  reflection: string;
  question: string;
  action: string;
};

function JournalHistoryPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedEntries: JournalEntry[] = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );

    setEntries(savedEntries);
  }, []);

  function saveEntries(updatedEntries: JournalEntry[]) {
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
  }

  async function copyEntry(entry: JournalEntry) {
    const text = `
📔 ${entry.date}

📝 Your Entry
${entry.entry}

🌸 Reflection
${entry.reflection}

💭 Question
${entry.question}

🌱 Tiny Action
${entry.action}
`;

    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied journal entry 📋");
    } catch (error) {
      console.error(error);
      setMessage("Could not copy entry");
    }
  }

  function deleteEntry(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journal entry?"
    );

    if (!confirmed) return;

    const updatedEntries = entries.filter((entry) => entry.id !== id);

    saveEntries(updatedEntries);
    setMessage("Journal entry deleted");
  }

  function clearHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all journal history?"
    );

    if (!confirmed) return;

    saveEntries([]);
    setMessage("Journal history cleared");
  }

  return (
    <section className="card">
      <p className="eyebrow">Journal History</p>

      <h1>Your reflections</h1>

      <p className="subtitle">
        Revisit previous journal entries and see how you've grown.
      </p>

      {entries.length > 0 && (
        <button className="secondary-button" onClick={clearHistory}>
          🗑 Clear History
        </button>
      )}

      {message && <p className="favorite-message">{message}</p>}

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No journal entries yet 📔</p>
        </div>
      ) : (
        <div className="journal-history">
          {entries.map((entry) => (
            <div key={entry.id} className="journal-history-card">
              <div className="journal-date">{entry.date}</div>

              <h3>📝 Your Entry</h3>
              <p>{entry.entry}</p>

              <h3>🌸 Reflection</h3>
              <p>{entry.reflection}</p>

              <h3>💭 Question</h3>
              <p>{entry.question}</p>

              <h3>🌱 Tiny Action</h3>
              <p>{entry.action}</p>

              <div className="action-buttons">
                <button
                  className="secondary-button"
                  onClick={() => copyEntry(entry)}
                >
                  📋 Copy
                </button>

                <button
                  className="remove-button"
                  onClick={() => deleteEntry(entry.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default JournalHistoryPage;
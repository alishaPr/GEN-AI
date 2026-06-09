type AffirmationResponse = {
  affirmation: string;
  theme: string;
};

type AffirmationPageProps = {
  mood: string;
  setMood: (value: string) => void;
  affirmation: string;
  setAffirmation: (value: string) => void;
  hourlyEnabled: boolean;
  toggleHourlyAffirmations: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  favorites: string[];
  setFavorites: (value: string[]) => void;
  favoriteMessage: string;
  setFavoriteMessage: (value: string) => void;
  speakAffirmation: (text?: string) => void;
};

const moods = [
  { emoji: "😰", text: "Anxious" },
  { emoji: "💼", text: "Work Stress" },
  { emoji: "❤️", text: "Self Love" },
  { emoji: "🚀", text: "Motivation" },
  { emoji: "😔", text: "Sad" },
  { emoji: "🙏", text: "Gratitude" },
];

function AffirmationPage({
  mood,
  setMood,
  affirmation,
  setAffirmation,
  hourlyEnabled,
  toggleHourlyAffirmations,
  loading,
  setLoading,
  favorites,
  setFavorites,
  favoriteMessage,
  setFavoriteMessage,
  speakAffirmation,
}: AffirmationPageProps) {
  async function callAffirmationApi(
    inputMood: string
  ): Promise<AffirmationResponse> {
    const response = await fetch("http://localhost:3001/api/affirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood: inputMood }),
    });

    const data = await response.json();

    return {
      affirmation: data.affirmation,
      theme: data.theme || "clouds",
    };
  }

  async function generateAffirmation() {
    if (!mood.trim()) {
      setAffirmation("Tell me how you feel first, even in one word.");
      return;
    }

    try {
      setLoading(true);
      setFavoriteMessage("");

      const result = await callAffirmationApi(mood);

      setAffirmation(result.affirmation);
    } catch (error) {
      console.error(error);
      setAffirmation("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function saveFavorite(text?: string) {
    const textToSave = (text || affirmation).trim();

    if (!textToSave) return;

    const alreadyExists = favorites.some(
      (item) => item.trim().toLowerCase() === textToSave.toLowerCase()
    );

    if (alreadyExists) {
      setFavoriteMessage("Already present in favorites ✨");
      return;
    }

    const updatedFavorites = [...favorites, textToSave];

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "favoriteAffirmations",
      JSON.stringify(updatedFavorites)
    );

    setFavoriteMessage("Saved to favorites ❤️");
  }

  async function copyAffirmation(text?: string) {
    const textToCopy = text || affirmation;

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setFavoriteMessage("Copied to clipboard 📋");
    } catch (error) {
      console.error("Copy failed:", error);
      setFavoriteMessage("Could not copy. Please try again.");
    }
  }

  return (
    <section className="card">
      <p className="eyebrow">AI Affirmation</p>

      <h1>A softer thought for this moment</h1>

      <p className="subtitle">
        Share how you feel and receive a gentle affirmation written just for
        you. Today's background theme will stay calm and consistent.
      </p>

      <div className="hourly-box">
        <div>
          <strong>Hourly affirmations</strong>
          <p>
            {hourlyEnabled
              ? "Enabled while this app is open."
              : "Get a peaceful reminder every hour."}
          </p>
        </div>

        <button className="small-button" onClick={toggleHourlyAffirmations}>
          {hourlyEnabled ? "Off" : "On"}
        </button>
      </div>

      <div className="mood-container">
        {moods.map((moodItem) => (
          <button
            key={moodItem.text}
            className={`mood-chip ${
              mood === moodItem.text ? "selected-mood" : ""
            }`}
            onClick={() => setMood(moodItem.text)}
            type="button"
          >
            {moodItem.emoji} {moodItem.text}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Or type your own feeling..."
        rows={4}
        value={mood}
        onChange={(event) => setMood(event.target.value)}
      />

      <button onClick={generateAffirmation} disabled={loading}>
        {loading ? "Creating..." : "Generate affirmation"}
      </button>

      {affirmation && (
        <div className="affirmation">
          <p>{affirmation}</p>

          <div className="action-buttons">
            <button className="secondary-button" onClick={() => saveFavorite()}>
              ❤️ Save
            </button>

            <button
              className="secondary-button"
              onClick={() => speakAffirmation()}
            >
              🔊 Listen
            </button>

            <button
              className="secondary-button"
              onClick={() => copyAffirmation()}
            >
              📋 Copy
            </button>
          </div>

          {favoriteMessage && (
            <p className="favorite-message">{favoriteMessage}</p>
          )}
        </div>
      )}

      <p className="footer-note">
        Take one deep breath. You are safe in this moment.
      </p>
    </section>
  );
}

export default AffirmationPage;
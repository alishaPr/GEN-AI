import { useEffect, useState } from "react";
import "./App.css";
import StreakCard from "./components/StreakCard";
import AffirmationPage from "./pages/AffirmationPage";
import FavoritesPage from "./pages/FavoritesPage";
import JournalPage from "./pages/JournalPage";
import JournalHistoryPage from "./pages/JournalHistoryPage";

type AffirmationResponse = {
  affirmation: string;
  theme: string;
};

type ActivePage = "affirmations" | "favorites" | "journal" | "history";

const dailyThemes = [
  "ocean",
  "mountains",
  "clouds",
  "forest",
  "sunrise",
  "lavender",
];

const themeLabels: Record<string, string> = {
  ocean: "🌊 Ocean",
  mountains: "⛰️ Mountains",
  clouds: "☁️ Clouds",
  forest: "🌲 Forest",
  sunrise: "🌅 Sunrise",
  lavender: "💜 Lavender",
};

function removeDuplicates(items: string[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const normalized = item.trim().toLowerCase();

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getThemeForToday() {
  const todayKey = getTodayKey();

  const savedThemeDate = localStorage.getItem("dailyThemeDate");
  const savedTheme = localStorage.getItem("dailyTheme");

  if (savedThemeDate === todayKey && savedTheme) {
    return savedTheme;
  }

  const dayNumber = new Date().getDate();
  const selectedTheme = dailyThemes[dayNumber % dailyThemes.length];

  localStorage.setItem("dailyThemeDate", todayKey);
  localStorage.setItem("dailyTheme", selectedTheme);

  return selectedTheme;
}

function App() {
  const [activePage, setActivePage] = useState<ActivePage>("affirmations");

  const [mood, setMood] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const [theme, setTheme] = useState(getThemeForToday());

  const [hourlyAffirmation, setHourlyAffirmation] = useState("");
  const [showHourlyPopup, setShowHourlyPopup] = useState(false);
  const [hourlyEnabled, setHourlyEnabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteAffirmations");
    const savedHourlyEnabled = localStorage.getItem("hourlyEnabled");

    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      const uniqueFavorites = removeDuplicates(parsedFavorites);

      setFavorites(uniqueFavorites);

      localStorage.setItem(
        "favoriteAffirmations",
        JSON.stringify(uniqueFavorites)
      );
    }

    if (savedHourlyEnabled === "true") {
      setHourlyEnabled(true);
    }

    setTheme(getThemeForToday());
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    if (!hourlyEnabled) return;

    const intervalId = window.setInterval(() => {
      generateHourlyAffirmation();
    }, 60 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [hourlyEnabled]);

  async function callAffirmationApi(
    inputMood: string
  ): Promise<AffirmationResponse> {
    const response = await fetch("https://ai-wellness-backend-q0ui.onrender.com/api/affirmation", {
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

  async function generateHourlyAffirmation() {
    try {
      const result = await callAffirmationApi(
        "Give me a peaceful hourly affirmation for calm, confidence, and gentle motivation."
      );

      setHourlyAffirmation(result.affirmation);
      setShowHourlyPopup(true);
    } catch (error) {
      console.error(error);
    }
  }

  function refreshDailyTheme() {
    const todayKey = getTodayKey();
    const currentTheme = localStorage.getItem("dailyTheme");

    const availableThemes = dailyThemes.filter((item) => item !== currentTheme);
    const randomTheme =
      availableThemes[Math.floor(Math.random() * availableThemes.length)];

    localStorage.setItem("dailyThemeDate", todayKey);
    localStorage.setItem("dailyTheme", randomTheme);

    setTheme(randomTheme);
  }

  function toggleHourlyAffirmations() {
    const newValue = !hourlyEnabled;

    setHourlyEnabled(newValue);
    localStorage.setItem("hourlyEnabled", String(newValue));

    if (newValue) {
      generateHourlyAffirmation();
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

  function removeFavorite(indexToRemove: number) {
    const updatedFavorites = favorites.filter(
      (_, index) => index !== indexToRemove
    );

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "favoriteAffirmations",
      JSON.stringify(updatedFavorites)
    );
  }

  function speakAffirmation(text?: string) {
    const message = text || affirmation;

    if (!message) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();

    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes("Samantha") ||
        voice.name.includes("Google UK English Female") ||
        voice.name.includes("Microsoft Zira")
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }

  return (
    <main className="app">
      <div className="background-overlay" />

      {showHourlyPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <p className="eyebrow">Hourly Affirmation</p>

            <h2>A gentle reminder</h2>

            <p className="popup-text">{hourlyAffirmation}</p>

            <button onClick={() => saveFavorite(hourlyAffirmation)}>
              ❤️ Save this
            </button>

            <button
              className="secondary-button"
              onClick={() => speakAffirmation(hourlyAffirmation)}
            >
              🔊 Read Aloud
            </button>

            <button
              className="secondary-button"
              onClick={() => setShowHourlyPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="app-shell">
        <StreakCard />

        <section className="daily-theme-card">
          <div>
            <p className="streak-label">Today's theme</p>
            <h2>{themeLabels[theme] || "☁️ Clouds"}</h2>
          </div>

          <button className="small-button" onClick={refreshDailyTheme}>
            Change
          </button>
        </section>

        <nav className="tabs">
          <button
            className={`tab-button ${
              activePage === "affirmations" ? "active-tab" : ""
            }`}
            onClick={() => setActivePage("affirmations")}
          >
            ✨ Affirmations
          </button>

          <button
            className={`tab-button ${
              activePage === "favorites" ? "active-tab" : ""
            }`}
            onClick={() => setActivePage("favorites")}
          >
            ❤️ Favorites
          </button>

          <button
            className={`tab-button ${
              activePage === "journal" ? "active-tab" : ""
            }`}
            onClick={() => setActivePage("journal")}
          >
            📔 Journal
          </button>

          <button
            className={`tab-button ${
              activePage === "history" ? "active-tab" : ""
            }`}
            onClick={() => setActivePage("history")}
          >
            🕒 History
          </button>
        </nav>

        {activePage === "affirmations" && (
          <AffirmationPage
            mood={mood}
            setMood={setMood}
            affirmation={affirmation}
            setAffirmation={setAffirmation}
            hourlyEnabled={hourlyEnabled}
            toggleHourlyAffirmations={toggleHourlyAffirmations}
            loading={loading}
            setLoading={setLoading}
            favorites={favorites}
            setFavorites={setFavorites}
            favoriteMessage={favoriteMessage}
            setFavoriteMessage={setFavoriteMessage}
            speakAffirmation={speakAffirmation}
          />
        )}

        {activePage === "favorites" && (
          <FavoritesPage
            favorites={favorites}
            removeFavorite={removeFavorite}
          />
        )}

        {activePage === "journal" && <JournalPage />}

        {activePage === "history" && <JournalHistoryPage />}
      </div>
    </main>
  );
}

export default App;
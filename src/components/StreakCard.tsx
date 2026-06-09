type JournalEntry = {
  id: number;
  date: string;
  entry: string;
  reflection: string;
  question: string;
  action: string;
};

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseJournalDate(dateText: string) {
  const parsedDate = new Date(dateText);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return normalizeDate(parsedDate);
}

function getUniqueJournalDates(entries: JournalEntry[]) {
  const uniqueDates = new Set<string>();

  entries.forEach((entry) => {
    const parsedDate = parseJournalDate(entry.date);

    if (!parsedDate) return;

    uniqueDates.add(parsedDate.toISOString());
  });

  return Array.from(uniqueDates)
    .map((date) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
}

function calculateCurrentStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  const dateKeys = new Set(dates.map((date) => date.toDateString()));
  const today = normalizeDate(new Date());

  let streak = 0;
  let currentDate = today;

  while (dateKeys.has(currentDate.toDateString())) {
    streak += 1;

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 1
    );
  }

  return streak;
}

function calculateBestStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

  let bestStreak = 1;
  let currentStreak = 1;

  for (let index = 1; index < sortedDates.length; index += 1) {
    const previousDate = sortedDates[index - 1];
    const currentDate = sortedDates[index];

    const differenceInDays =
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);

    if (differenceInDays === 1) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (differenceInDays > 1) {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

function StreakCard() {
  const entries: JournalEntry[] = JSON.parse(
    localStorage.getItem("journalEntries") || "[]"
  );

  const journalDates = getUniqueJournalDates(entries);
  const currentStreak = calculateCurrentStreak(journalDates);
  const bestStreak = calculateBestStreak(journalDates);
  const totalEntries = entries.length;

  return (
    <section className="streak-card">
      <div>
        <p className="streak-label">Your progress</p>
        <h2>Keep showing up gently</h2>
      </div>

      <div className="streak-grid">
        <div className="streak-stat">
          <span>🔥</span>
          <strong>{currentStreak}</strong>
          <p>Current streak</p>
        </div>

        <div className="streak-stat">
          <span>🏆</span>
          <strong>{bestStreak}</strong>
          <p>Best streak</p>
        </div>

        <div className="streak-stat">
          <span>📔</span>
          <strong>{totalEntries}</strong>
          <p>Total entries</p>
        </div>
      </div>
    </section>
  );
}

export default StreakCard;
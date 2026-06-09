type FavoritesPageProps = {
  favorites: string[];
  removeFavorite: (index: number) => void;
};

function FavoritesPage({
  favorites,
  removeFavorite,
}: FavoritesPageProps) {
  return (
    <section className="card">
      <p className="eyebrow">Favorites</p>

      <h1>Your saved affirmations</h1>

      <p className="subtitle">
        Come back to the affirmations that resonated with you.
      </p>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No favorites yet ❤️</p>
        </div>
      ) : (
        <div className="favorites-section">
          {favorites.map((favorite, index) => (
            <div key={index} className="favorite-item">
              <p>{favorite}</p>

              <button
                className="remove-button"
                onClick={() => removeFavorite(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="footer-note">
        Save affirmations that make you feel grounded.
      </p>
    </section>
  );
}

export default FavoritesPage;
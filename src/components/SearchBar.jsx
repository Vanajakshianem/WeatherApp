function SearchBar({
  city,
  setCity,
  onSearch,
  onCurrentLocation,
}) {
  return (
    <div className="search-container">

      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      <button onClick={onSearch}>
        Search
      </button>

      <button
        className="location-button"
        onClick={onCurrentLocation}
      >
        📍 Use My Location
      </button>

    </div>
  );
}

export default SearchBar;
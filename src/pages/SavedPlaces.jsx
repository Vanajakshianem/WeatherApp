
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedPlaces.css";


const defaultPlaces = [
  // Andhra Pradesh
  {
    name: "Visakhapatnam",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Araku Valley",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Vijayawada",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Tirupati",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Lambasingi",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Rajahmundry",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Kakinada",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Srikakulam",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Amaravati",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Horsley Hills",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Borra Caves",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Gandikota",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=80",
  },

  // Telangana
  {
    name: "Hyderabad",
    image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Warangal",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=700&q=80",
  },

  // South India
  {
    name: "Bengaluru",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Chennai",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Mysuru",
    image: "https://images.unsplash.com/photo-1600100397608-f010e7b8c2e9?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Ooty",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Munnar",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Kochi",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Coorg",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80",
  },

  // Other Indian destinations
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "New Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Agra",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Jaipur",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Udaipur",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Manali",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Shimla",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Darjeeling",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Srinagar",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Varanasi",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Kolkata",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Pune",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Leh Ladakh",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
  },
];

function SavedPlaces() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weatherSavedPlaces") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [placeInput, setPlaceInput] = useState("");
  const [filter, setFilter] = useState("");

  const savePlace = (name, image = "") => {
    const cleaned = name.trim();

    if (!cleaned) return;

    const alreadySaved = places.some(
      (place) =>
        place.name.toLowerCase() === cleaned.toLowerCase()
    );

    if (alreadySaved) {
      alert("This place is already saved.");
      return;
    }

    const updated = [
      ...places,
      { name: cleaned, image },
    ];

    setPlaces(updated);
    localStorage.setItem(
      "weatherSavedPlaces",
      JSON.stringify(updated)
    );

    setPlaceInput("");
  };

  const removePlace = (name) => {
    const updated = places.filter(
      (place) => place.name !== name
    );

    setPlaces(updated);
    localStorage.setItem(
      "weatherSavedPlaces",
      JSON.stringify(updated)
    );
  };

  const openWeather = (name) => {
    navigate(`/weather?city=${encodeURIComponent(name)}`);
  };

  const filteredPlaces = defaultPlaces.filter((place) =>
    place.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="saved-places-page">
      <section className="saved-places-hero">
        <span>📍 YOUR PERSONAL WEATHER LIST</span>
        <h1>Saved Places</h1>
        <p>
          Explore destinations and check weather conditions around the world.
        </p>
      </section>

      <section className="saved-places-content">
        <form
          className="saved-place-form"
          onSubmit={(event) => {
            event.preventDefault();
            savePlace(placeInput);
          }}
        >
          <input
            value={placeInput}
            onChange={(event) => setPlaceInput(event.target.value)}
            placeholder="Enter a city or destination"
            aria-label="City or destination name"
          />

          <button type="submit">+ Save Place</button>
        </form>

        <h2 className="popular-places-heading">
          My Saved Places ({places.length})
        </h2>

        {places.length === 0 ? (
          <div className="saved-places-empty">
            <span>🌍</span>
            <h2>No saved places yet</h2>
            <p>Add your favourite cities below to check their weather quickly.</p>
          </div>
        ) : (
          <div className="saved-places-grid">
            {places.map((place) => (
              <article className="saved-place-card" key={place.name}>
                {place.image ? (
                  <img src={place.image} alt={place.name} />
                ) : (
                  <div className="saved-place-placeholder">🌤️</div>
                )}

                <div className="saved-place-details">
                  <h2>📍 {place.name}</h2>

                  <button
                    type="button"
                    className="saved-place-weather-button"
                    onClick={() => openWeather(place.name)}
                  >
                    Check Weather →
                  </button>

                  <button
                    type="button"
                    className="saved-place-remove"
                    onClick={() => removePlace(place.name)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <h2 className="popular-places-heading">
          Explore Popular Places
        </h2>

        <input
          className="popular-place-search"
          type="text"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search popular destinations..."
          aria-label="Search popular destinations"
        />

        <div className="popular-saved-places">
          {filteredPlaces.map((place) => {
            const isSaved = places.some(
              (saved) =>
                saved.name.toLowerCase() === place.name.toLowerCase()
            );

            return (
              <article
                className="popular-saved-place"
                key={place.name}
              >
                {place.image ? (
                  <img src={place.image} alt={place.name} />
                ) : (
                  <div className="saved-place-placeholder">🌍</div>
                )}

                <span>{place.name}</span>

                <button
                  type="button"
                  onClick={() => savePlace(place.name, place.image)}
                  disabled={isSaved}
                >
                  {isSaved ? "✓ Saved" : "+ Save Place"}
                </button>

                <button
                  type="button"
                  className="saved-place-weather-button"
                  onClick={() => openWeather(place.name)}
                >
                  Check Weather →
                </button>
              </article>
            );
          })}

          {filteredPlaces.length === 0 && (
            <p>No matching destinations found.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default SavedPlaces;

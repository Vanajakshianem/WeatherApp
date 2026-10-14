
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TravelPlanner.css";

const initialDestinations = [
  "Visakhapatnam",
  "Araku Valley",
  "Borra Caves",
  "Lambasingi",
  "Paderu",
  "Vizianagaram",
];

function TravelPlanner() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [destinations, setDestinations] = useState([
    initialDestinations[0],
  ]);

  const addDestination = () => {
    const place = destinationInput.trim();

    if (
      place &&
      !destinations.some(
        (destination) =>
          destination.toLowerCase() === place.toLowerCase()
      )
    ) {
      setDestinations((previous) => [...previous, place]);
      setDestinationInput("");
    }
  };

  const removeDestination = (place) => {
    setDestinations((previous) =>
      previous.filter((destination) => destination !== place)
    );
  };

  const createPlan = () => {
    if (!startDate || !endDate) {
      alert("Please select your trip dates.");
      return;
    }

    if (endDate < startDate) {
      alert("End date must be after the start date.");
      return;
    }

    if (destinations.length === 0) {
      alert("Please add at least one destination.");
      return;
    }

    const plan = {
      startDate,
      endDate,
      destinations,
    };

    localStorage.setItem("weatherTravelPlan", JSON.stringify(plan));

    navigate("/travel-forecast");
  };

  return (
    <main className="travel-page">
      <section className="travel-hero">
        <div className="travel-hero-content">
          <span className="travel-eyebrow">
            ✈️ PLAN SMARTER, TRAVEL BETTER
          </span>

          <h1>Your Weather Travel Planner</h1>

          <p>
            Plan your destinations and check available weather
            forecasts before your journey.
          </p>
        </div>
      </section>

      <section className="travel-form-card">
        <h2>🗓️ Create Your Trip</h2>

        <div className="travel-date-grid">
          <div>
            <label htmlFor="trip-start">Trip Start Date</label>
            <input
              id="trip-start"
              type="date"
              value={startDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="trip-end">Trip End Date</label>
            <input
              id="trip-end"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        <label htmlFor="destination">Add a Destination</label>

        <div className="destination-input-row">
          <input
            id="destination"
            type="text"
            placeholder="Enter a city or place"
            value={destinationInput}
            onChange={(event) =>
              setDestinationInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addDestination();
              }
            }}
          />

          <button type="button" onClick={addDestination}>
            + Add Place
          </button>
        </div>

        <div className="destination-chips">
          {destinations.map((place) => (
            <span className="destination-chip" key={place}>
              📍 {place}
              <button
                type="button"
                onClick={() => removeDestination(place)}
                aria-label={`Remove ${place}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          className="create-trip-button"
          onClick={createPlan}
        >
          Check My Trip Weather →
        </button>
      </section>

      <section className="travel-suggestions">
        <h2>🌍 Popular Destinations</h2>
        <p>Choose a place to add it to your itinerary.</p>

        <div className="popular-place-grid">
          {[
            {
              name: "Araku Valley",
              image:
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
            },
            {
              name: "Visakhapatnam",
              image:
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
            },
            {
              name: "Lambasingi",
              image:
                "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80",
            },
          ].map((place) => (
            <button
              type="button"
              className="popular-place-card"
              key={place.name}
              onClick={() => {
                if (
                  !destinations.some(
                    (d) =>
                      d.toLowerCase() === place.name.toLowerCase()
                  )
                ) {
                  setDestinations((previous) => [
                    ...previous,
                    place.name,
                  ]);
                }
              }}
            >
              <img src={place.image} alt={place.name} />
              <span>{place.name}</span>
              <small>+ Add to trip</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default TravelPlanner;


import { NavLink } from "react-router-dom";

function Navbar() {
  const links = [
    { to: "/weather", label: "Home", icon: "🏠" },
    { to: "/forecast", label: "Forecast", icon: "🌤️" },
    {
      to: "/hourly-forecast",
      label: "Hourly Forecast",
      icon: "🕒",
    },
    { to: "/travel-planner", label: "Travel Planner", icon: "✈️" },
    { to: "/saved-places", label: "Saved Places", icon: "📍" },
    { to: "/alerts", label: "Alerts", icon: "🔔" },
  ];

  return (
    <nav className="navbar">
      <NavLink to="/weather" className="navbar-brand">
        <span className="brand-icon">🌤️</span>

        <span>
          <strong>
            Weather<span>App</span>
          </strong>
          <small>Weather Today, Better Tomorrow</small>
        </span>
      </NavLink>

      <div className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/weather"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
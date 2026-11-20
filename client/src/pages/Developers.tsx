import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";
import "./Developers.css";

import {
  getDevelopers,
  sendConnectionRequest,
  type Developer,
} from "../services/developer.service";

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState("");

  // Fetch Developers
  const fetchDevelopers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDevelopers(search);
      setDevelopers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load developers"
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Debounced Search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDevelopers();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [fetchDevelopers]);

  // Available Filters
  const skills = useMemo(() => {
    const allSkills = developers.flatMap(
      (developer) =>
        developer.skills?.map((skill) => skill.name) || []
    );

    return [...new Set(allSkills)].sort();
  }, [developers]);

  const locations = useMemo(() => {
    const allLocations = developers
      .map((developer) => developer.location)
      .filter((location): location is string => Boolean(location));

    return [...new Set(allLocations)].sort();
  }, [developers]);

  // Apply Filters
  const filteredDevelopers = developers.filter((developer) => {
    const matchesSkill =
      selectedSkill === "All Skills" ||
      developer.skills?.some(
        (skill) => skill.name === selectedSkill
      );

    const matchesLocation =
      selectedLocation === "All Locations" ||
      developer.location === selectedLocation;

    return matchesSkill && matchesLocation;
  });

  // Send Connection Request
  const handleConnect = async (developerId: string) => {
    try {
      setSendingId(developerId);
      setConnectionError("");

      await sendConnectionRequest(developerId);

      setSentRequests((previous) => [
        ...previous,
        developerId,
      ]);
    } catch (err) {
      setConnectionError(
        err instanceof Error
          ? err.message
          : "Failed to send connection request"
      );
    } finally {
      setSendingId(null);
    }
  };

  return (
    <main className="developers-page">
      <div className="developers-content">

        {/* Page Header */}
        <header className="developers-hero">
          <div>
            <span className="developers-eyebrow">
              YOUR PROFESSIONAL NETWORK
            </span>

            <h1>Discover Developers</h1>

            <p>
              Find talented developers, share knowledge and
              build meaningful professional connections.
            </p>
          </div>

          <div className="developers-hero-decoration">
            {"</>"}
          </div>
        </header>

        {/* Search and Filters */}
        <section className="developers-filter-panel">

          <div className="developers-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search developers by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="developers-filter-controls">

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              aria-label="Filter by skill"
            >
              <option>All Skills</option>

              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by location"
            >
              <option>All Locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button
              className="developers-reset-btn"
              onClick={() => {
                setSearch("");
                setSelectedSkill("All Skills");
                setSelectedLocation("All Locations");
              }}
            >
              Reset
            </button>

          </div>
        </section>

        {/* Error Messages */}
        {connectionError && (
          <div className="developers-alert">
            {connectionError}
            <button onClick={() => setConnectionError("")}>
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="developers-alert">
            {error}
          </div>
        )}

        {/* Results Header */}
        <section className="developers-results">
          <div>
            <span className="developers-eyebrow">
              COMMUNITY MEMBERS
            </span>

            <h2>Meet the community</h2>

            <p>
              {loading
                ? "Finding developers..."
                : `${filteredDevelopers.length} developers found`}
            </p>
          </div>

          <span className="developers-results-badge">
            👥 {filteredDevelopers.length}
          </span>
        </section>

        {/* Loading */}
        {loading ? (
          <div className="developers-empty">
            <div className="developers-spinner" />
            <h3>Finding developers</h3>
            <p>Building your professional network...</p>
          </div>
        ) : filteredDevelopers.length === 0 ? (

          /* Empty State */
          <div className="developers-empty">
            <div className="developers-empty-icon">⌕</div>

            <h3>No developers found</h3>

            <p>
              Try changing your search or filters to discover
              more developers.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedSkill("All Skills");
                setSelectedLocation("All Locations");
              }}
            >
              Clear filters
            </button>
          </div>

        ) : (

          /* Developer Grid */
          <div className="developers-grid">

            {filteredDevelopers.map((developer) => (

              <article
                key={developer.id}
                className="developer-card"
              >

                <div className="developer-card-top">
                  <span className="developer-status">
                    ● Community member
                  </span>

                  <span className="developer-card-menu">
                    ✦
                  </span>
                </div>

                {/* Developer Information */}
                <div className="developer-info">

                  <img
                    src={
                      developer.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        developer.name
                      )}&background=EEF2FF&color=4F46E5`
                    }
                    alt={developer.name}
                    className="developer-avatar"
                  />

                  <h3>{developer.name}</h3>

                  <p className="developer-bio">
                    {developer.bio || "Developer on DevConnect"}
                  </p>

                  <p className="developer-location">
                    📍 {developer.location || "Location not added"}
                  </p>

                </div>

                {/* Skills */}
                <div className="developer-skills">
                  {developer.skills?.length ? (
                    developer.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill.id}
                        className="developer-skill"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="developer-no-skills">
                      No skills added yet
                    </span>
                  )}
                </div>

                {/* Statistics */}
                <div className="developer-stats">

                  <div>
                    <strong>
                      {developer._count?.projects ?? 0}
                    </strong>
                    <span>Projects</span>
                  </div>

                  <div>
                    <strong>
                      {developer._count?.blogPosts ?? 0}
                    </strong>
                    <span>Blogs</span>
                  </div>

                  <div>
                    <strong>
                      {developer.skills?.length ?? 0}
                    </strong>
                    <span>Skills</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="developer-actions">

                  <Link
                    to={`/developers/${developer.id}`}
                    className="view-profile-btn"
                  >
                    View Profile
                  </Link>

                  <button
                    className="connect-btn"
                    onClick={() => handleConnect(developer.id)}
                    disabled={
                      sentRequests.includes(developer.id) ||
                      sendingId === developer.id
                    }
                  >
                    {sendingId === developer.id
                      ? "Sending..."
                      : sentRequests.includes(developer.id)
                        ? "Request Sent ✓"
                        : "Connect +"}
                  </button>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>
    </main>
  );
};

export default Developers;
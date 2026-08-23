import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const tamilNaduDistricts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

function App() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [submittedSearch, setSubmittedSearch] = useState("internship");
  const [submittedLocation, setSubmittedLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(() => {
  const saved = localStorage.getItem("internfinder_saved_jobs");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem(
    "internfinder_saved_jobs",
    JSON.stringify(savedJobs)
  );
}, [savedJobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        params.append(
          "search",
          submittedSearch.trim() || "internship"
        );

        params.append(
          "location",
          submittedLocation.trim() || "location"
        );

        const response = await fetch(
          "https://internfinder-1.onrender.com/api/internships?${params.toString()}"
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        console.log("API DATA:", data);

        setJobs(data.results || []);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Unable to load internships. Please try again.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [submittedSearch, submittedLocation]);

  const handleSearch = () => {
    setSubmittedSearch(search || "internship");
    setSubmittedLocation(location);
  };
  const toggleSaveJob = (job) => {
  setSavedJobs((current) => {
    const alreadySaved = current.some(
      (savedJob) => savedJob.id === job.id
    );

    if (alreadySaved) {
      return current.filter(
        (savedJob) => savedJob.id !== job.id
      );
    }

    return [...current, job];
  });
};
    

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="app">

      {/* Animated background */}
      <div className="animated-bg">
        <motion.div
          className="glow glow-one"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="glow glow-two"
          animate={{
            x: [0, -120, 50, 0],
            y: [0, 70, -60, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="glow glow-three"
          animate={{
            x: [0, 80, -80, 0],
            y: [0, 100, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          🚀 <span>InternFinder</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#internships">Internships</a>
       <button
  className="saved-nav-btn"
  onClick={() => {
    document.getElementById("saved")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
>
  ❤️ Saved ({savedJobs.length})
</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="badge"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            ✨ Discover your next opportunity
          </motion.div>

          <h1>
            Find Internships.
            <br />
            <span>Build Your Future.</span>
          </h1>

          <p>
            Find real internship opportunities from companies
            across India and apply directly.
          </p>

          {/* SEARCH BOX */}
          <motion.div
            className="search-box"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="search-input">
              🔍

              <input
                type="text"
                placeholder="Search role, skill or internship..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="location-input">
              📍

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">
                  Select district
                </option>

                {tamilNaduDistricts.map((district) => (
                  <option
                    key={district}
                    value={district}
                  >
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              className="search-btn"
              onClick={handleSearch}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              🔎 Search
            </motion.button>
          </motion.div>

          <p className="search-hint">
            Press Enter to search
          </p>
        </motion.div>
      </section>

      {/* RESULTS */}
      <section
        className="internships"
        id="internships"
      >
        <section className="internships saved-section" id="saved">

  <div className="section-header">
    <div>
      <p className="small-title">
        YOUR FAVOURITES
      </p>

      <h2>❤️ Saved Jobs</h2>
    </div>

    <span className="result-count">
      {savedJobs.length} saved
    </span>
  </div>

  {savedJobs.length === 0 ? (
    <div className="status-message">
      <h3>No saved jobs yet ❤️</h3>
      <p>Save an internship and it will appear here.</p>
    </div>
  ) : (
    <div className="cards">
      {savedJobs.map((job, index) => (
        <InternshipCard
          key={job.id}
          job={job}
          index={index}
          savedJobs={savedJobs}
          toggleSaveJob={toggleSaveJob}
        />
      ))}
    </div>
  )}

</section>
        <div className="section-header">
          <div>
            <p className="small-title">
              LIVE OPPORTUNITIES
            </p>

            <h2>
              Latest Internships
            </h2>
          </div>

          <span className="result-count">
            {jobs.length} opportunities
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <motion.div
            className="status-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loading-spinner"></div>

            <h3>
              Finding internships...
            </h3>

            <p>
              Searching {submittedLocation}
            </p>
          </motion.div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <motion.div
            className="status-message error-message"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <h3>Something went wrong 😕</h3>

            <p>{error}</p>

            <button
              className="retry-btn"
              onClick={handleSearch}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          jobs.length === 0 && (
            <motion.div
              className="status-message"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="empty-icon">
                🔍
              </div>

              <h3>
                No internships found
              </h3>

              <p>
                Try another role or Tamil Nadu district.
              </p>
            </motion.div>
          )}

        {/* JOB CARDS */}
        {!loading &&
          !error &&
          jobs.length > 0 && (
            <div className="cards">
              {jobs.map((job, index) => (
                <InternshipCard
                  key={job.id || index}
                  job={job}
                  index={index}
                  savedJobs={savedJobs}
    toggleSaveJob={toggleSaveJob}
                />
              ))}
            </div>
          )}
      </section>
       {/* JOB DETAILS POPUP */}
      {selectedJob && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedJob(null)}
        >
          <motion.div
            className="job-modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedJob(null)}
            >
              ✕
            </button>

            <div className="modal-logo">
              {(selectedJob.company?.display_name || "C")
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2>{selectedJob.title || "Internship"}</h2>

            <p className="modal-company">
              🏢 {selectedJob.company?.display_name || "Company"}
            </p>

            <div className="modal-details">
              <span>
                📍{" "}
                {selectedJob.location?.display_name ||
                  "Location not specified"}
              </span>

              <span>
                💼{" "}
                {selectedJob.category?.label || "Internship"}
              </span>

              {selectedJob.salary_min && (
                <span>
                  💰 ₹{selectedJob.salary_min}
                  {selectedJob.salary_max
                    ? ` - ₹${selectedJob.salary_max}`
                    : ""}
                </span>
              )}
            </div>

            <h3>Job Description</h3>

            <p className="modal-description">
              {selectedJob.description
                ? selectedJob.description.replace(/<[^>]*>/g, "")
                : "No description available."}
            </p>

            {selectedJob.redirect_url && (
              <a
                className="modal-apply-btn"
                href={selectedJob.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now →
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function InternshipCard({
  job,
  index,
  savedJobs,
  toggleSaveJob,
}) {
  const company =
    job.company?.display_name || "Company";

  const title =
    job.title || "Internship";

  const jobLocation =
    job.location?.display_name ||
    "Location not specified";

  const category =
    job.category?.label ||
    "Internship";

  const description = job.description
    ? job.description
        .replace(/<[^>]*>/g, "")
        .slice(0, 180)
    : "No description available.";

  return (
    <motion.div
      className="card"
       onClick={() => onSelect(job)}
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
    >
      <div className="company-row">
        <div className="company-logo">
          {company
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <p className="company">
            {company}
          </p>

          <p className="verified">
            ✓ Live Job Listing
          </p>
        </div>
      </div>

      <h3>{title}</h3>

      <div className="details">
        <span>
          📍 {jobLocation}
        </span>

        <span>
          💼 {category}
        </span>
      </div>

      <p className="description">
        {description}
        {job.description?.length > 180
          ? "..."
          : ""}
      </p>

      <div className="card-bottom">
        <button
  className="save-btn"
  onClick={() => toggleSaveJob(job)}
>
  {savedJobs.some((savedJob) => savedJob.id === job.id)
    ? "❤️ Saved"
    : "🤍 Save"}
</button>
        <span className="live-badge">
          ● Live
        </span>

        {job.redirect_url ? (
          <motion.a
            className="apply-btn"
            href={job.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            Apply Now →
          </motion.a>
        ) : (
          <span>
            Link unavailable
          </span>
        )}
      </div>
    </motion.div>
  );
}
<footer className="footer">
  <div className="footer-content">

    <div>
      <div className="logo">
        🚀 <span>InternFinder</span>
      </div>
      <p>
        Find internships. Build your future.
      </p>
    </div>

    <div className="footer-links">
      <a href="#home">Home</a>
      <a href="#internships">Internships</a>
      <a href="#saved">Saved Jobs</a>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 InternFinder. Built for students.
  </div>
</footer>
export default App;
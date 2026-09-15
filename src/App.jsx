import laptopImage from "./assets/laptop.png";
import headphonesImage from "./assets/headphones.png";
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
  const [activeNav, setActiveNav] = useState("home");

  const [submittedSearch, setSubmittedSearch] = useState("internship");
  const [submittedLocation, setSubmittedLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [cursor, setCursor] = useState({
    x: -100,
    y: -100,
  });

  const [cursorVisible, setCursorVisible] = useState(false);
  const [ripples, setRipples] = useState([]);

  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem("internfinder_saved_jobs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* --------------------------------
     SAVE JOBS TO LOCAL STORAGE
  -------------------------------- */

  useEffect(() => {
    localStorage.setItem(
      "internfinder_saved_jobs",
      JSON.stringify(savedJobs)
    );
  }, [savedJobs]);

  /* --------------------------------
     CUSTOM CURSOR
  -------------------------------- */

  useEffect(() => {
    const moveCursor = (e) => {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });

      setCursorVisible(true);
    };

    const hideCursor = () => {
      setCursorVisible(false);
    };

    const clickRipple = (e) => {
      const id = Date.now() + Math.random();

      setRipples((current) => [
        ...current,
        {
          id,
          x: e.clientX,
          y: e.clientY,
        },
      ]);

      window.setTimeout(() => {
        setRipples((current) =>
          current.filter((ripple) => ripple.id !== id)
        );
      }, 650);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", clickRipple);

    document.documentElement.addEventListener(
      "mouseleave",
      hideCursor
    );

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", clickRipple);

      document.documentElement.removeEventListener(
        "mouseleave",
        hideCursor
      );
    };
  }, []);

  /* --------------------------------
     FETCH INTERNSHIPS
  -------------------------------- */

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          search: submittedSearch.trim() || "internship",
        });

        if (submittedLocation.trim()) {
          params.append(
            "location",
            submittedLocation.trim()
          );
        }

        const response = await fetch(
          `https://internfinder-1.onrender.com/api/internships?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        setJobs(data.results || []);
      } catch (err) {
        console.error("API ERROR:", err);

        setError(
          "Unable to load internships. Please try again."
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [submittedSearch, submittedLocation]);

  /* --------------------------------
     SEARCH
  -------------------------------- */

  const handleSearch = () => {
    setSubmittedSearch(
      search.trim() || "internship"
    );

    setSubmittedLocation(location);

    window.setTimeout(() => {
      document
        .getElementById("internships")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* --------------------------------
     SAVE / UNSAVE JOB
  -------------------------------- */

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

  return (
    <div className="app">

      {/* =================================
          CUSTOM CURSOR
      ================================= */}

      <div
        className={`cursor-glow ${
          cursorVisible ? "cursor-visible" : ""
        }`}
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      <div
        className={`cursor-dot ${
          cursorVisible ? "cursor-visible" : ""
        }`}
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />

      {ripples.map((ripple) => (
        <span
          className="cursor-ripple"
          key={ripple.id}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* =================================
          ANIMATED BACKGROUND
      ================================= */}

      <div
        className="animated-bg"
        aria-hidden="true"
      >
        <div className="bg-glow bg-glow-one" />
        <div className="bg-glow bg-glow-two" />
        <div className="bg-glow bg-glow-three" />

        <div className="hero-arc arc-one" />
        <div className="hero-arc arc-two" />
        <div className="hero-arc arc-three" />

        <div className="star-field">
          {Array.from({ length: 34 }).map(
            (_, i) => (
              <span
                className="star"
                key={i}
                style={{
                  "--x": `${(i * 47) % 100}%`,
                  "--y": `${(i * 67) % 100}%`,
                  "--d": `${4 + (i % 5)}s`,
                  "--delay": `${-(i % 7)}s`,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="navbar">

        <a
          className="logo"
          href="#home"
        >
          <span className="rocket">🚀</span>

          <span>
            Intern
            <span className="logo-accent">
              Finder
            </span>
          </span>
        </a>

        <div className="nav-links">

  <a
    className={activeNav === "home" ? "active" : ""}
    href="#home"
    onClick={() => setActiveNav("home")}
  >
    Home
  </a>

  <a
    className={activeNav === "internships" ? "active" : ""}
    href="#internships"
    onClick={() => setActiveNav("internships")}
  >
    Internships
  </a>

  <a
    className={activeNav === "companies" ? "active" : ""}
    href="#companies"
    onClick={() => setActiveNav("companies")}
  >
    Companies
  </a>

  <a
    className={activeNav === "about" ? "active" : ""}
    href="#about"
    onClick={() => setActiveNav("about")}
  >
    About
  </a>

</div>

        <div className="nav-actions">

          <button
            className="saved-nav-btn"
            onClick={() =>
              document
                .getElementById("saved")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            ♡{" "}
            <span>
              Saved ({savedJobs.length})
            </span>
          </button>

          <button
            className="signin-btn"
            onClick={() =>
              document
                .getElementById("internships")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Sign In
          </button>

        </div>

      </nav>

      <main>

        {/* =================================
            HERO SECTION
        ================================= */}

        <section
          className="hero"
          id="home"
        >

          <div
            className="hero-aura"
            aria-hidden="true"
          />

          <motion.div
            className="hero-content"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {/* BADGE */}

            <motion.div
              className="badge"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.7,
              }}
            >
              <span>✦</span>

              Your Dream Internship Awaits
            </motion.div>

            {/* HEADLINE */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.24,
                duration: 0.85,
              }}
            >
              Find Internships.
              <br />

              <span>
                Build Your Future.
              </span>
            </motion.h1>

            {/* SUBTITLE */}

            <motion.p
              className="hero-subtitle"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.36,
                duration: 0.75,
              }}
            >
              Discover real internship
              opportunities from top companies
              across India
              <br className="desktop-break" />
              and apply directly. Your next big
              opportunity is just a search away.
            </motion.p>

            {/* =================================
                SEARCH BAR
            ================================= */}

            <motion.div
              className="search-shell poster-search"
              initial={{
                opacity: 0,
                y: 24,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.48,
                duration: 0.85,
              }}
            >

              <div className="search-input">

                <span className="input-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search role, skill or internship..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />

              </div>

              <div className="search-divider" />

              <div className="location-input">

                <span className="input-icon">
                  ⌖
                </span>

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                >
                  <option value="">
                    Select district
                  </option>

                  {tamilNaduDistricts.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    )
                  )}
                </select>

              </div>

              <motion.button
                className="search-btn"
                onClick={handleSearch}
                whileHover={{
                  scale: 1.025,
                }}
                whileTap={{
                  scale: 0.975,
                }}
              >
                <span>⌕</span>
                Search
              </motion.button>

            </motion.div>

            <p className="search-hint">
              Press Enter to search
            </p>

            {/* =================================
                FLOATING GOOGLE CARD
            ================================= */}

            <FloatingCard
              side="left"
              icon="G"
              title="Software Engineering Intern"
              company="Google"
              location="Bengaluru"
              tag="Remote Friendly"
            />

            {/* =================================
                FLOATING MICROSOFT CARD
            ================================= */}

            <FloatingCard
              side="right"
              icon="▦"
              title="Product Design Intern"
              company="Microsoft"
              location="Hyderabad"
              tag="Apply Now"
              purple
            />

            {/* =================================
                REAL LAPTOP PNG
            ================================= */}

            <div
              className="hero-device laptop"
              aria-hidden="true"
            >
              <img
                src={laptopImage}
                alt=""
              />
            </div>

            {/* =================================
                REAL HEADPHONES PNG
            ================================= */}

            <div
              className="hero-device headphones"
              aria-hidden="true"
            >
              <img
                src={headphonesImage}
                alt=""
              />
            </div>

            {/* =================================
                HERO STATS
            ================================= */}

            <div className="hero-stats">

              <div className="stat">

                <span className="stat-icon">
                  ▥
                </span>

                <div>
                  <strong>
                    500+
                  </strong>

                  <span>
                    Top Companies
                  </span>
                </div>

              </div>

              <div className="stat">

                <span className="stat-icon">
                  ▣
                </span>

                <div>
                  <strong>
                    10,000+
                  </strong>

                  <span>
                    Internship Opportunities
                  </span>
                </div>

              </div>

              <div className="stat">

                <span className="stat-icon">
                  ♙
                </span>

                <div>
                  <strong>
                    100%
                  </strong>

                  <span>
                    Free to Apply
                  </span>
                </div>

              </div>

            </div>

            {/* =================================
                SCROLL CUE
            ================================= */}

            <a
              className="scroll-cue"
              href="#internships"
            >
              <span className="scroll-icon">
                ↓
              </span>

              <span>
                Scroll Down
              </span>
            </a>

          </motion.div>

        </section>

        {/* =================================
            SAVED JOBS
        ================================= */}

        <section
          className="internships saved-section"
          id="saved"
        >

          <div className="section-header">

            <div>

              <p className="small-title">
                YOUR FAVOURITES
              </p>

              <h2>
                Saved Jobs
              </h2>

            </div>

            <span className="result-count">
              {savedJobs.length} saved
            </span>

          </div>

          {savedJobs.length === 0 ? (

            <div className="status-message empty-saved">

              <div className="empty-icon">
                ♡
              </div>

              <h3>
                No saved jobs yet
              </h3>

              <p>
                Save an internship and it will
                appear here.
              </p>

            </div>

          ) : (

            <div className="cards">

              {savedJobs.map(
                (job, index) => (

                  <InternshipCard
                    key={job.id}
                    job={job}
                    index={index}
                    savedJobs={savedJobs}
                    toggleSaveJob={
                      toggleSaveJob
                    }
                    onSelect={
                      setSelectedJob
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

        {/* =================================
            LIVE INTERNSHIPS
        ================================= */}

        <section
          className="internships"
          id="internships"
        >

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

            <div className="status-message">

              <div className="loading-spinner" />

              <h3>
                Finding internships...
              </h3>

              <p>
                Searching{" "}
                {submittedLocation ||
                  "India"}
              </p>

            </div>

          )}

          {/* ERROR */}

          {!loading && error && (

            <div className="status-message">

              <div className="empty-icon">
                !
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>

              <button
                className="retry-btn"
                onClick={handleSearch}
              >
                Try Again
              </button>

            </div>

          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            jobs.length === 0 && (

              <div className="status-message">

                <div className="empty-icon">
                  ⌕
                </div>

                <h3>
                  No internships found
                </h3>

                <p>
                  Try another role or Tamil Nadu
                  district.
                </p>

              </div>

            )}

          {/* JOB CARDS */}

          {!loading &&
            !error &&
            jobs.length > 0 && (

              <div className="cards">

                {jobs.map(
                  (job, index) => (

                    <InternshipCard
                      key={
                        job.id || index
                      }
                      job={job}
                      index={index}
                      savedJobs={
                        savedJobs
                      }
                      toggleSaveJob={
                        toggleSaveJob
                      }
                      onSelect={
                        setSelectedJob
                      }
                    />

                  )
                )}

              </div>

            )}

        </section>

        {/* =================================
            COMPANIES STRIP
        ================================= */}

        <section
          className="about-strip"
          id="companies"
        >

          <div>

            <p className="small-title">
              BUILT FOR STUDENTS
            </p>

            <h2>
              One place to discover your
              next opportunity.
            </h2>

          </div>

          <p>
            Search live internship listings,
            save the ones you love, and apply
            directly.
          </p>

        </section>

        {/* =================================
            ABOUT
        ================================= */}

        <section
          className="about-section"
          id="about"
        >

          <div className="about-card">

            <span className="about-orb">
              ✦
            </span>

            <div>

              <p className="small-title">
                ABOUT INTERNFINDER
              </p>

              <h2>
                Find internships. Build your
                future.
              </h2>

              <p>
                InternFinder helps students
                discover real internship
                opportunities without making
                the search complicated.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* =================================
          JOB MODAL
      ================================= */}

      {selectedJob && (

        <motion.div
          className="modal-backdrop"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          onClick={() =>
            setSelectedJob(null)
          }
        >

          <motion.div
            className="job-modal"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.32,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              ✕
            </button>

            <div className="modal-logo">
              {(
                selectedJob.company
                  ?.display_name || "C"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2>
              {selectedJob.title ||
                "Internship"}
            </h2>

            <p className="modal-company">
              🏢{" "}
              {selectedJob.company
                ?.display_name ||
                "Company"}
            </p>

            <div className="modal-details">

              <span>
                📍{" "}
                {selectedJob.location
                  ?.display_name ||
                  "Location not specified"}
              </span>

              <span>
                💼{" "}
                {selectedJob.category
                  ?.label ||
                  "Internship"}
              </span>

              {selectedJob.salary_min && (
                <span>
                  💰 ₹
                  {
                    selectedJob.salary_min
                  }

                  {selectedJob.salary_max
                    ? ` - ₹${selectedJob.salary_max}`
                    : ""}
                </span>
              )}

            </div>

            <h3>
              Job Description
            </h3>

            <p className="modal-description">
              {selectedJob.description
                ? selectedJob.description.replace(
                    /<[^>]*>/g,
                    ""
                  )
                : "No description available."}
            </p>

            {selectedJob.redirect_url && (

              <a
                className="modal-apply-btn"
                href={
                  selectedJob.redirect_url
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now →
              </a>

            )}

          </motion.div>

        </motion.div>

      )}

      {/* =================================
          FOOTER
      ================================= */}

      <footer className="footer">

        <div className="footer-content">

          <div>

            <div className="logo">

              <span className="rocket">
                🚀
              </span>

              <span>
                Intern
                <span className="logo-accent">
                  Finder
                </span>
              </span>

            </div>

            <p>
              Find internships. Build your
              future.
            </p>

          </div>

          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#internships">
              Internships
            </a>

            <a href="#saved">
              Saved Jobs
            </a>

            <a href="#about">
              About
            </a>

          </div>

        </div>

        <div className="footer-bottom">
          © 2026 InternFinder. Built for
          students.
        </div>

      </footer>

    </div>
  );
}

/* =========================================
   FLOATING JOB CARD
========================================= */

function FloatingCard({
  side,
  icon,
  title,
  company,
  location,
  tag,
  purple,
}) {
  return (
    <motion.div
      className={`floating-job floating-${side}`}
      animate={{
        y:
          side === "left"
            ? [0, -12, 0]
            : [0, 12, 0],

        rotate:
          side === "left"
            ? [-3, -1, -3]
            : [3, 1, 3],
      }}
      transition={{
        duration:
          side === "left"
            ? 5.5
            : 6.5,

        repeat: Infinity,
        ease: "easeInOut",
      }}
    >

      <div
        className={`floating-logo ${
          purple ? "purple" : ""
        }`}
      >
        {icon}
      </div>

      <div className="floating-copy">

        <strong>
          {company}
        </strong>

        <span>
          {title}
        </span>

        <small>
          ⌖ {location}
        </small>

        <em
          className={
            purple
              ? "purple-tag"
              : ""
          }
        >
          {tag}
        </em>

      </div>

      {purple && (
        <b className="floating-arrow">
          →
        </b>
      )}

    </motion.div>
  );
}

/* =========================================
   INTERNSHIP CARD
========================================= */

function InternshipCard({
  job,
  index,
  savedJobs,
  toggleSaveJob,
  onSelect,
}) {
  const company =
    job.company?.display_name ||
    "Company";

  const title =
    job.title ||
    "Internship";

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

  const isSaved = savedJobs.some(
    (savedJob) =>
      savedJob.id === job.id
  );

  return (
    <motion.article
      className="card"
      onClick={() =>
        onSelect(job)
      }
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.55,
        delay: Math.min(
          index * 0.04,
          0.22
        ),
      }}
      whileHover={{
        y: -8,
      }}
    >

      <div className="card-glow" />

      {/* COMPANY */}

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

      {/* TITLE */}

      <h3>
        {title}
      </h3>

      {/* DETAILS */}

      <div className="details">

        <span>
          📍 {jobLocation}
        </span>

        <span>
          💼 {category}
        </span>

      </div>

      {/* DESCRIPTION */}

      <p className="description">

        {description}

        {job.description?.length >
        180
          ? "..."
          : ""}

      </p>

      {/* BOTTOM */}

      <div className="card-bottom">

        <button
          className={`save-btn ${
            isSaved
              ? "is-saved"
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();

            toggleSaveJob(job);
          }}
        >
          {isSaved
            ? "♥ Saved"
            : "♡ Save"}
        </button>

        <span className="live-badge">
          ● Live
        </span>

        {job.redirect_url ? (

          <motion.a
            className="apply-btn"
            href={
              job.redirect_url
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) =>
              e.stopPropagation()
            }
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            Apply Now →
          </motion.a>

        ) : (

          <span className="link-unavailable">
            Link unavailable
          </span>

        )}

      </div>

    </motion.article>
  );
}

export default App;
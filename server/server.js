const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
  res.send("InternFinder Backend Running 🚀");
});


// ==============================
// INTERNSHIPS API
// ==============================

app.get("/api/internships", async (req, res) => {
  try {

    // Search value
    const search = req.query.search?.trim() || "internship";

    // Location value
    const location =req.query.location?.trim() || "";


    // ==============================
    // ADZUNA PARAMETERS
    // ==============================

    const params = new URLSearchParams({
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      what: search,
      results_per_page: "50",
      "content-type": "application/json",
    });


    // ==============================
    // LOCATION
    // ==============================

    // "location" accidentally frontend-la
    // send aana ignore pannuvom
    if (
      location &&
      location.toLowerCase() !== "location" &&
      location.toLowerCase() !== "all tamil nadu"
    ) {
      params.append("where", location);
    }


    // ==============================
    // ADZUNA URL
    // ==============================

    const url =
      `https://api.adzuna.com/v1/api/jobs/in/search/1?${params.toString()}`;


    // ==============================
    // LOG
    // ==============================

    console.log("================================");
    console.log("Search:", search);
    console.log("Location:", location || "All Tamil Nadu");
    console.log("================================");


    // ==============================
    // FETCH ADZUNA
    // ==============================

    const response = await fetch(url);


    // IMPORTANT:
    // First response-a TEXT-aa read pannuvom.
    // Direct response.json() panna HTML response vandha crash aagum.

    const text = await response.text();


    console.log("Adzuna Status:", response.status);


    // ==============================
    // API ERROR
    // ==============================

    if (!response.ok) {

      console.error(
        "ADZUNA ERROR RESPONSE:",
        text.slice(0, 500)
      );

      return res.status(response.status).json({
        error: "Adzuna API error",
        status: response.status,
        details: text.slice(0, 500),
      });
    }


    // ==============================
    // PARSE JSON
    // ==============================

    let data;

    try {

      data = JSON.parse(text);

    } catch (parseError) {

      console.error(
        "ADZUNA RETURNED NON-JSON:",
        text.slice(0, 500)
      );

      return res.status(502).json({
        error: "Adzuna returned an invalid response",
        details: text.slice(0, 500),
      });
    }


    // ==============================
    // JOB RESULTS
    // ==============================

    console.log(
      "Jobs found:",
      data.results?.length || 0
    );


    // ==============================
    // SEND TO FRONTEND
    // ==============================

    res.json(data);

  } catch (error) {

    console.error("================================");
    console.error("SERVER ERROR:", error);
    console.error("================================");

    res.status(500).json({
      error: "Failed to fetch internships",
      details: error.message,
    });
  }
});


// ==============================
// START SERVER
// ==============================

app.listen(5000, () => {

  console.log("================================");
  console.log("InternFinder Backend 🚀");
  console.log("Server running on port 5000");
  console.log("================================");

});
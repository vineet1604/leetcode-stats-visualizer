document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  // FIXED: Username validation (LeetCode usernames allow _, -, ., and longer length)
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9._-]{1,30}$/;
    const isMatching = regex.test(username);

    if (!isMatching) {
      alert("Invalid Username Format");
    }

    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      // FIXED: Encoding + lowercase (important for API success)
      const safeUsername = encodeURIComponent(username.trim().toLowerCase());
      const apiUrl = `https://leetcode-stats-api.herokuapp.com/${safeUsername}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "error") {
        statsContainer.innerHTML = `<p style="color: red;">User not found. Check the username.</p>`;
        return;
      }

      displayUserData(data);
    } catch (error) {
      statsContainer.innerHTML = `<p style="color: red;">Failed to fetch details</p>`;
      console.error("API Error:", error);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(data) {
    // FIXED: Extract values properly from API
    const {
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      submissionStats
    } = data;

    const totalSubmissions = submissionStats.totalSubmission;
    const easySubmissions = submissionStats.easySubmission;
    const mediumSubmissions = submissionStats.mediumSubmission;
    const hardSubmissions = submissionStats.hardSubmission;

    // Progress bars update
    updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

    // Cards update
    const cardsData = [
      { label: "Overall Submission", value: totalSubmissions },
      { label: "Easy Submission", value: easySubmissions },
      { label: "Medium Submission", value: mediumSubmissions },
      { label: "Hard Submission", value: hardSubmissions }
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        (item) => `
        <div class="card">
          <h4>${item.label}</h4>
          <p>${item.value}</p>
        </div>`
      )
      .join("");
  }

  // Search button click handler
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;

    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});

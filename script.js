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

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,20}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      // NEW API (CORS-Free & Vercel Friendly)
      const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "error") {
        statsContainer.innerHTML = `<p style="color: red;">User not found. Check the username.</p>`;
        return;
      }

      console.log("Fetched Data:", data);

      displayUserData(data);
    } catch (error) {
      statsContainer.innerHTML = `<p style="color: red;">Failed to fetch details</p>`;
      console.error(error);
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
    const {
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      totalSubmissions,
      easySubmissions,
      mediumSubmissions,
      hardSubmissions
    } = data;

    updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

    const cardsData = [
      { label: "Overall Submission", value: totalSubmissions },
      { label: "Easy Submission", value: easySubmissions },
      { label: "Medium Submission", value: mediumSubmissions },
      { label: "Hard Submission", value: hardSubmissions },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        data =>
          `<div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
          </div>`
      )
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Username entered:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});

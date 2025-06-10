
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
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const cacheKey = `leetcode-${username}`;
    const cachedDataRaw = localStorage.getItem(cacheKey);

    if (cachedDataRaw) {
      try {
        const cacheEntry = JSON.parse(cachedDataRaw);
        const ageInSeconds = (Date.now() - cacheEntry.timestamp) / 1000;

        if (ageInSeconds < 600) {
          console.log("Loaded from cache.");
          displayUserData(cacheEntry.data, username);
          alert("Loaded from cache!");
          return;
        } else {
          console.log("Cache expired. Fetching new data.");
        }
      } catch (e) {
        console.warn("Cache read error:", e);
      }
    }

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";

      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query: `
        query userSessionProgress($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
              totalSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }`,
        variables: { username: username }
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow"
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }

      const parsedData = await response.json();
      console.log("Fetched from API:", parsedData);

      displayUserData(parsedData, username);

      const cacheEntry = {
        timestamp: Date.now(),
        data: parsedData
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    } catch (error) {
      statsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
      console.error("Fetch failed:", error);
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

  function displayUserData(parsedData, username) {
    const user = parsedData.data.matchedUser;

    if (!user) {
      localStorage.removeItem(`leetcode-${username}`);
      statsContainer.innerHTML = `<p style="color: red;">User not found. Please check the username.</p>`;
      return;
    }

    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalEasyQues = user.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues = user.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues = user.submitStats.acSubmissionNum[3].count;

    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

    const cardsData = [
      { label: "Overall Submission", value: user.submitStats.totalSubmissionNum[0].submissions },
      { label: "Overall Easy Submission", value: user.submitStats.totalSubmissionNum[1].submissions },
      { label: "Overall Medium Submission", value: user.submitStats.totalSubmissionNum[2].submissions },
      { label: "Overall Hard Submission", value: user.submitStats.totalSubmissionNum[3].submissions },
    ];

    cardStatsContainer.innerHTML = cardsData.map(
      data =>
        `<div class="card">
          <h4>${data.label}</h4>
          <p>${data.value}</p>
        </div>`
    ).join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Logging username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});

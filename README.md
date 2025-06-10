# leetcode-stats-visualizer
leetcode-progress-tracker
# LeetMetric 🔍📊

LeetMetric is a stylish web app that allows users to view their **LeetCode progress stats** just by entering their username. It fetches real-time data using LeetCode's GraphQL API and presents it in an interactive dashboard.

---

🔁 Features
✅ Search any public LeetCode username

📊 View solved question count by difficulty

🔄 Submissions displayed in styled info cards

💾 Caching enabled with localStorage (10-minute freshness window)

❌ Error handling for invalid usernames or API failures


Manually Activate the Heroku Proxy (One-Time Step)
LeetCode API is protected by CORS. We use the free CORS proxy from Heroku to bypass it:

Visit: https://cors-anywhere.herokuapp.com/corsdemo

Click “Request temporary access”

After that, you can use the app for a while (until Heroku resets your session)

⚠️ This must be done every time Heroku session expires!

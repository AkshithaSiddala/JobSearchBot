JobSearchBot
JobSearchBot is a feature-rich Telegram bot that streamlines the job search process. It allows users to search for job listings, set a default location for searches, save and view favorite jobs, subscribe to job updates, and more. The bot is designed to be user-friendly and efficient, making it easier for users to find job opportunities that match their preferences.

STACK

Frontend: Telegram Bot API
Backend: Node.js, Express
Database: None required for the bot's basic functionalities; user data is managed in-memory.


Usage

Adding Jobs: Start a conversation with the bot on Telegram and use the /search command to find jobs by specifying the job title and location.
Setting Default Location: Use the /setlocation [location] command to set a default location for future searches.
Saving Jobs: Use the /save [jobUrl] command to save job listings for later reference.
Viewing Favorites: Use the /viewfavourites command to view saved job listings.
Subscribing to Job Updates: Use the /subscribe [jobtitle] command to receive daily job updates.

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

//start bot
bot.onText(/\/start/, (msg) => {
  const chatid = msg.chat.id;
  bot.sendMessage(
    chatid,
    "Hello Welcome to JobSearchBot! I will  help you with listing out various jobs you are looking for in the market"
  );
});

//search job via role and location
bot.onText(/\/search (.+)/, async (msg, match) => {
  const chatid = msg.chat.id;
  const input = match[1].split(" ");

  if (input.length < 2) {
    bot.sendMessage(
      chatid,
      "please provide jobtitle and location eg: developer London"
    );
    return;
  }
  const jobtitle = input[0];
  const location = input.slice(1).join(" ");

  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/gb/search/1",
      {
        params: {
          app_id: process.env.APIID,
          app_key: process.env.APIKEY,
          what: jobtitle,
          where: location,
        },
      }
    );
    const jobs = response.data.results;

    if (jobs.length > 0) {
      let jobMessages = jobs
        .slice(0, 5)
        .map(
          (job) =>
            `Title: ${job.title}\nCompany: ${job.company.display_name}\nLocation: ${job.location.display_name}\nURL: ${job.redirect_url}`
        )
        .join("\n\n");

      bot.sendMessage(chatid, jobMessages);
    } else {
      bot.sendMessage(chatid, "No jobs found for your search.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatid, "An error occurred while searching for jobs.");
  }
});

//give feedback for bot
let feedbacks = [];
bot.onText(/\/feedback (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const feedbackMessage = match[1];
  feedbacks.push({ chatid, feedbackMessage });
  bot.sendMessage(chatid, "Thank you for your feedback!");
});

//contact for any help with regards to bot
bot.onText(/\/contact/, (msg) => {
  const chatid = msg.chat.id;
  const contactMessage = `
For any inquiries or support, please contact us at:
Email: jobsearchBot.com
Phone: 9485-534-454
    `;
  bot.sendMessage(chatid, contactMessage);
});

//set default location for job search
let userLocations = {};
bot.onText(/\/setlocation (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const location = match[1];
  userLocations[chatid] = location;
  bot.sendMessage(chatid, `Default location set to ${location}.`);
});

//search using default location
bot.onText(/\/defaultsearch (.+)/, async (msg, match) => {
  const chatid = msg.chat.id;
  const jobtitle = match[1];
  const location = userLocations[chatid];
  if (!location) {
    bot.sendMessage(
      chatid,
      "set default location by using '/setlocation' or search manually '/search jobtitle location'"
    );
    return;
  }

  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/gb/search/1",
      {
        params: {
          app_id: process.env.APIID,
          app_key: process.env.APIKEY,
          what: jobtitle,
          where: location,
        },
      }
    );
    const jobs = response.data.results;

    if (jobs.length > 0) {
      let jobMessages = jobs
        .slice(0, 5)
        .map(
          (job) =>
            `Title: ${job.title}\nCompany: ${job.company.display_name}\nLocation: ${job.location.display_name}\nURL: ${job.redirect_url}`
        )
        .join("\n\n");

      bot.sendMessage(chatid, jobMessages);
    } else {
      bot.sendMessage(chatid, "No jobs found for your search.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatid, "An error occurred while searching for jobs.");
  }
});

//remove default location for job search
bot.onText(/\/unsetlocation/, (msg) => {
  const chatid = msg.chat.id;
  if (userLocations[chatid]) {
    delete userLocations[chatid];
    bot.sendMessage(chatid, "default location removed");
  } else {
    bot.sendMessage(chatid, "No default location set");
  }
});

//save favourites jobs using url
let favourites={}
bot.onText(/\/save (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const jobUrl = match[1];

  if (!favourites[chatid]) {
    favourites[chatid] = [];
  }
  favourites[chatid].push(jobUrl);
  bot.sendMessage(chatid, "Job listing saved.");
});

// View all saved favourite job listings
bot.onText(/\/viewfavourites/, (msg) => {
    const chatid = msg.chat.id;
    const favouriteJobs = favourites[chatid];
    if (favouriteJobs && favouriteJobs.length > 0) {
      bot.sendMessage(chatid, `Your saved job listings:${favouriteJobs}`);
    } else {
      bot.sendMessage(chatid, "No saved job listings found.");
    }
  });
//clear saved favourites
bot.onText(/\/clear/, (msg) => {
  const chatid = msg.chat.id;
//   favourites[chatid] = [];
  delete favourites[chatid]
  bot.sendMessage(chatid, "cleared your saved jobs");
});

// Subscribe to daily job updates using jobtitle
let subscriptions = {};
bot.onText(/\/subscribe (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const jobtitle = match[1];
  subscriptions[chatid] = jobtitle;
  bot.sendMessage(chatid, `Subscribed to daily job updates for ${jobtitle}.`);
});

// Unsubscribe from daily job updates
bot.onText(/\/unsubscribe/, (msg) => {
  const chatid = msg.chat.id;
  if (subscriptions[chatid]) {
    delete subscriptions[chatid];
    bot.sendMessage(chatid, "Unsubscribed from daily job updates.");
  } else {
    bot.sendMessage(chatid, "You are not subscribed to any job updates.");
  }
});

//about jobsearchBot
bot.onText(/\/about/, (msg) => {
    const chatid = msg.chat.id;
    const aboutMessage = "JobSearchBot helps you find job listings based on your preferences"
    bot.sendMessage(chatid, aboutMessage);
  });

//help to know the commands
bot.onText(/\/help/, (msg) => {
  chatid = msg.chat.id;
  const commands =
    "These are the commands to navigate /start, /help, /search, /about, /contact, /setlocation, /subscribe, /unsubscribe, /defaultsearch, /unsetlocation, /save, /viewfavourites, /clear, /feedback";
  bot.sendMessage(chatid, commands);
});

import express from "express";
import logger from "morgan";
import requestPromise from "request-promise-native";
import Bot from "./bot";

const PORT = process.env.PORT || 8080,
      app = express(),
      bot = new Bot(),
      preventSleepInterval = 25 * 60 * 1000;

require("dotenv").config();

app.use(logger("tiny"));


let intervalTimer: any = null;

function preventSleep() {
    requestPromise.get(process.env.URL + "nudge")
        .then(() => console.log("Prevented app from sleeping"))
        .catch((error) => console.log("App sleep prevention may have failed:", error));
}

app.use(logger("tiny"));

app.get("/start", async(req, res) => {
    if (await bot.start(req.query.loud)) {
        res.send("Bot started");
        if (intervalTimer !== null) {
            clearInterval(intervalTimer);
        }
        intervalTimer = setInterval(preventSleep, preventSleepInterval);
    } else {
        res.send("Could not start bot (it may already be running)");
    }
});

app.get("/stop", async(req, res) => {
    if (await bot.stop(req.query.loud)) {
        res.send("Bot stopped");
        if (intervalTimer !== null) {
            clearInterval(intervalTimer);
        }
    } else {
        res.send("Could not stop bot (it may already have been stopped)");
    }
});

app.get("/nudge", (req, res) => {
    res.send("Prevented Heroku from sleeping");
});

app.listen(PORT, () => {
    console.info("Server listening on port " + PORT);
    requestPromise.get(process.env.URL + "start")
        .then((result) => console.log("App started:", result))
        .catch((error) => console.log("Error starting app:", error));
});


const tweet = require("./twitter.js"),
      later = require("./later.js");

module.exports = class Bot {
    constructor() {
        this.timer = null;
    }
    async start(loud) {
        if (this.timer === null) {
            this.timer = later.setInterval(Bot.handleInterval, Bot.getSchedule());
            if (loud) {
                await tweet("It's " + Bot.getTimeNowString() + " - Hello World!");
            }
            return true;
        }
        return false;
    }
    async stop(loud) {
        if (this.timer !== null) {
            this.timer.clear();
            this.timer = null;
            if (loud) {
                await tweet("It's " + Bot.getTimeNowString() + " - Goodbye World!");
            }
            return true;
        }
        return false;
    }
    static async handleInterval() {
        await tweet(Bot.getTimeNowString() + " checking for tweets...");
    }
    static getTimeNowString() {
        const date = new Date();
        return Bot.zeroPad(date.getHours()) + ":" + Bot.zeroPad(date.getMinutes());
    }
    static zeroPad(numberString) {
        return ("0" + numberString).slice(-2);
    }
    static getSchedule() {
        let minutes = [];
        for (let i = 0; i < 60; i += 2) {
            minutes = [ ...minutes, i ];
        }
        return { "schedules": [
            { "m": minutes }
        ] };
    }
};

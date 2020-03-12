import Twitter from "./twitter";

export default class Bot {
    timer: any
    intervalMillis: number
    constructor() {
        this.timer = null;
        this.intervalMillis = 1000 * 60;
    }
    async start(loud: boolean) {
        if (this.timer === null) {
            Bot.handleInterval();
            this.timer = setInterval(Bot.handleInterval, this.intervalMillis);
            if (loud) {
                await Twitter.tweet("It's " + Bot.getTimeNowString() + " - Hello World!");
            }
            return true;
        }
        return false;
    }
    async stop(loud: boolean) {
        if (this.timer !== null) {
            this.timer.clear();
            this.timer = null;
            if (loud) {
                await Twitter.tweet("It's " + Bot.getTimeNowString() + " - Goodbye World!");
            }
            return true;
        }
        return false;
    }
    static handleInterval() {
        Twitter.getTweets("coronavirus", 2, "0", Bot.handleTweetSearchResults);
    }
    static handleTweetSearchResults(data: {}) {
        console.log("data.json", data);
    }

    static getTimeNowString() {
        const date = new Date();
        return Bot.zeroPad(date.getHours().toString())
            + ":" + Bot.zeroPad(date.getMinutes().toString());
    }
    static zeroPad(numberString: string) {
        return ("0" + numberString).slice(-2);
    }
}

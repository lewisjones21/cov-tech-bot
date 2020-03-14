import Twitter, { TweetData } from "./twitter";

export default class Bot {
    timer: any
    intervalMillis: number
    latestID: number
    searchCount: number
    keywords: string[]
    constructor() {
        this.timer = null;
        this.intervalMillis = 1000 * 60;
        this.latestID = 0;
        this.searchCount = 12;
        this.keywords = [
            "coronavirus",
            // "covid",
            // "ncov",
            "tech"
            // "hack",
            // "hackathon",
            // "infographic"*/
        ];
    }
    async start(loud: boolean) {
        if (this.timer === null) {
            this.handleInterval();
            this.timer = setInterval(() => {
                this.handleInterval();
            }, this.intervalMillis);
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
    handleInterval() {
        Twitter.getTweets(this.keywords.join(" "),
                          this.searchCount,
                          this.latestID,
                          (data) => {
                              this.handleTweetSearchResults(data);
                          });
    }
    handleTweetSearchResults(data: TweetData) {
        const statuses = data.statuses.map((status) => {
            if (status.id > this.latestID) {
                this.latestID = status.id;
            }
            return { "text": status.text, "id": status.id };
        });
        console.log(statuses);
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

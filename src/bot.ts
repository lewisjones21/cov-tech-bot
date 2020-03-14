import Twitter, { TweetData } from "./twitter";

export default class Bot {
    timer: any
    intervalMillis: number
    latestID: string
    searchCount: number
    keywords: string[]
    responses: string[]
    constructor() {
        this.timer = null;
        this.intervalMillis = 1000 * 60;
        this.latestID = "0";
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
        this.responses = [
            "Check this out: coronavirustechhandbook.com",
            "Have you seen this? coronavirustechhandbook.com",
            "This might be relevant: coronavirustechhandbook.com"
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
            if (Number(status.id_str) > Number(this.latestID)) {
                this.latestID = status.id_str;
            }
            Twitter.tweet(this.responses[Math.floor(Math.random() * this.responses.length)],
                          { "inReplyToID": status.id_str, "username": status.user.screen_name });
            return { "text": status.text, "id": status.id_str };
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

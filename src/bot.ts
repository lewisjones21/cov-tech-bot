import Twitter, { TweetStatus, TweetData } from "./twitter";

export default class Bot {
    timer: any
    intervalMillis: number
    latestID: string
    searchCount: number
    keywords: string[]
    responses: string[]
    recentTweets: TweetStatus[]
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
            "Check this out: coronavirustechhandbook.com/?ref=bot",
            "Have you seen this? coronavirustechhandbook.com/?ref=bot",
            "This might be relevant: coronavirustechhandbook.com/?ref=bot"
        ];
        this.recentTweets = [];
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
        this.recentTweets = [];
        const keywords: string = this.keywords.join(" ");
        Promise.all([
            Twitter.getTweets(keywords,
                              this.searchCount,
                              this.latestID)
                .then((data: TweetData | null) => {
                    if (data) {
                        this.recentTweets = [ ...this.recentTweets, ...data.statuses ];
                    } else {
                        console.warn("Search with", keywords, "returned null");
                    }
                })
                .catch((err: Error) => {
                    console.error(err);
                })
        ])
            .then(() => {
                this.handleTweetSearchResults();
            })
            .catch((err: Error) => {
                console.error(err);
            });
    }
    handleTweetSearchResults() {
        this.recentTweets.forEach((status: TweetStatus) => {
            if (Number(status.id_str) > Number(this.latestID)) {
                this.latestID = status.id_str;
            }
            console.log(status.user.screen_name, "(" + status.id_str + "):", status.text);
            Twitter.tweet(this.responses[Math.floor(Math.random() * this.responses.length)],
                          { "inReplyToID": status.id_str, "username": status.user.screen_name });
        });
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

import Twit from "twit";
import { IncomingMessage } from "http";

const twitterConnection = new Twit({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY || "",
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET || "",
    "access_token": process.env.TWITTER_ACCESS_TOKEN,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export interface TweetData { "statuses": { "text": string, "id": number }[] }

export default class Twitter {
    static getTweets(searchTerms: string,
                     count: number,
                     lastTweetID: number,
                     callback: (data: TweetData) => void) {
        console.log("Searching for tweets with keywords: '" + searchTerms + "'...");
        const params: Twit.Params = {
            "q": searchTerms,
            "result_type": "recent",
            count,
            "since_id": lastTweetID.toString()
        };
        try {
            twitterConnection.get(
                "search/tweets",
                params,
                (err: Error, result: Twit.Response, response: IncomingMessage) => {
                    if (err) {
                        console.error(err);
                    } else if (response.statusCode === 200) {
                        callback(<TweetData> result);
                    } else {
                        console.warn("response.statusCode", response.statusCode);
                    }
                }
            );
        } catch (err) {
            console.error("Failed to search for tweets", err);
        }
    }
    static async tweet(bodyText: string) {
        console.log("Attempting to tweet: '" + bodyText + "'...");
        try {
            await twitterConnection.post("statuses/update", {
                "status": bodyText.slice(0, 288)
            });
            console.info("Sent tweet successfully");
        } catch (err) {
            console.error("Failed to send tweet", err);
        }
    }
}

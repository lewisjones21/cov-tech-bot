import Twit from "twit";
import { IncomingMessage } from "http";

const twitterConnection = new Twit({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY || "",
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET || "",
    "access_token": process.env.TWITTER_ACCESS_TOKEN,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export interface TweetStatus { "text": string, "id_str": string, "user": { "screen_name": string } }
export interface TweetData { "statuses": TweetStatus[] }

export default class Twitter {
    static getTweets(searchTerms: string,
                     count: number,
                     lastTweetID: string): Promise<TweetData | null> {
        console.log("Searching for", count, "tweets with keywords: '" + searchTerms + "'...");
        const params: Twit.Params = {
            "q": searchTerms,
            "result_type": "recent",
            count,
            "since_id": lastTweetID
        };
            return twitterConnection.get(
                "search/tweets",
                params
            )
            .then((response: Twit.PromiseResponse) => {
                if (response.resp.statusCode === 200) {
                    return <TweetData> response.data;
                } else {
                    console.warn("response.statusCode:", response.resp.statusCode);
                    return Promise.resolve(null)
                }
            })
                .catch((err: Error) => {
                    console.error(err);
                    return Promise.resolve(null)
                });
    }
    static async tweet(bodyText: string, replyData?: { "inReplyToID": string, "username": string }) {
        console.log("Attempting to tweet: '" + bodyText + "'...");
        try {
            const params: any = { "status": bodyText.slice(0, 288) };
            if (replyData) {
                params.status = "@" + replyData.username + "\n" + params.status;
                params.in_reply_to_status_id = replyData.inReplyToID;
            }
            await twitterConnection.post("statuses/update", params);
            console.info("Sent tweet successfully"
                + (replyData ? " in response to " + replyData.username : ""));
        } catch (err) {
            console.error("Failed to send tweet", err);
        }
    }
}

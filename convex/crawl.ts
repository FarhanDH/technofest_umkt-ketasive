import axios from "axios";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL as string;

type CrawledPage = {
	url: string;
	content: string;
};

export const _crawlSite = internalAction({
	args: {
		rootUrl: v.string(),
		maxPages: v.optional(v.number()),
	},
	handler: async (_, args) => {
		const results = await axios
			.post(`${BACKEND_API_URL}/crawl`, {
				url: args.rootUrl,
				maxDepth: args.maxPages ?? 10,
			})
			.then((res) => res.data as CrawledPage[]);

		return results;
	},
});

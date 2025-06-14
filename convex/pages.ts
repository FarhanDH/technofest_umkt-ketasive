import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import {
	internalAction,
	internalMutation,
	internalQuery,
	query,
} from "./_generated/server";
import { embedText } from "./model";

export const insertIndexedPage = internalAction({
	args: {
		siteId: v.id("sites"),
		url: v.string(),
		content: v.string(),
	},
	handler: async (ctx, { siteId, url, content }) => {
		const embedding = await embedText(content); // pakai fetch/axios
		await ctx.runMutation(internal.pages._insertPage, {
			siteId,
			url,
			content,
			embedding,
		});
	},
});

export const _insertPage = internalMutation({
	args: {
		siteId: v.id("sites"),
		url: v.string(),
		content: v.string(),
		embedding: v.array(v.float64()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("pages", {
			...args,
			status: "indexed",
			indexedAt: Date.now(),
		});
	},
});

export const getOnePage = query({
	args: {
		pageId: v.id("pages"),
	},
	handler: async (ctx, args) => {
		const page = await ctx.db.get(args.pageId);
		if (!page) {
			throw new Error("Page not found");
		}
		return page;
	},
});

export const _getRelevantPages = internalQuery({
	args: {
		results: v.array(v.object({ _id: v.id("pages"), _score: v.float64() })),
	},
	handler: async (ctx, args) => {
		const out: Doc<"pages">[] = [];
		for (const result of args.results) {
			const doc = await ctx.db.get(result._id);
			if (!doc) {
				continue;
			}
			out.push(doc);
		}
		return out;
	},
});

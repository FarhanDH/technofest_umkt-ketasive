import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { assertAuthenticated } from "./app";
import { embedText } from "./model";

export const createContext = action({
	args: {
		type: v.union(v.literal("text"), v.literal("faq")),
		siteId: v.id("sites"),
		title: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		if (args.type === "faq") {
			const embedding = await embedText(`
		question: ${args.title}
		answer: ${args.content}
		`);

			await ctx.runMutation(internal.contexts.insertContextToDB, {
				...args,
				embedding,
			});
			return;
		}

		const embedding = await embedText(`
		title: ${args.title}
		content: ${args.content}
		`);

		await ctx.runMutation(internal.contexts.insertContextToDB, {
			...args,
			embedding,
		});
		return;
	},
});

export const insertContextToDB = internalMutation({
	args: {
		type: v.union(v.literal("text"), v.literal("faq")),
		siteId: v.id("sites"),
		title: v.string(),
		content: v.string(),
		embedding: v.optional(v.array(v.float64())),
	},
	handler: async (ctx, args) => {
		await assertAuthenticated(ctx);

		await ctx.db.insert("contexts", {
			type: args.type,
			title: args.title,
			content: args.content,
			siteId: args.siteId,
			embedding: args.embedding,
		});
	},
});

export const getContexts = query({
	args: {
		siteId: v.id("sites"),
	},
	handler: async (ctx, args) => {
		await assertAuthenticated(ctx);

		return ctx.db
			.query("contexts")
			.withIndex("by_site_id", (q) => q.eq("siteId", args.siteId))
			.order("desc")
			.collect();
	},
});

import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action, internalMutation, query } from "./_generated/server";
import { assertAuthenticated } from "./app";

export const insertSite = internalMutation({
	args: {
		name: v.string(),
		domain: v.string(),
		language: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await assertAuthenticated(ctx);

		return await ctx.db.insert("sites", {
			active: true,
			name: args.name,
			domain: args.domain,
			language: args.language,
			logoUrl: args.logoUrl,
			userId: user._id,
		});
	},
});

export const createAndCrawlSite = action({
	args: {
		name: v.string(),
		domain: v.string(),
		language: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
		maxPages: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		// 1. Insert site ke DB
		let siteId: Id<"sites"> = "" as Id<"sites">;
		await ctx
			.runMutation(internal.sites.insertSite, {
				name: args.name,
				domain: args.domain,
				language: args.language,
				logoUrl: args.logoUrl,
			})
			.then((s) => {
				siteId = s;
			});

		if (!siteId) {
			throw new Error("Site not found");
		}
		// 2. Trigger crawling
		const pages = await ctx.runAction(internal.crawl._crawlSite, {
			rootUrl: args.domain,
			maxPages: args.maxPages ?? 10,
		});

		// 3. Simpan hasil crawling ke DB
		for (const page of pages) {
			await ctx.runAction(internal.pages.insertIndexedPage, {
				siteId,
				url: page.url,
				content: page.content,
			});
		}

		return siteId;
	},
});

export const getSites = query({
	args: {},
	handler: async (ctx) => {
		const user = await assertAuthenticated(ctx);
		return ctx.db
			.query("sites")
			.withIndex("by_user_id", (q) => q.eq("userId", user._id))
			.order("desc")
			.collect();
	},
});

export const getOneSite = query({
	args: {
		siteId: v.id("sites"),
	},
	handler: async (ctx, args) => {
		await assertAuthenticated(ctx);
		const site = await ctx.db.get(args.siteId);

		if (!site) {
			throw new Error("Site not found");
		}

		const pagesOnSite = await ctx.db
			.query("pages")
			.withIndex("by_site_id", (q) => q.eq("siteId", args.siteId))
			.collect();
		return {
			...site,
			pages: pagesOnSite,
		};
	},
});

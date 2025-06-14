import { v } from "convex/values";
import { query } from "./_generated/server";
import { assertAuthenticated } from "./app";

export const getSiteSessions = query({
	args: {
		siteId: v.id("sites"),
	},
	handler: async (ctx, args) => {
		await assertAuthenticated(ctx);

		return await ctx.db
			.query("sessions")
			.withIndex("by_site_id", (q) => q.eq("siteId", args.siteId))
			.order("desc")
			.collect();
	},
});

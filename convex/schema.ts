import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		username: v.string(),
		email: v.string(),
		userId: v.string(),
		profileImage: v.optional(v.string()),
		alreadyOnboarded: v.boolean(),
	}).index("by_user_id", ["userId"]),

	sites: defineTable({
		userId: v.id("users"),
		name: v.string(),
		domain: v.string(),
		language: v.optional(v.string()),
		logoUrl: v.optional(v.string()),
		active: v.boolean(),
	})
		.index("by_user_id", ["userId"])
		.index("by_domain", ["domain"]),

	pages: defineTable({
		siteId: v.id("sites"),
		url: v.string(),
		content: v.optional(v.string()),
		embedding: v.optional(v.array(v.float64())),
		status: v.union(
			v.literal("pending"),
			v.literal("indexed"),
			v.literal("failed"),
		),
		indexedAt: v.optional(v.number()),
	})
		.index("by_site_id", ["siteId"])
		.index("by_site_id_url", ["siteId", "url"])
		.vectorIndex("by_embedding", {
			dimensions: 1536,
			vectorField: "embedding",
			filterFields: ["siteId"],
		}),

	contexts: defineTable({
		siteId: v.id("sites"),
		type: v.union(v.literal("text"), v.literal("faq")),
		title: v.optional(v.string()),
		content: v.string(),
		embedding: v.optional(v.array(v.float64())),
	})
		.index("by_site_id", ["siteId"])
		.vectorIndex("by_embedding", {
			dimensions: 1536,
			vectorField: "embedding",
			filterFields: ["siteId"],
		}),

	sessions: defineTable({
		siteId: v.id("sites"),
		userIdentifier: v.string(),
		threadId: v.string(),
	})
		.index("by_site_id", ["siteId"])
		.index("by_identifier", ["userIdentifier"]),

	chat_settings: defineTable({
		siteId: v.id("sites"),
		bubbleColor: v.optional(v.string()),
		position: v.optional(
			v.union(v.literal("bottom-right"), v.literal("bottom-left")),
		),
		greeting: v.optional(v.string()),
		style: v.optional(v.string()),
	}).index("by_site_id", ["siteId"]),
});

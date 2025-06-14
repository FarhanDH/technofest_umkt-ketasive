import { v } from "convex/values";
import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "./_generated/server";
import { createOrUpdateUser } from "./users";

const ERROR_NOT_AUTHENTICATED = "User not authenticated";

/**
 * Completes the onboarding process for a new user.
 *
 * @param username - The desired username for the user.
 * @returns The created or updated user object.
 * @throws Error if the user is not authenticated or if user creation fails.
 */
export const completeOnboarding = mutation({
	args: {
		username: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error(ERROR_NOT_AUTHENTICATED);
		}

		const user = await createOrUpdateUser(ctx, identity.subject, {
			username: args.username,
			email: identity.email as string,
			alreadyOnboarded: true,
			profileImage: identity.pictureUrl || "",
			userId: identity.subject,
		});

		if (!user) {
			throw new Error("Failed to create user");
		}

		return user;
	},
});

/**
 * Generates a URL for uploading files.
 *
 * @returns A promise that resolves to the upload URL.
 * @throws Error if the user is not authenticated.
 */
export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity;
		if (!identity) {
			throw new Error(ERROR_NOT_AUTHENTICATED);
		}
		return await ctx.storage.generateUploadUrl();
	},
});

/**
 * Retrieves the currently authenticated user.
 *
 * @returns A promise that resolves to the user object or null if not found or not authenticated.
 */
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}

		const userData = await ctx.db
			.query("users")
			.withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
			.first();

		if (!userData) {
			return null;
		}

		return userData;
	},
});

/**
 * Deletes the account of the currently authenticated user.
 *
 * @throws Error if the user is not authenticated or not found.
 */
export const deleteCurrentUserAccount = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return;
		}
		const user = await ctx.db
			.query("users")
			.withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
			.first();

		if (!user) {
			throw new Error(ERROR_NOT_AUTHENTICATED);
		}

		await ctx.db.delete(user._id);
	},
});

export const assertAuthenticated = async (ctx: QueryCtx | MutationCtx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error(ERROR_NOT_AUTHENTICATED);
	}

	const user = await ctx.db
		.query("users")
		.withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
		.first();

	if (!user) {
		throw new Error(ERROR_NOT_AUTHENTICATED);
	}

	return user;
};

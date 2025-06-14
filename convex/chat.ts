import { vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { chatAgent } from "./model";

export const createThread = mutation({
	args: {
		identifier: v.string(),
		siteId: v.id("sites"),
	},
	handler: async (ctx, args) => {
		const { threadId } = await chatAgent.createThread(ctx, {
			userId: args.identifier,
		});

		const isExists = await ctx.db
			.query("sessions")
			.withIndex("by_identifier", (q) =>
				q.eq("userIdentifier", args.identifier),
			)
			.collect();

		if (args.identifier && isExists.length === 0) {
			await ctx.db.insert("sessions", {
				threadId,
				userIdentifier: args.identifier,
				siteId: args.siteId,
			});
		}

		return threadId;
	},
});

export const listThreadMessages = query({
	args: {
		// These arguments are required:
		threadId: v.string(),
		paginationOpts: paginationOptsValidator, // Used to paginate the messages.
		streamArgs: vStreamArgs, // Used to stream messages.
	},
	handler: async (ctx, args) => {
		const { threadId, paginationOpts, streamArgs } = args;
		// await authorizeThreadAccess(ctx, threadId);
		const streams = await chatAgent.syncStreams(ctx, { threadId, streamArgs });
		// Here you could filter out / modify the stream of deltas / filter out
		// deltas.

		const paginated = await chatAgent.listMessages(ctx, {
			threadId,
			paginationOpts,
			excludeToolMessages: true,
		});
		// Here you could filter out metadata that you don't want from any optional
		// fields on the messages.
		// You can also join data onto the messages. They need only extend the
		// MessageDoc type.
		// { ...messages, page: messages.page.map(...)}

		return {
			...paginated,
			streams,

			// ... you can return other metadata here too.
			// note: this function will be called with various permutations of delta
			// and message args, so returning derived data .
		};
	},
});

export const streamStory = internalAction({
	args: {
		promptMessageId: v.string(),
		threadId: v.string(),
		siteId: v.string(),
	},
	handler: async (ctx, { promptMessageId, threadId, siteId }) => {
		const { thread } = await chatAgent.continueThread(ctx, { threadId });
		const result = await thread.streamText(
			{ promptMessageId, system: `siteId: ${siteId}`, maxSteps: 2 },
			{ saveStreamDeltas: true },
		);
		await result.consumeStream();
	},
});

export const streamStoryAsynchronously = mutation({
	args: { prompt: v.string(), threadId: v.string(), siteId: v.string() },
	handler: async (ctx, { prompt, threadId, siteId }) => {
		// await authorizeThreadAccess(ctx, threadId);
		const { messageId } = await chatAgent.saveMessage(ctx, {
			threadId,
			prompt,

			// we're in a mutation, so skip embeddings for now. They'll be generated
			// lazily when streaming text.
			skipEmbeddings: true,
		});
		await ctx.scheduler.runAfter(0, internal.chat.streamStory, {
			siteId,
			threadId,
			promptMessageId: messageId,
		});
	},
});

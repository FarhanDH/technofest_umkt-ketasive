import { openai } from "@ai-sdk/openai";
import { Agent, createTool } from "@convex-dev/agent";
// import { type LanguageModelV1, openrouter } from "@openrouter/ai-sdk-provider";
import type { EmbeddingModel, LanguageModelV1 } from "ai";
import { components, internal } from "./_generated/api";

import { embed } from "ai";
import { v } from "convex/values";
import { z } from "zod";
import type { Doc, Id } from "./_generated/dataModel";
import { internalAction } from "./_generated/server";

const chat: LanguageModelV1 = openai.chat("gpt-4o-mini");
const textEmbedding: EmbeddingModel<string> = openai.textEmbeddingModel(
	"text-embedding-3-small",
);

export const embedText = async (text: string) => {
	const { embedding } = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});
	return embedding;
};

export const chatAgent = new Agent(components.agent, {
	name: "Chat Agent",
	chat: chat,
	textEmbedding: textEmbedding,
	maxSteps: 3,
	contextOptions: {
		searchOptions: {
			limit: 5,
			messageRange: { before: 2, after: 1 },
		},
	},
	instructions: `
    Anda adalah asisten virtual untuk pengunjung website UMKM". 
    sebagai konteks utama untuk menjawab prompt gunakan tool fetchRelevantPages terlebih dahulu untuk mengumpulkan content pada page yang relevant. 
    Tugas Anda adalah menjawab pertanyaan berdasarkan informasi yang tersedia dari situs web dan tambahan konteks dari pemilik UMKM.
    Berikan jawaban yang ramah, jelas, dan sopan. Jika pengguna bertanya tentang produk, layanan, jam buka, cara pemesanan, atau informasi lainnya yang tersedia di situs, jawab dengan akurat berdasarkan konteks.

    Jika pertanyaan tidak memiliki jawaban dalam informasi yang diberikan, mohon untuk menyarankan pengguna untuk menghubungi pemilik UMKM melalui kontak yang tersedia.
    Jangan pernah mengarang informasi. Jangan mengaku sebagai manusia. Selalu beri jawaban singkat tapi informatif. Dan Jika kamu tidak memiliki jawaban jangan memberikan jawaban sebagai LLM OpenAI tetapi tetaplah bertindak sebagai virtual assistant, serta selalu jawab dalam Bahasa Indonesia!.
    `,
	tools: {
		fetchRelevantPages: createTool({
			description:
				"Dapatkan semua informasi yang relevan dengan prompt atau pertanyaan dari user.",
			args: z.object({
				prompt: z.string().describe("prompt from input"),
				siteId: z.string().describe("id of the site"),
			}),
			// Note: annotate the return type of the handler to avoid type cycles.
			handler: async (ctx, args) => {
				const results = await ctx.runAction(internal.model.fetchRelevantPages, {
					prompt: args.prompt,
					siteId: args.siteId,
				});

				let pages: Doc<"pages">[] = [];

				console.log({
					idforcontext: pages[0],
				});

				await ctx
					.runQuery(internal.pages._getRelevantPages, {
						results: [results[0], results[1]],
					})
					.then((res) => {
						pages = res;
					});

				return pages;
			},
		}),
		// Standard AI SDK tool
	},
});

export const fetchRelevantPages = internalAction({
	args: {
		prompt: v.string(),
		siteId: v.string(),
	},
	handler: async (ctx, args) => {
		const promptEmbedding = await embedText(args.prompt);
		return await ctx.vectorSearch("pages", "by_embedding", {
			vector: promptEmbedding,
			limit: 16,
			filter: (q) => q.eq("siteId", args.siteId as Id<"sites">),
		});
	},
});

import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { type LanguageModelV1, openrouter } from "@openrouter/ai-sdk-provider";
import type { EmbeddingModel } from "ai";
import { components } from "./_generated/api";

import { embed } from "ai";

const chat: LanguageModelV1 = openrouter.chat(
	"google/gemini-2.5-flash-preview-05-20",
);
const textEmbedding: EmbeddingModel<string> = openai.textEmbeddingModel(
	"openai/text-embedding-3-small",
);

export const chatAgent = new Agent(components.agent, {
	name: "Story Agent",
	chat: chat,
	textEmbedding: textEmbedding,
	instructions: "You tell stories with twist endings. ~ 200 words.",
});

export const embedText = async (text: string) => {
	const { embedding } = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});
	return embedding;
};

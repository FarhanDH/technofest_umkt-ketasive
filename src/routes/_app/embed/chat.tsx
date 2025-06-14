import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ChatStreaming from "./-ChatStreaming";

const chatBotSchema = z.object({
	siteId: z.string(),
});

export const Route = createFileRoute("/_app/embed/chat")({
	component: RouteComponent,
	validateSearch: (search) => chatBotSchema.parse(search),
});

function RouteComponent() {
	const { siteId } = Route.useSearch();
	return <ChatStreaming siteId={siteId} />;
}

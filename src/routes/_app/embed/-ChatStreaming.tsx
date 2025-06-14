import { useMutation } from "convex/react";

import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { Input } from "@/components/retroui/input";
import { Text } from "@/components/retroui/text";
import {
	type UIMessage,
	optimisticallySendMessage,
	toUIMessages,
	useSmoothText,
	useThreadMessages,
} from "@convex-dev/agent/react";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Minimize2, Repeat, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocalStorage } from "usehooks-ts";

export default function ChatStreaming({ siteId }: { siteId: string }) {
	const [isOpen, setIsOpen] = useState(true);
	const createThread = useMutation(api.chat.createThread);
	const [identifier, setIdentifier] = useLocalStorage<string>(
		"chat-identifier",
		"",
	);

	const [threadId, setThreadId] = useLocalStorage<undefined | string>(
		"chat-threadId",
		undefined,
	);

	const [localSiteId, setLocalSiteId] = useLocalStorage<string>(
		"chat-siteId",
		"",
	);

	// On mount or when threadId changes, if no threadId, create one and set hash
	useEffect(() => {
		if (!threadId) {
			void createThread({
				identifier,
				siteId: siteId as Id<"sites">,
			}).then((newId) => {
				setThreadId(() => newId);
			});
		}
	}, [createThread, threadId]);

	useEffect(() => {
		if (!localSiteId) {
			setLocalSiteId(siteId);
		}

		if (localSiteId !== siteId) {
			return handleReset();
		}
	}, [localSiteId, setLocalSiteId, siteId]);

	useEffect(() => {
		if (!identifier) {
			setIdentifier(crypto.randomUUID());
		}
	}, [identifier, setIdentifier]);

	// Reset handler: create a new thread and update hash
	const handleReset = () => {
		void createThread({
			identifier,
			siteId: siteId as Id<"sites">,
		}).then((newId) => {
			setThreadId(newId);
		});
	};

	if (!isOpen) {
		return (
			<Button
				className="absolute right-4 bottom-4 "
				size={"icon"}
				onClick={() => setIsOpen(true)}
			>
				<MessageCircle />
			</Button>
		);
	}

	return (
		<div className="h-screen w-full mx-auto overflow-hidden">
			<main className="flex-1 flex items-center justify-center">
				{threadId ? (
					<>
						<Messages
							threadId={threadId}
							reset={handleReset}
							siteId={siteId}
							minimizeChat={() => setIsOpen(false)}
						/>
					</>
				) : (
					<div className="text-center text-gray-500">Loading...</div>
				)}
			</main>
		</div>
	);
}

function Messages({
	threadId,
	reset,
	siteId,
	minimizeChat,
}: {
	threadId: string;
	reset: () => void;
	siteId: string;
	minimizeChat: () => void;
}) {
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, {
			siteId: siteId as Id<"sites">,
		}),
	);

	const messages = useThreadMessages(
		api.chat.listThreadMessages,
		{ threadId },
		{ initialNumItems: 10, stream: true },
	);

	const sendMessage = useMutation(
		api.chat.streamStoryAsynchronously,
	).withOptimisticUpdate(
		optimisticallySendMessage(api.chat.listThreadMessages),
	);
	const [prompt, setPrompt] = useState("");

	function onSendClicked() {
		if (prompt.trim() === "") return;
		void sendMessage({ threadId, prompt, siteId }).catch(() =>
			setPrompt(prompt),
		);
		setPrompt("");
	}

	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = chatContainerRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);

	if (!siteDetail && isLoading) {
		return null;
	}
	return (
		<>
			<Card className="sm:w-[360px] fixed bottom-0 left-0 right-0 top-0 sm:left-auto sm:top-auto  sm:bottom-[24px] overflow-scroll  h-screen sm:right-[24px] w-full max-w-2xl   sm:h-[520px] shadow-md flex flex-col">
				<Card.Header className="bg-primary flex items-center justify-between flex-row">
					<Text as={"h5"}>{siteDetail?.name}</Text>
					<Button onClick={minimizeChat} size={"icon"}>
						<Minimize2 size={14} />
					</Button>
				</Card.Header>
				<Card.Content
					ref={chatContainerRef}
					className=" sm:h-[calc(100%-30%)] h-[calc(100%-20%)] overflow-scroll mb-12"
				>
					{messages.results.length === 0 && (
						<div className="flex items-center justify-center h-full">
							<Text as={"p"}>Belum ada chat nih</Text>
						</div>
					)}
					{messages.results?.length > 0 && (
						<div className="flex flex-col gap-4 overflow-y-auto mb-4">
							{toUIMessages(messages.results ?? []).map((m) => (
								<Message key={m.key} message={m} />
							))}
						</div>
					)}
				</Card.Content>
				<form
					className="flex gap-2 items-center absolute bg-background  z-[999] bottom-4 right-4 left-4"
					onSubmit={(e) => {
						e.preventDefault();
						onSendClicked();
					}}
				>
					<Input
						type="text"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder={
							messages.results?.length > 0
								? "Lanjut bertanya..."
								: "Mau tau tentang apa nih..."
						}
					/>
					<Button size={"icon"} type="submit" disabled={!prompt.trim()}>
						<SendHorizonal />
					</Button>
					{messages.results?.length > 0 && (
						<Button
							size={"icon"}
							className="bg-destructive text-white hover:bg-destructive/90"
							onClick={() => reset()}
							type="button"
						>
							<Repeat />
						</Button>
					)}
				</form>
			</Card>
		</>
	);
}

function Message({ message }: { message: UIMessage }) {
	const isUser = message.role === "user";
	const [visibleText] = useSmoothText(message.content);
	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<Card className="max-w-[90%]">
				<Card.Content className="text-sm flex-col">
					<Text as={"p"} className="text-xs capitalize font-bold font-mono">
						{message.role}
					</Text>
					<Markdown remarkPlugins={[remarkGfm]}>{visibleText}</Markdown>
				</Card.Content>
			</Card>
		</div>
	);
}

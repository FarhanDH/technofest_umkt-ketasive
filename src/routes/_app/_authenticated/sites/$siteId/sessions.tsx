import { Breadcrumb } from "@/components/retroui/breadcrumb";
import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { Input } from "@/components/retroui/input";
import {
	Tabs,
	TabsContent,
	TabsPanels,
	TabsTriggerList,
} from "@/components/retroui/tabs";
import { Text } from "@/components/retroui/text";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSmoothText } from "@convex-dev/agent/react";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { SendHorizonal } from "lucide-react";
import Markdown from "react-markdown";

const DUMMY_SESSIONS = [
	{
		id: 2331212,
		date: "15 April 2025",
		lastContent: "apakah seblaknya masih ada?",
		contents: [
			{
				role: "user",
				content: "Halo apakah seblaknya masih ada",
			},
			{
				role: "assistant",
				content:
					"Terima kasih sudah menghubungi kami, seblak nya masih tersedia ya",
			},
			{
				role: "user",
				content: "Apakah stok seblaknya tersedia untuk 100 porsi?",
			},
			{
				role: "assistant",
				content:
					"Yap, porsi seblak tersedia untuk 100 porsi kak, silahkan dipesan...",
			},
		],
	},
	{
		id: 3122321,
		date: "15 April 2025",
		lastContent: "apakah bisa pembayaran dengan cod?",
		contents: [
			{
				role: "user",
				content: "Halo apakah pembayarannya bisa cod?",
			},
			{
				role: "assistant",
				content: "Halo, untuk pembayaran kami terima transfer dan cod",
			},
			{
				role: "user",
				content: "Setelah pesan, proses pembayarannya bagaimana?",
			},
			{
				role: "assistant",
				content: "Untuk proses pembayaran bisa dilakukan via transfer atau cod",
			},
		],
	},
	{
		id: 6325323,
		date: "15 April 2025",
		lastContent: "aku mau pesan dari samarinda apakah bisa?",
		contents: [
			{
				role: "user",
				content: "Halo aku mau pesan dari samarinda, apakah bisa?",
			},
			{
				role: "assistant",
				content:
					"Terima kasih sudah menghubungi kami, mohon maaf, kami belum melayani pemesanan diluar kota Jawa.",
			},
			{
				role: "user",
				content: "Yahh, padahal aku mau seblak di toko kamu!!",
			},
			{
				role: "assistant",
				content: "Terima kasih atas antusiasmenya, Tunggu kami dikotamu yaa",
			},
		],
	},
];

export const Route = createFileRoute(
	"/_app/_authenticated/sites/$siteId/sessions",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, { siteId: siteId as Id<"sites"> }),
	);

	// const { data: sessions } = useQuery(
	// 	convexQuery(api.sessions.getSiteSessions, {
	// 		siteId: siteId as Id<"sites">,
	// 	}),
	// );

	if (!siteDetail && !isLoading)
		throw redirect({
			to: "/sites",
		});
	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<Breadcrumb.List>
							<Breadcrumb.Item className="hidden md:block">
								<Breadcrumb.Link href="/sites">Sites</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator className="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Link href={`/sites/${siteDetail?._id}`}>
									{siteDetail?.name}
								</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator className="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>Riwayat Percakapan</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>
			</header>

			<main className="p-4 sm:px-10 space-y-6">
				<div className="flex flex-col">
					<Text as={"h4"}>Riwayat Percakapan</Text>
					<Text as={"p"} className="text-sm">
						Melihat riwayat percakapan kamu dengan user
					</Text>
				</div>

				<Tabs
					defaultValue={DUMMY_SESSIONS[0].id}
					className={"flex flex-col-reverse md:flex-row gap-4"}
				>
					<TabsTriggerList className="flex flex-col w-sm pr-4 space-y-4">
						{DUMMY_SESSIONS.map((s) => (
							<Tab
								key={s.id}
								className={
									"w-full data-selected:border-border data-selected:bg-primary data-selected:font-semibold"
								}
								value={s.id}
							>
								<Card
									className={
										"w-full shadow-sm data-selected:border-border data-selected:bg-primary data-selected:font-semibold"
									}
								>
									<Card.Header className="flex items-center justify-between flex-row">
										<Text as={"p"} className="font-black text-sm">
											ID: {s.id}
										</Text>
										<Text as={"p"} className="text-xs font-mono text-start">
											{s.date}
										</Text>
									</Card.Header>
									<Card.Content className="pt-0">
										<Text as={"p"} className="text-xs font-mono text-start">
											{s.lastContent}
										</Text>
									</Card.Content>
								</Card>
							</Tab>
						))}
					</TabsTriggerList>
					<TabsPanels className={"w-full h-[80vh] relative"}>
						{DUMMY_SESSIONS.map((s) => (
							<TabsContent key={s.id} className="w-full h-full border-none p-0">
								<Card className="w-full h-full data-state">
									<Card.Header className="bg-primary">
										<Text as={"p"} className="font-bold">
											ID: {s.id}
										</Text>
									</Card.Header>
									<Card.Content>
										<div className="flex flex-col gap-4 overflow-y-auto mb-4">
											{s.contents.map((m) => (
												<Message key={m.content} message={m} />
											))}
										</div>
									</Card.Content>
									<form className="flex gap-2 items-center absolute bg-background  z-[999] bottom-4 right-4 left-4">
										<Input
											type="text"
											placeholder={"Balas pertanyaan pelanggan disini..."}
										/>
										<Button size={"icon"}>
											<SendHorizonal />
										</Button>
									</form>
								</Card>
							</TabsContent>
						))}
					</TabsPanels>
				</Tabs>
			</main>
		</>
	);
}

function Message({
	message,
}: { message: (typeof DUMMY_SESSIONS)[0]["contents"][0] }) {
	const isUser = message.role === "user";
	const [visibleText] = useSmoothText(message.content);
	return (
		<div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
			<Card className="max-w-[90%]">
				<Card.Content className="text-sm flex-col">
					<Text as={"p"} className="text-xs capitalize font-bold font-mono">
						{message.role}
					</Text>
					<Markdown>{visibleText}</Markdown>
				</Card.Content>
			</Card>
		</div>
	);
}

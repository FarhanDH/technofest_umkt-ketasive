import { Breadcrumb } from "@/components/retroui/breadcrumb";
import { Card } from "@/components/retroui/card";
import { closeRetroDialog } from "@/components/retroui/dialog";
import {
	Tabs,
	TabsContent,
	TabsPanels,
	TabsTrigger,
	TabsTriggerList,
} from "@/components/retroui/tabs";
import { Text } from "@/components/retroui/text";
import { closeDrawerDialog } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { FileQuestion, Search } from "lucide-react";
import { useState } from "react";
import DialogFAQ from "./-components/dialog-faq";
import DialogManualText from "./-components/dialog-manual-text";

export const Route = createFileRoute(
	"/_app/_authenticated/sites/$siteId/contexts",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, { siteId: siteId as Id<"sites"> }),
	);
	const [isPending, setIsPending] = useState<boolean>(false);
	const createContext = useAction(api.contexts.createContext);

	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");

	const { data: contexts } = useQuery(
		convexQuery(api.contexts.getContexts, {
			siteId: siteId as Id<"sites">,
		}),
	);

	const handleTextSubmit = async () => {
		setIsPending(true);
		await createContext({
			content,
			siteId: siteId as Id<"sites">,
			title,
			type: "text",
		}).then(() => setIsPending(false));
		setTitle("");
		setContent("");
		closeRetroDialog();
		closeDrawerDialog();
	};
	const handleFAQSubmit = async () => {
		await createContext({
			content,
			siteId: siteId as Id<"sites">,
			title,
			type: "faq",
		}).then(() => setIsPending(false));
		setTitle("");
		setContent("");
		closeRetroDialog();
		closeDrawerDialog();
	};

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
								<Breadcrumb.Page>Konteks</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>
			</header>

			<main className="p-4 sm:px-10 space-y-6">
				<div className="flex flex-col">
					<Text as={"h4"}>Konteks</Text>
					<Text as={"p"} className="text-sm">
						Isi konteks untuk menambah pemahaman pada AI
					</Text>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<DialogManualText
						title={title}
						setTitle={setTitle}
						content={content}
						setContent={setContent}
						onSubmit={handleTextSubmit}
						disabled={isPending}
					/>
					<DialogFAQ
						title={title}
						setTitle={setTitle}
						content={content}
						setContent={setContent}
						onSubmit={handleFAQSubmit}
						disabled={isPending}
					/>
				</div>

				<Text as={"h4"}>Konteks Kamu</Text>

				<Tabs defaultValue={"text"}>
					<TabsTriggerList>
						<TabsTrigger value={"text"}>Teks</TabsTrigger>
						<TabsTrigger value={"faq"}>FAQ</TabsTrigger>
					</TabsTriggerList>
					<TabsPanels>
						<TabsContent key={"text"} className="space-y-4 border-none">
							{contexts?.filter((c) => c.type === "text").length === 0 && (
								<EmptyState
									title="Konteks teks belum tersedia"
									description="Tambahkan konteks teks sekarang"
									icons={[Search, FileQuestion]}
									className="w-full mx-auto"
								/>
							)}
							{contexts
								?.filter((c) => c.type === "text")
								.map((c) => (
									<Card key={c._id}>
										<Card.Header>
											<Text as={"h5"}>{c.title}</Text>
										</Card.Header>
										<Card.Content>
											<Text as={"p"}>{c.content}</Text>
										</Card.Content>
									</Card>
								))}
						</TabsContent>
						<TabsContent key={"faq"} className="border-none space-y-4">
							{contexts?.filter((c) => c.type === "faq").length === 0 && (
								<EmptyState
									title="Konteks faq belum tersedia"
									description="Tambahkan konteks faq sekarang"
									icons={[Search, FileQuestion]}
									className="w-full mx-auto"
								/>
							)}
							{contexts
								?.filter((c) => c.type === "faq")
								.map((c) => (
									<Card key={c._id} className="w-full">
										<Card.Header>
											<Text as={"h5"}>Q: {c.title}</Text>
										</Card.Header>
										<Card.Content>
											<Text as={"h5"}>A: {c.content}</Text>
										</Card.Content>
									</Card>
								))}
						</TabsContent>
					</TabsPanels>
				</Tabs>
			</main>
		</>
	);
}

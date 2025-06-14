import { Breadcrumb } from "@/components/retroui/breadcrumb";
import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { Text } from "@/components/retroui/text";
import { CodeBlock } from "@/components/ui/code-block";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ChatStreaming from "@/routes/_app/embed/-ChatStreaming";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";

export const Route = createFileRoute(
	"/_app/_authenticated/sites/$siteId/ai-chat",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, { siteId: siteId as Id<"sites"> }),
	);

	const scriptTag = `<script 
	src="http://localhost:3000/scripts/embed.js"
	data-site-id="${siteId}">
</script>`;

	if (!siteDetail && !isLoading)
		throw redirect({
			to: "/sites",
		});
	return (
		<div className="sm:max-h-[110vh] overflow-hidden">
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
								<Breadcrumb.Page>Chatbot</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>
			</header>

			<main className="p-4 sm:px-10 space-y-6">
				<div className="flex flex-col">
					<Text as={"h4"}>Chatbot</Text>
					<Text as={"p"} className="text-sm">
						Kustomisasi chatbot mu di halaman ini dan lihat perubahanya
					</Text>
				</div>
				<div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div className="w-full col-span-2 space-y-6">
						<CodeBlock
							language="html"
							filename="index.html"
							highlightLines={[2, 3]}
							code={scriptTag}
						/>

						<Text as={"h5"}>Warna Bubble Chat</Text>

						<div className="grid grid-cols-2 md:grid-cols-3  gap-4">
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#134D37]")}
									/>
								</Card.Content>
							</Card>
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#4F9D90]")}
									/>
								</Card.Content>
							</Card>
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#62AFCB]")}
									/>
								</Card.Content>
							</Card>
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#E8A66D]")}
									/>
								</Card.Content>
							</Card>
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#8A3B53]")}
									/>
								</Card.Content>
							</Card>
							<Card className="h-52">
								<Card.Content className="space-y-3">
									<div className={cn("h-8 max-w-[80%] bg-[#1A2930]")} />
									<div
										className={cn(" h-8 max-w-[80%] ml-auto bg-[#7134C1]")}
									/>
								</Card.Content>
							</Card>
						</div>
						<Button className="w-full justify-center gap-2">
							<Save /> Simpan Perubahan
						</Button>
					</div>
				</div>
			</main>
			<ChatStreaming siteId={siteId} />
		</div>
	);
}

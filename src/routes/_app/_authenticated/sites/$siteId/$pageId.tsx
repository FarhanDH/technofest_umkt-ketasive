import { Breadcrumb } from "@/components/retroui/breadcrumb";
import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { Text } from "@/components/retroui/text";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronLeft, Globe, RefreshCcw } from "lucide-react";

export const Route = createFileRoute(
	"/_app/_authenticated/sites/$siteId/$pageId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { pageId, siteId } = Route.useParams();
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, {
			siteId: siteId as Id<"sites">,
		}),
	);

	const { data: pageDetail } = useQuery(
		convexQuery(api.pages.getOnePage, {
			pageId: pageId as Id<"pages">,
		}),
	);

	const navigate = useNavigate();

	const url = new URL(pageDetail?.url || "http://test.com");
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
								<Breadcrumb.Link href={`/sites/${siteDetail?._id}`}>
									Halaman
								</Breadcrumb.Link>
							</Breadcrumb.Item>

							<Breadcrumb.Separator className="hidden md:block" />
							<Breadcrumb.Item className="hidden md:block">
								<Breadcrumb.Page>{url.pathname}</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>
			</header>

			<main className="p-4 sm:px-10 space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Button
							size="icon"
							variant={"link"}
							onClick={() =>
								navigate({
									to: "/sites/$siteId",
									params: {
										siteId: siteId as Id<"sites">,
									},
								})
							}
						>
							<ChevronLeft className="size-8" />
						</Button>
						<div className="flex flex-col">
							<Text as={"h4"}>Detail Halaman</Text>
							<Text as={"p"} className="text-sm">
								Anda bisa mengubah dan menambah data yang ada pada halaman situs
							</Text>
						</div>
					</div>
					<Button className="inline-flex items-center gap-1.5">
						<RefreshCcw />{" "}
						<span className="hidden sm:inline">Indexing Ulang</span>
					</Button>
				</div>

				<Card className="w-full">
					<Card.Content className="flex items-center gap-2">
						<Globe /> <Text as={"h6"}>{siteDetail?.domain}</Text>
					</Card.Content>
				</Card>

				<Card className="w-full">
					<Card.Content className="flex items-center gap-4 ">
						<Text as={"p"} className="text-sm text-muted-foreground">
							Status <span className="hidden sm:inline">Indeks:</span>{" "}
							<span
								className={cn("capitalize", {
									"text-green-400": pageDetail?.status === "indexed",
									"text-red-400": pageDetail?.status === "failed",
								})}
							>
								{" "}
								{pageDetail?.status === "indexed"
									? "selesai"
									: pageDetail?.status === "pending"
										? "sedang indexing"
										: "kesalahan"}
							</span>
						</Text>
						<Text
							as={"p"}
							className="text-sm text-muted-foreground inline-flex items-center gap-1.5"
						>
							<Calendar size={14} />{" "}
							<span className="hidden sm:inline">Index Pertama:</span>{" "}
							<span className="font-bold">15 April 2025</span>
						</Text>
						<Text
							as={"p"}
							className="text-sm text-muted-foreground inline-flex items-center gap-1.5"
						>
							<Calendar size={14} />{" "}
							<span className="hidden sm:inline">Pembaruan Terakhir:</span>{" "}
							<span className="font-bold">15 April 2025</span>
						</Text>
					</Card.Content>
				</Card>

				<div className="flex flex-col gap-6">
					<Text as={"h4"}>Konten</Text>

					<Card>
						<Card.Header className="bg-primary">
							<Text as={"p"} className="font-bold">
								{url.pathname}
							</Text>
						</Card.Header>
						<Card.Content>
							<Text as={"p"} className="text-justify">
								{pageDetail?.content}
							</Text>
						</Card.Content>
					</Card>
				</div>
			</main>
		</>
	);
}

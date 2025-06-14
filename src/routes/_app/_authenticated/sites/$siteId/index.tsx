import { Card } from "@/components/retroui/card";
import { Text } from "@/components/retroui/text";
import { Badge } from "@/components/ui/badge";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Doc, Id } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { Breadcrumb } from "@/components/retroui/breadcrumb";
import { Button } from "@/components/retroui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { driver } from "driver.js";
import { CheckCircle2, Globe, Loader2, RefreshCcw, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import "driver.js/dist/driver.css";

const loadingStates = [
	{
		text: "Menarik halaman utama",
	},
	{
		text: "Mendapatkan content dari setiap halaman",
	},
	{
		text: "Membuat embedding content",
	},
	{
		text: "Simpan embedding ke database",
	},
	{
		text: "Ekstraksi konten berhasil",
	},
];

export const Route = createFileRoute("/_app/_authenticated/sites/$siteId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { siteId } = Route.useParams();
	const { data: siteDetail, isLoading } = useQuery(
		convexQuery(api.sites.getOneSite, { siteId: siteId as Id<"sites"> }),
	);
	const [dummyLoading, setDummyLoading] = useState(false);

	const [isSiteDetailOnboarded, setIsSiteDetailOnboarded] =
		useLocalStorage<boolean>("is-site-detail-onboarded", false);

	useEffect(() => {
		if (dummyLoading) {
			setTimeout(() => {
				setDummyLoading(false);
			}, 7500);
		}
	}, [dummyLoading, setDummyLoading]);

	const driverObj = driver({
		showProgress: true,
		steps: [
			{
				element: "#sidebar-item-halaman",
				popover: {
					title: "Detail Site",
					description:
						"Pada halaman ini berisi kumpulan halaman yang telah di simpan dan telusuri untuk menjadi konteks pertama chatbot",
				},
			},
			{
				element: "#sidebar-item-riwayat-percakapan",
				popover: {
					title: "Riwayat Percakapan",
					description:
						"Riwayat Percakapan berisi history percakapan customer dengan chatbot, Pada halaman ini kamu dapat menjawab langsung pertanyaan customer",
				},
			},
			{
				element: "#sidebar-item-konteks",
				popover: {
					title: "Konteks",
					description:
						"Pada halaman ini berisi konteks tambahan yang dapat kamu diberikan untuk memperkaya pengetahuan chatbot",
				},
			},
			{
				element: "#sidebar-item-chatbot",
				popover: {
					title: "Chatbot",
					description:
						"Pada halaman ini kamu dapat melakukan kustomisasi tampilan chatbot dan mendapatkan script yang dapat digunakan untuk embed chatbot pada website UMKM",
				},
			},
		],
		onDestroyed: () => setIsSiteDetailOnboarded(true),
	});

	useEffect(() => {
		if (isLoading) return;
		if (!isSiteDetailOnboarded) {
			driverObj.drive();
		}
	}, [isSiteDetailOnboarded, setIsSiteDetailOnboarded, isLoading]);

	if (!siteDetail && !isLoading)
		throw redirect({
			to: "/sites",
		});
	return (
		<>
			<Loader
				loadingStates={loadingStates}
				loading={dummyLoading}
				duration={1500}
				loop={false}
			/>
			{dummyLoading && (
				<Button
					size={"icon"}
					className="fixed top-4 right-4 text-black dark:text-white z-[120]"
					onClick={() => setDummyLoading(false)}
				>
					<IconSquareRoundedX />
				</Button>
			)}
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
								<Breadcrumb.Page>{siteDetail?.name}</Breadcrumb.Page>
							</Breadcrumb.Item>
							<Breadcrumb.Separator className="hidden md:block" />
							<Breadcrumb.Item className="hidden md:block">
								<Breadcrumb.Page>Pages</Breadcrumb.Page>
							</Breadcrumb.Item>
						</Breadcrumb.List>
					</Breadcrumb>
				</div>
			</header>

			<main className="p-4 sm:px-10 space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<Text as={"h4"}>Halaman Situs</Text>
						<Text as={"p"} className="text-sm">
							Informasi mengenai domain anda dan halaman yang ada di situs anda
						</Text>
					</div>
					<Button
						className="inline-flex items-center gap-1.5"
						onClick={() => setDummyLoading(true)}
					>
						<RefreshCcw />{" "}
						<span className="hidden sm:inline-flex">Indexing Ulang</span>
					</Button>
				</div>

				<Card className="w-full">
					<Card.Content className="flex items-center gap-2">
						<Globe /> <Text as={"h6"}>{siteDetail?.domain}</Text>
					</Card.Content>
				</Card>

				<Text as={"p"} className="font-bold  ">
					Lihat semua halaman dari situs web Anda dan status penyerapannya saat
					ini.
				</Text>

				<div className="flex flex-col gap-6">
					{siteDetail?.pages.map((page) => (
						<PageItem key={page._id} {...page} />
					))}
				</div>
			</main>
		</>
	);
}

type PageItemProps = Doc<"pages">;

const PageItem: React.FC<PageItemProps> = (props) => {
	const url = new URL(props.url);

	return (
		<Link
			to="/sites/$siteId/$pageId"
			params={{
				pageId: props._id,
				siteId: props.siteId,
			}}
		>
			<Card className="w-full flex  justify-between shadow-sm">
				<Card.Header>
					<Text as={"p"} className="font-mono">
						{url.pathname}
					</Text>
					<Text as="p" className="text-muted-foreground font-mono text-xs">
						{props.url}
					</Text>
				</Card.Header>
				<Badge
					className={cn("h-fit m-4", {
						"bg-green-400": props.status === "indexed",
						"bg-red-400": props.status === "failed",
					})}
				>
					{props.status === "indexed" ? (
						<CheckCircle2 />
					) : props.status === "pending" ? (
						<Loader2 />
					) : (
						<X />
					)}

					{props.status === "indexed"
						? "selesai"
						: props.status === "pending"
							? "sedang indexing"
							: "kesalahan"}
				</Badge>
			</Card>
		</Link>
	);
};

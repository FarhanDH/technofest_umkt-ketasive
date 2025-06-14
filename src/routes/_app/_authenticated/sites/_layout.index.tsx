import { HeaderConfiguration } from "@/components/header-provider";
import { Badge } from "@/components/retroui/badge";
import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { closeRetroDialog } from "@/components/retroui/dialog";
import { Input } from "@/components/retroui/input";
import { Label } from "@/components/retroui/label";
import { Text } from "@/components/retroui/text";
import { closeDrawerDialog } from "@/components/ui/drawer";
import { LinkPreview } from "@/components/ui/link-preview";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import siteConfig from "@/site.config";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import type { Doc } from "@cvx/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { driver } from "driver.js";
import { Plus, SendHorizonal } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import "driver.js/dist/driver.css";
import { useLocalStorage } from "usehooks-ts";

export const Route = createFileRoute("/_app/_authenticated/sites/_layout/")({
	component: RouteComponent,
	beforeLoad: () => ({
		title: `${siteConfig.siteTitle} - Sites`,
	}),
	ssr: true,
});

function RouteComponent() {
	const { data: sites, isLoading } = useQuery(
		convexQuery(api.sites.getSites, {}),
	);
	const createAndCrawl = useAction(api.sites.createAndCrawlSite);

	const [isSitesOnboarded, setIsSitesOnboarded] = useLocalStorage(
		"is-sites-onboarded",
		false,
	);

	const [name, setName] = useState<string>("");
	const [domain, setDomain] = useState<string>("");

	const handleCreateSite = async () => {
		await createAndCrawl({
			name,
			domain,
		});

		setName("");
		setDomain("");
		closeRetroDialog();
		closeDrawerDialog();
	};

	const driverObj = driver({
		showProgress: true,
		steps: [
			{
				element: ".add-site",
				popover: {
					title: "Tambahkan situs",
					description:
						"Tambahkan situs untuk memulai crawling dan menggunakan chatbot",
				},
			},
		],
		onDestroyed: () => setIsSitesOnboarded(true),
	});

	useEffect(() => {
		if (!isSitesOnboarded) {
			driverObj.drive();
		}
	}, [isSitesOnboarded, setIsSitesOnboarded]);

	return (
		<>
			<HeaderConfiguration
				headerDescription="Manage Your Sites."
				headerTitle="Sites"
			/>

			<div className="flex h-full w-full  px-6 py-8">
				<div className="z-10 mx-auto h-full w-full max-w-screen-xl gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  flex-wrap">
					<ResponsiveDrawer
						title="Tambahkan situs baru"
						triggerComp={
							<Card className="w-full  add-site h-[200px] justify-between">
								<Card.Header>
									<Card.Title>
										<Text as={"h6"}>Tambahkan Situs</Text>
									</Card.Title>
								</Card.Header>
								<Card.Content className="flex items-center h-full justify-between">
									<Text
										as={"p"}
										className="text-xs text-muted-foreground font-mono"
									>
										Ayo tambahkan situs baru
									</Text>
									<Button variant={"secondary"} size={"icon"}>
										<Plus />
									</Button>
								</Card.Content>
							</Card>
						}
					>
						<div className="flex flex-col gap-4 p-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="Your site name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="domain">Domain</Label>
								<Input
									id="domain"
									placeholder="Your domain"
									value={domain}
									onChange={(e) => setDomain(e.target.value)}
								/>
							</div>

							<div className="flex items-center justify-end">
								<Button type={"button"} onClick={handleCreateSite}>
									Save and Crawl
								</Button>
							</div>
						</div>
					</ResponsiveDrawer>
					{isLoading && [1, 2, 3].map((itm) => <Skeleton key={itm} />)}
					{sites?.map((item) => (
						<SiteItem key={item._id} {...item} />
					))}
				</div>
			</div>
		</>
	);
}

const SiteItemLSkeleton = () => {
	return <Skeleton className="w-full h-[200px]" />;
};

type SiteItemProps = Doc<"sites">;
const SiteItem: React.FC<SiteItemProps> = (props) => {
	return (
		<Card className="w-full h-[200px] justify-between">
			<Card.Header className="">
				<Text as={"h5"} className="mb-2">
					{props.name}
				</Text>
			</Card.Header>
			<Card.Content className="flex flex-col mt-6">
				<Badge variant={"default"} className="text-xs w-fit">
					{props.active ? "Aktif" : "Tidak Aktif"}
				</Badge>
				<div className="flex items-center justify-between">
					<LinkPreview url={props.domain} className="w-full">
						<Text
							as={"p"}
							className="text-xs text-muted-foreground font-mono max-w-[80%]"
						>
							{props.domain.length > 22
								? `${props.domain.slice(0, 22)}...`
								: props.domain}
						</Text>
					</LinkPreview>
					<Link
						to="/sites/$siteId"
						params={{
							siteId: props._id,
						}}
					>
						<Button size={"icon"}>
							<SendHorizonal />
						</Button>
					</Link>
				</div>
			</Card.Content>
		</Card>
	);
};

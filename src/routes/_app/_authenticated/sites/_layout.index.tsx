import { HeaderConfiguration } from "@/components/header-provider";
import { Text } from "@/components/retroui/text";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import siteConfig from "@/site.config";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, SendHorizonal } from "lucide-react";
import type React from "react";

export const Route = createFileRoute("/_app/_authenticated/sites/_layout/")({
	component: RouteComponent,
	beforeLoad: () => ({
		title: `${siteConfig.siteTitle} - Sites`,
	}),
	ssr: true,
});

const SAMPLE_SITES = [
	{
		title: "Rumah Makan Minang",
		url: "https://minangku.co.id",
		siteId: "1",
	},
	{
		title: "Amplang Samarinda Abadi",
		url: "https://amplang-samarinda.co.id",
		siteId: "2",
	},
	{
		title: "Bricket Indonesia",
		url: "https://bricket-id.com",
		siteId: "3",
	},
];

function RouteComponent() {
	return (
		<>
			<HeaderConfiguration
				headerDescription="Manage Your Sites."
				headerTitle="Sites"
			/>
			<div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-black">
				<div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12 flex-wrap">
					<ResponsiveDrawer
						title="Tambahkan situs baru"
						description="..."
						triggerComp={
							<Card className="w-[350px] h-[200px] justify-between border-dashed border shadow-none base-grid">
								<CardHeader>
									<CardTitle>
										<Text as={"h6"}>Tambahkan Situs</Text>
									</CardTitle>
								</CardHeader>
								<CardFooter className="flex items-center justify-between">
									<Text
										as={"p"}
										className="text-xs text-muted-foreground font-mono"
									>
										Ayo tambahkan situs baru
									</Text>
									<Button size={"icon"}>
										<Plus />
									</Button>
								</CardFooter>
							</Card>
						}
					>
						<div className="flex flex-col gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input id="title" placeholder="Your site title" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="siteUrl">Site URL</Label>
								<Input id="siteUrl" placeholder="Your site url" />
							</div>

							<div className="flex items-center justify-end">
								<Button>Save and Crawl</Button>
							</div>
						</div>
					</ResponsiveDrawer>
					{SAMPLE_SITES.map((item) => (
						<SiteItem key={item.url} {...item} />
					))}
				</div>
			</div>
		</>
	);
}

type SiteItemProps = {
	title: string;
	url: string;
	siteId: string;
};
const SiteItem: React.FC<SiteItemProps> = ({ title, url, siteId }) => {
	return (
		<Link
			to="/sites/$siteId"
			params={{
				siteId,
			}}
		>
			<Card className="w-[350px] h-[200px] justify-between">
				<CardHeader>
					<CardTitle>
						<Text as={"h6"}>{title}</Text>
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex items-center justify-between">
					<Text as={"p"} className="text-xs text-muted-foreground font-mono">
						{url}
					</Text>
					<Button size={"icon"}>
						<SendHorizonal />
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
};

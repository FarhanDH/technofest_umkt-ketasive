"use client";

import { BookOpen, Bot, MessageCircle, SquareTerminal } from "lucide-react";
import type * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { SiteSwitcher } from "./site-switcher";

import { api } from "@cvx/_generated/api";
import type { Id } from "@cvx/_generated/dataModel";
import { useQuery } from "convex/react";

export function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & { siteId: string }) {
	const sites = useQuery(api.sites.getSites, {});
	const data = {
		navMain: [
			{
				title: "Halaman",
				url: `/sites/${props.siteId}`,
				icon: SquareTerminal,
			},
			{
				title: "Riwayat Percakapan",
				url: `/sites/${props.siteId}/sessions`,
				icon: MessageCircle,
			},
			{
				title: "Konteks",
				url: `/sites/${props.siteId}/contexts`,
				icon: BookOpen,
			},
			{
				title: "Chatbot",
				url: `/sites/${props.siteId}/ai-chat`,
				icon: Bot,
			},
		],
	};
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="bg-background">
				{sites && (
					<SiteSwitcher
						currentSite={props.siteId as Id<"sites">}
						sites={sites}
					/>
				)}
			</SidebarHeader>
			<SidebarContent className="bg-background">
				<NavMain items={data.navMain} />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			{/* <SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter> */}
			<SidebarRail />
		</Sidebar>
	);
}

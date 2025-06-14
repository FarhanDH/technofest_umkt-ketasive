"use client";

import { ChevronsUpDown, Globe } from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type { Doc, Id } from "@cvx/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";

export function SiteSwitcher({
	sites,
	currentSite,
}: {
	sites: Doc<"sites">[];
	currentSite: Id<"sites">;
}) {
	const { isMobile } = useSidebar();
	const [activeSite, setActiveSite] = React.useState(
		sites.find((s) => s._id === currentSite),
	);
	const navigate = useNavigate();

	if (!activeSite) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<Globe className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{activeSite.name}</span>
								<span className="truncate text-xs">{activeSite.domain}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) bg-background min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Sites
						</DropdownMenuLabel>
						{sites.map((site, index) => (
							<DropdownMenuItem
								key={site.name}
								onClick={() => {
									setActiveSite(site);
									navigate({
										to: "/sites/$siteId",
										params: {
											siteId: site._id,
										},
									});
								}}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-md border">
									<Globe className="size-3.5 shrink-0" />
								</div>
								{site.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

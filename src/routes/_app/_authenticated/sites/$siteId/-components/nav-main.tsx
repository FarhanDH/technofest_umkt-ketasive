"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
	}[];
}) {
	const navigate = useNavigate();

	const selected = useRouterState({
		select: (state) => state.location,
	});

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu className="space-y-4">
				{items.map((item) => (
					<SidebarMenuItem
						key={item.title}
						id={`sidebar-item-${item.title.split(" ").join("-").toLowerCase()}`}
					>
						<SidebarMenuButton tooltip={item.title} asChild>
							<Button
								onClick={() =>
									navigate({
										to: item.url,
									})
								}
								className="justify-start"
								variant={selected.href === item.url ? "secondary" : "ghost"}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

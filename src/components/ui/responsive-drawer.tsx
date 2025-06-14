"use client";

import * as React from "react";

import { Dialog } from "@/components/retroui/dialog";
import { Text } from "@/components/retroui/text";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";

type ResponsiveDrawerProps = React.PropsWithChildren & {
	title: string;
	triggerComp: React.ReactNode;
};

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = (props) => {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<Dialog.Trigger asChild>{props.triggerComp}</Dialog.Trigger>
				<Dialog.Content className="sm:max-w-[425px]">
					<Dialog.Header className="flex">
						<Text>{props.title}</Text>
					</Dialog.Header>

					{props.children}
				</Dialog.Content>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{props.triggerComp}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{props.title}</DrawerTitle>
				</DrawerHeader>
				{props.children}
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

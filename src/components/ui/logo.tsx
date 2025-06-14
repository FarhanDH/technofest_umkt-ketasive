import { cn } from "@/lib/utils";
import { Text } from "../retroui/text";

interface LogoProps {
	width?: number;
	height?: number;
	className?: string;
	[key: string]: unknown | undefined;
}

export function Logo({ width, height, className, ...args }: LogoProps) {
	return <Text as={"h3"}>Wira</Text>;
}

import { cn } from "@/lib/utils";
import type React from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
	placeholder = "Enter text...",
	className = "",
	...props
}) => {
	return (
		<textarea
			placeholder={placeholder}
			rows={4}
			className={cn(
				"px-4 py-2 w-full border-2 border-border shadow-md transition focus:outline-hidden focus:shadow-xs placeholder:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
};

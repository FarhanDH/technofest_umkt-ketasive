import { Button } from "@/components/retroui/button";
import { Input } from "@/components/retroui/input";
import { Label } from "@/components/retroui/label";
import { Text } from "@/components/retroui/text";
import { Textarea } from "@/components/retroui/textarea";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { MessageSquare } from "lucide-react";
import type React from "react";

type DialogFAQProps = {
	title: string;
	setTitle: (title: string) => void;
	content: string;
	setContent: (content: string) => void;
	onSubmit: () => void;
	disabled: boolean;
};

const DialogFAQ: React.FC<DialogFAQProps> = (props) => {
	return (
		<ResponsiveDrawer
			title="Tambahkan konteks FAQ"
			triggerComp={
				<Button className="flex flex-col items-start gap-2 p-4">
					<span className="inline-flex gap-4">
						<MessageSquare /> FAQ
					</span>
					<Text as={"p"} className="text-start text-xs">
						Buat FAQ terstruktur untuk melatih AI anda dengan pertanyaan dan
						jawaban umum.
					</Text>
				</Button>
			}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					props.onSubmit();
				}}
				className="flex flex-col gap-4 p-4"
			>
				<div className="space-y-2">
					<Label htmlFor="title">Pertanyaan Q:</Label>
					<Input
						id="title"
						placeholder="Masukan Pertanyaan "
						value={props.title}
						onChange={(e) => props.setTitle(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="content">Jawaban A:</Label>
					<Textarea
						id="content"
						placeholder="Tuliskan jawaban dari pertanyaan"
						value={props.content}
						rows={4}
						onChange={(e) => props.setContent(e.target.value)}
					/>
				</div>

				<div className="flex items-center justify-end">
					<Button type={"submit"} disabled={props.disabled}>
						{props.disabled ? "Loading..." : "Tambahkan FAQ"}
					</Button>
				</div>
			</form>
		</ResponsiveDrawer>
	);
};

export default DialogFAQ;

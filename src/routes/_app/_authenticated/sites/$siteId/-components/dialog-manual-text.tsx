import { Button } from "@/components/retroui/button";
import { Card } from "@/components/retroui/card";
import { Input } from "@/components/retroui/input";
import { Label } from "@/components/retroui/label";
import { Text } from "@/components/retroui/text";
import { Textarea } from "@/components/retroui/textarea";
import { ResponsiveDrawer } from "@/components/ui/responsive-drawer";
import { File, Plus } from "lucide-react";
import type React from "react";

type DialogManualTextProps = {
	title: string;
	setTitle: (title: string) => void;
	content: string;
	setContent: (content: string) => void;
	onSubmit: () => void;
	disabled: boolean;
};

const DialogManualText: React.FC<DialogManualTextProps> = (props) => {
	return (
		<ResponsiveDrawer
			title="Tambahkan konteks teks"
			triggerComp={
				<Button className="flex flex-col items-start gap-2 p-4">
					<span className="inline-flex gap-4">
						<File /> Manual Teks
					</span>
					<Text as={"p"} className="text-start text-xs">
						Masukan isi konten secara manual untuk melatih kemampuan AI kamu
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
					<Label htmlFor="title">Judul Konteks</Label>
					<Input
						id="title"
						placeholder="Judul konteks kamu"
						value={props.title}
						onChange={(e) => props.setTitle(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="content">Konten Teks</Label>
					<Textarea
						id="content"
						placeholder="Tuliskan konten teks kamu"
						value={props.content}
						rows={4}
						onChange={(e) => props.setContent(e.target.value)}
					/>
				</div>

				<div className="flex items-center justify-end">
					<Button type={"submit"} disabled={props.disabled}>
						{props.disabled ? "Loading..." : "Tambahkan Konteks"}
					</Button>
				</div>
			</form>
		</ResponsiveDrawer>
	);
};

export default DialogManualText;

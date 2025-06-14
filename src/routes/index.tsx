import { Button } from "@/components/retroui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { SignInButton, SignUp } from "@clerk/clerk-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { Loader2, Send, SendHorizonal } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Index,
	ssr: true,
});

function Index() {
	const { isLoading, isAuthenticated } = useConvexAuth();
	return (
		<div className="relative flex h-full w-full flex-col bg-card">
			{/* Navigation */}
			<div className="sticky top-0 z-50 mx-auto flex w-full bg-background/10 backdrop-blur-sm max-w-screen-lg items-center justify-between p-6 py-3">
				<Link to="/" className="flex h-10 items-center gap-1">
					<Logo />{" "}
				</Link>
				<div className="flex items-center gap-4">
					<Unauthenticated>
						<SignInButton
							mode="modal"
							fallbackRedirectUrl={"/sites"}
							signUpFallbackRedirectUrl={"/onboarding/username"}
						>
							<Button size={"sm"} disabled={isLoading}>
								{isLoading && <Loader2 className="animate-spin w-16 h-4" />}
								{!isLoading && !isAuthenticated && "Get Started"}
							</Button>
						</SignInButton>
					</Unauthenticated>

					<Authenticated>
						<Button size={"sm"} disabled={isLoading}>
							<Link
								to={"/sites"}
								// className={buttonVariants({ size: "sm" })}
								disabled={isLoading}
							>
								{isLoading && <Loader2 className="animate-spin w-16 h-4" />}
								{!isLoading && isAuthenticated && "Sites"}
							</Link>
						</Button>
					</Authenticated>
				</div>
			</div>

			<HeroSection />
		</div>
	);
}

import { motion } from "motion/react";

export function HeroSection() {
	const { isLoading, isAuthenticated } = useConvexAuth();
	return (
		<div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
			<div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
				<div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
			</div>
			<div className="px-4 py-10 md:py-20">
				<h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
					{"Balas pesan dalam hitungan detik, bukan jam"
						.split(" ")
						.map((word, index) => (
							<motion.span
								key={word}
								initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
								animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: "easeInOut",
								}}
								className={cn("mr-2 inline-block", {
									"text-destructive line-through decoration-[8px] italic":
										word === "bukan" || word === "jam",
								})}
							>
								{word}
							</motion.span>
						))}
				</h1>
				<motion.p
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 0.8,
					}}
					className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
				>
					Dengan Wira, balas pesan customer dalam hitungan detik, bukan jam.
					Coba layanan terbaik kami dengan UI yang modern dan teknologi AI untuk
					memaksimalkan layanan mu.
				</motion.p>
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
						delay: 1,
					}}
					className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
				>
					<Unauthenticated>
						<SignInButton
							mode="modal"
							fallbackRedirectUrl={"/sites"}
							signUpFallbackRedirectUrl={"/onboarding/username"}
						>
							<Button
								variant={"secondary"}
								className="w-60 text-center inline-flex items-center gap-4"
							>
								{isLoading && <Loader2 className="animate-spin w-16 h-4" />}
								{!isLoading && !isAuthenticated && (
									<>
										Explore Sekarang
										<SendHorizonal />
									</>
								)}
							</Button>
						</SignInButton>
					</Unauthenticated>

					<Authenticated>
						<Link
							to={"/sites"}
							// className={buttonVariants({ size: "sm" })}
							disabled={isLoading}
						>
							<Button
								variant={"secondary"}
								className="w-60 justify-center text-center inline-flex items-center gap-4"
							>
								{isLoading && <Loader2 className="animate-spin w-16 h-4" />}
								{!isLoading && isAuthenticated && (
									<>
										Manage sites <SendHorizonal />
									</>
								)}
							</Button>
						</Link>
					</Authenticated>
				</motion.div>
				<motion.div
					initial={{
						opacity: 0,
						y: 10,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.3,
						delay: 1.2,
					}}
					className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
						<img
							src="/images/pages-preview.png"
							alt="Landing page preview"
							className="aspect-[16/9] h-auto w-full object-cover "
							height={1000}
							width={1000}
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

const Navbar = () => {
	return (
		<nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
			<div className="flex items-center gap-2">
				<div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
				<h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
			</div>
			<button
				type="button"
				className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200"
			>
				Login
			</button>
		</nav>
	);
};

import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start gap-24 py-32 px-16 bg-white dark:bg-black sm:items-start">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={200}
					height={20}
					priority
				/>
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 className="max-w-lg text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Welcome to the Open Browser Next.js plugin
					</h1>
					<p className="max-w-xs text-lg leading-8 text-zinc-600 dark:text-zinc-400">
						Check out the{" "}
						<a
							href="https://github.com/simoncdn/next-plugin-open-browser"
							className="font-medium text-zinc-950 dark:text-zinc-50"
						>
							Github
						</a>{" "}
						repository or install it from{" "}
						<a
							href="https://www.npmjs.com/package/next-plugin-open-browser"
							className="font-medium text-zinc-950 dark:text-zinc-50"
						>
							npm
						</a>
						.
					</p>
				</div>
			</main >
		</div >
	);
}

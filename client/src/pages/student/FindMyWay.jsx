import React from "react";
import {
	ArrowRight,
	CalendarDays,
	ExternalLink,
	GitBranch,
	MapPinned,
	MoonStar,
	Satellite,
	Sparkles,
	User,
	Users,
	Waypoints,
	BellRing,
} from "lucide-react";
import { FaApple, FaAndroid } from "react-icons/fa";

const APP_STORE_URL = "https://apps.apple.com/us/app/findmyway/id6800996542";
const APK_URL = "https://drive.google.com/drive/folders/1mEe86lWRstyHinOfKlyYgR6DeDCXIDbE?usp=share_link";

const highlights = [
	{
		icon: <MapPinned className="h-5 w-5" />,
		title: "Multi-term search",
		description:
			"Search buildings, labs, rooms, or even campus terms like library and placement across nested location data.",
	},
	{
		icon: <CalendarDays className="h-5 w-5" />,
		title: "Event-linked navigation",
		description:
			"Add academic events to the planner and jump straight to the correct venue from the calendar.",
	},
	{
		icon: <Satellite className="h-5 w-5" />,
		title: "Blueprint and satellite views",
		description:
			"Switch between a high-resolution campus blueprint and a satellite overlay without losing alignment.",
	},
	{
		icon: <Waypoints className="h-5 w-5" />,
		title: "Smart pathfinding",
		description:
			"A graph-based routing engine finds the shortest path from your location to your destination room or lab.",
	},
	{
		icon: <BellRing className="h-5 w-5" />,
		title: "Silent-mode attendance alarms",
		description:
			"Attendance reminders still ring even when the phone is muted, so you do not miss your OTP window.",
	},
	{
		icon: <Users className="h-5 w-5" />,
		title: "Privacy-first friends map",
		description:
			"Location sharing is on demand and only updates while the page is active, helping save battery.",
	},
	{
		icon: <MoonStar className="h-5 w-5" />,
		title: "Graphite OLED dark mode",
		description:
			"A sharp, high-contrast dark theme designed for modern phones and comfortable night use.",
	},
	{
		icon: <GitBranch className="h-5 w-5" />,
		title: "Built for live updates",
		description:
			"Flutter, Firebase, and Appwrite power the app with realtime sync, auth, and location updates.",
	},
];

const installSteps = [
	{
		step: "01",
		title: "Choose your platform",
		description: "For iOS, install directly from the Apple App Store. For Android, download the APK package via Google Drive.",
	},
	{
		step: "02",
		title: "Allow app installs (Android APK only)",
		description:
			"If Android blocks the install, enable installs from this source or allow unknown app installs in your device settings.",
	},
	{
		step: "03",
		title: "Open FindMyWay",
		description: "Launch the app, sign in if required, and start searching for places across campus.",
	},
];

const techStack = [
	{
		name: "Flutter & Dart",
		detail: "Cross-platform UI and fast native-like performance.",
	},
	{
		name: "Cloud Auth & Sync",
		detail: "Authentication and academic calendar data.",
	},
	{
		name: "Appwrite",
		detail: "Realtime location and friends map updates.",
	},
	{
		name: "Custom GPS engine",
		detail: "Precise coordinate-to-image percentage mapping for campus layouts.",
	},
];

function FindMyWay() {
	return (
		<main className="min-h-screen bg-gray-50 dark:bg-black">
			<header className="border-b border-gray-200 bg-white dark:border-blue-900 dark:bg-slate-950">
				<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="mb-4 inline-flex flex-wrap items-center justify-center gap-2">
							<div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
								<Sparkles className="h-4 w-4" />
								Available on iOS (App Store) & Android (APK)
							</div>
							<div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/60 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
								<User className="h-3.5 w-3.5 opacity-70" />
								<span>Sudhir Sivakumar</span>
							</div>
						</div>
						<h1 className="mb-4 text-3xl font-bold text-blue-600 sm:text-4xl">FindMyWay App</h1>
						<p className="mx-auto max-w-2xl text-base text-blue-700 sm:text-lg dark:text-blue-300">
							Download FindMyWay from the App Store on iOS or install the Android APK to locate
							buildings, labs, rooms, and campus venues anywhere in the college.
						</p>
						<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
							<a
								href={APP_STORE_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
							>
								<FaApple className="h-4 w-4" />
								Download on App Store
								<ExternalLink className="h-3.5 w-3.5 opacity-80" />
							</a>
							<a
								href={APK_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600/30 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
							>
								<FaAndroid className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
								Download Android APK
								<ExternalLink className="h-3.5 w-3.5 opacity-80" />
							</a>
							<a
								href="#features"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-900"
							>
								Explore features
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<section id="features" className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-4 text-2xl font-bold text-blue-600">What makes FindMyWay special?</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{highlights.map((feature) => (
							<article key={feature.title} className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-900">
								<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
									{feature.icon}
								</div>
								<h3 className="mb-2 text-lg font-semibold text-blue-600">{feature.title}</h3>
								<p className="text-sm text-blue-700 dark:text-blue-300">{feature.description}</p>
							</article>
						))}
					</div>
				</section>

				<section className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-6 text-2xl font-bold text-blue-600">How to install</h2>
					<div className="space-y-4">
						{installSteps.map((item) => (
							<div key={item.step} className="flex gap-4 rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
								<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
									{item.step}
								</div>
								<div>
									<h3 className="mb-1 font-semibold text-blue-600">{item.title}</h3>
									<p className="text-sm text-blue-700 dark:text-blue-300">{item.description}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-6 text-2xl font-bold text-blue-600">The tech behind it</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{techStack.map((item) => (
							<article key={item.name} className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-blue-900 dark:bg-slate-900">
								<h3 className="mb-2 text-lg font-semibold text-blue-600">{item.name}</h3>
								<p className="text-sm text-blue-700 dark:text-blue-300">{item.detail}</p>
							</article>
						))}
					</div>
					<div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
						FindMyWay is officially available for iOS via the App Store, and for Android devices via direct APK download.
					</div>
				</section>

				<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-2 text-2xl font-bold text-blue-600">Ready to get started?</h2>
					<p className="mb-6 text-blue-700 dark:text-blue-300">
						Install FindMyWay on iOS directly from the App Store or download the Android APK to start navigating around campus.
					</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
						<a
							href={APP_STORE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
						>
							<FaApple className="h-4 w-4" />
							Download on App Store
							<ExternalLink className="h-3.5 w-3.5 opacity-80" />
						</a>
						<a
							href={APK_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600/30 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
						>
							<FaAndroid className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
							Download Android APK
							<ExternalLink className="h-3.5 w-3.5 opacity-80" />
						</a>
					</div>
				</section>
			</div>
		</main>
	);
}

export default FindMyWay;


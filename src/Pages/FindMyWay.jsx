import React from "react";
import {
	ArrowRight,
	CalendarDays,
	Download,
	ExternalLink,
	GitBranch,
	Layers3,
	LocateFixed,
	MapPinned,
	MoonStar,
	Route,
	Satellite,
	ShieldCheck,
	Smartphone,
	Sparkles,
	Clock3,
	Users,
	Waypoints,
	BellRing,
} from "lucide-react";

const APK_URL = "https://drive.google.com/file/d/1Q7iGNlFpbqWk2GmIDUmvBkI9aSquzBez/view";

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
		title: "Download the APK",
		description: "Tap the button below to open the Google Drive download link for the Android app.",
	},
	{
		step: "02",
		title: "Allow app installs",
		description:
			"If Android blocks the install, enable installs from this source in your device security settings.",
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
		name: "Firebase",
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
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
							<Sparkles className="h-4 w-4" />
							Android available now, iOS coming soon
						</div>
						<h1 className="mb-4 text-3xl font-bold text-blue-600 sm:text-4xl">FindMyWay installation</h1>
						<p className="mx-auto max-w-2xl text-base text-blue-700 sm:text-lg dark:text-blue-300">
							Download the Android APK and use FindMyWay to locate buildings, labs, rooms, and campus
							venues anywhere in the college.
						</p>
						<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
							<a
								href={APK_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
							>
								<Download className="h-4 w-4" />
								Download APK
								<ExternalLink className="h-4 w-4" />
							</a>
							<a href="#features" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-900">
								Explore features
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<section className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-4 text-2xl font-bold text-blue-600">What makes FindMyWay special?</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{[
							{
								icon: <MapPinned className="h-6 w-6" />,
								title: "Multi-term search",
								description:
									"Search buildings, labs, rooms, or campus terms like library and placement across nested location data.",
							},
							{
								icon: <CalendarDays className="h-6 w-6" />,
								title: "Event-linked navigation",
								description:
									"Connect events to venues so one tap takes you straight to the right room.",
							},
							{
								icon: <Satellite className="h-6 w-6" />,
								title: "Blueprint and satellite views",
								description:
									"Switch between a campus blueprint and a satellite overlay while keeping coordinates aligned.",
							},
							{
								icon: <Waypoints className="h-6 w-6" />,
								title: "Smart pathfinding",
								description:
									"A graph-based routing engine finds the shortest path to your destination.",
							},
							{
								icon: <BellRing className="h-6 w-6" />,
								title: "Silent-mode attendance alarms",
								description:
									"Get reminders even when your phone is muted so you do not miss attendance OTP time.",
							},
							{
								icon: <Users className="h-6 w-6" />,
								title: "Privacy-first friends map",
								description:
									"Location sharing updates only when you actively view the page to save battery.",
							},
						].map((feature) => (
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
						FindMyWay is currently supported on Android. An iOS release is planned for later.
					</div>
				</section>

				<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-blue-900 dark:bg-slate-950">
					<h2 className="mb-2 text-2xl font-bold text-blue-600">Ready to install?</h2>
					<p className="mb-6 text-blue-700 dark:text-blue-300">
						Open the APK link, allow installs from your browser if prompted, and start using FindMyWay to move around campus.
					</p>
					<a
						href={APK_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
					>
						<Download className="h-4 w-4" />
						Get the APK
					</a>
				</section>
			</div>
		</main>
	);
}

export default FindMyWay;

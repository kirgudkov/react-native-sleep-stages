import React from "react";

const Context = React.createContext<SleepDataContextType | null>(null);

const SleepDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [sleepData, setSleepData] = React.useState<SleepSegment[]>(generateRandomSleepSegments());

	return (
		<Context.Provider
			value={[sleepData, () => {
				setSleepData(generateRandomSleepSegments());
			}]}
		>
			{children}
		</Context.Provider>
	);
};

const useSleepData = (): SleepDataContextType => {
	return React.useContext(Context)!; // It's safe to assume that the context value is never null
};

function generateRandomSleepSegments(): SleepSegment[] {
	const startTime = new Date();
	startTime.setHours(0, Math.floor(Math.random() * 60), 0, 0);

	const totalSleepMinutes = Math.floor(Math.random() * (400 - 250) + 250);

	const sleepStages = Object.keys(SleepStage) as (keyof typeof SleepStage)[];

	const stagePercentages = {
		awake: 3,
		rem: 22,
		core: 50,
		deep: 25,
	};

	// Convert percentages to minutes
	const stageDurations: { [key in keyof typeof SleepStage]: number } = Object.fromEntries(
		Object.entries(stagePercentages).map(([stage, percentage]) => [
			stage,
			Math.round((percentage / 100) * totalSleepMinutes),
		]),
	) as { [key in keyof typeof SleepStage]: number };

	// Generate sleep segments based on stage durations
	let remainingMinutes = totalSleepMinutes;
	let segmentId = 0;
	let currentTime = new Date(startTime);
	const sleepSegments: SleepSegment[] = [];

	while (remainingMinutes > 0) {
		const possibleStages = sleepStages.filter(
			(stage) => stageDurations[stage] > 0,
		);

		if (possibleStages.length == 0) {
			break;
		}

		// Randomly select a sleep stage
		const stage =
			possibleStages[Math.floor(Math.random() * possibleStages.length)];

		// Determine segment duration
		const maxDuration = Math.min(
			stageDurations[stage],
			remainingMinutes,
			stage == "awake" ? 2 : 45,
		);

		const minDuration = stage == "awake" ? 2 : 5;

		// Ensure maxDuration is at least minDuration to avoid negative ranges
		if (maxDuration < minDuration) {
			stageDurations[stage] = 0;
			continue;
		}

		const duration = Math.floor(
			Math.random() * (maxDuration - minDuration + 1) + minDuration,
		);

		// Create sleep segment
		const segment: SleepSegment = {
			id: segmentId++,
			type: stage,
			from: new Date(currentTime),
			to: new Date(currentTime.getTime() + duration * 60000),
		};
		sleepSegments.push(segment);

		// Update counters
		currentTime = segment.to;
		remainingMinutes -= duration;
		stageDurations[stage] -= duration;
	}

	// Sort segments by start time
	sleepSegments.sort((a, b) => a.from.getTime() - b.from.getTime());

	return sleepSegments;
}

const SleepStage = {
	awake: {
		position: 0,
		label: "Awake",
		color: "#FE8A73FF",
	},
	rem: {
		position: 1,
		label: "REM",
		color: "#3FB1E7FF",
	},
	core: {
		position: 2,
		label: "Core",
		color: "#1B81FEFF",
	},
	deep: {
		position: 3,
		label: "Deep",
		color: "#403EA7FF",
	},
};

type SleepSegment = {
	id: number;
	type: keyof typeof SleepStage;
	from: Date;
	to: Date;
};

type SleepDataContextType = [SleepSegment[], () => void];

export {
	SleepStage,
	SleepDataProvider,
	useSleepData,
};

export type {
	SleepSegment,
};

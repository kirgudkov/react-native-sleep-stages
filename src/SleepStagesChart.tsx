import React from "react";
import { useSharedValue, interpolate } from "react-native-reanimated";

import { CHART_WIDTH_PX, BORDER_WIDTH_PX } from "./theme.ts";
import { Cursor } from "./Cursor.tsx";
import { Bars } from "./Bars.tsx";
import { Header } from "./Header.tsx";
import { Axis } from "./Axis.tsx";
import { PanGestureHandler } from "./PanGestureHandler.tsx";
import { Underlay } from "./Underlay.tsx";
import { useSleepData } from "./SleepDataContext.tsx";

const SleepStagesChart = () => {

	const [sleepData, generateNew] = useSleepData();
	const cursorRef = React.useRef<Cursor>(null);

	const opacity = useSharedValue(0);
	const panX = useSharedValue(0);

	if (sleepData.length === 0) {
		return null;
	}

	const startHours = sleepData[0].from.getHours();
	const endHours = sleepData[sleepData.length - 1].to.getHours();
	// Total minutes count that fit into the canvas: 1 column = 1 hour
	const chartWidthMinutes = (endHours - startHours + 1) * 60;

	// leftmost and rightmost coordinates of the first and last segments in minutes
	const leftmostSegmentMinutes = startHours * 60 + sleepData[0].from.getMinutes();
	const rightmostSegmentMinutes = endHours * 60 + sleepData[sleepData.length - 1].to.getMinutes();

	// Values to restrict the cursor movement from the first to the last segment
	const minPanX = interpolate(leftmostSegmentMinutes, [0, chartWidthMinutes], [0, CHART_WIDTH_PX]) - BORDER_WIDTH_PX;
	const maxPanX = interpolate(rightmostSegmentMinutes, [0, chartWidthMinutes], [0, CHART_WIDTH_PX]) - BORDER_WIDTH_PX;

	const seekSegment = (x: number) => {
		// Map x position back to minutes
		const minutes = interpolate(x, [0, CHART_WIDTH_PX], [0, chartWidthMinutes]) + BORDER_WIDTH_PX;

		// Find the segment that contains the corresponding time
		const date = new Date(sleepData[0].from);
		date.setHours(Math.floor(minutes / 60));
		date.setMinutes(minutes % 60);

		const segment = sleepData.find(
				item => date >= item.from && date <= item.to,
			)
			// Fallback to the first or last segment if x is outside the bounds
			?? (minutes <= leftmostSegmentMinutes ? sleepData[0] : sleepData[sleepData.length - 1]);

		cursorRef.current?.setData({
			segment: segment,
			durationMin: Math.floor((segment.to.getTime() - segment.from.getTime()) / 1000 / 60),
		});
	};

	return (
		<>
			<Header
				opacity={opacity}
				onRefreshPress={generateNew}
				startDate={sleepData[0].from}
				endDate={sleepData[sleepData.length - 1].to}
			/>

			<PanGestureHandler
				panX={panX}
				onPan={seekSegment}
				opacity={opacity}
			>
				<Axis
					startHours={startHours}
					endHours={endHours}
				/>
				<Underlay
					totalMinutes={chartWidthMinutes}
				/>
				<Bars
					totalMinutes={chartWidthMinutes}
				/>
				<Cursor
					ref={cursorRef}
					minPanX={minPanX}
					maxPanX={maxPanX}
					panX={panX}
					opacity={opacity}
				/>
			</PanGestureHandler>
		</>
	);
};

export {
	SleepStagesChart,
};

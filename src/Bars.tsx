import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate } from "react-native-reanimated";

import { CHART_WIDTH_PX, BORDER_WIDTH_PX, ROW_HEIGHT_PX, BAR_TOP_OFFSET_PX, Transition, BAR_HEIGHT_PX } from "./theme.ts";
import { useSleepData, SleepStage } from "./SleepDataContext.tsx";

const Bars: React.FC<Props> = (props) => {
	const [sleepData] = useSleepData();

	return sleepData.map((segment, index) => {
		const fromMinutes = segment.from.getHours() * 60 + segment.from.getMinutes();
		const toMinutes = segment.to.getHours() * 60 + segment.to.getMinutes();

		const top = SleepStage[segment.type].position * ROW_HEIGHT_PX + BAR_TOP_OFFSET_PX + BORDER_WIDTH_PX;
		const left = interpolate(fromMinutes, [0, props.totalMinutes], [0, CHART_WIDTH_PX]);
		const width = interpolate(toMinutes - fromMinutes, [0, props.totalMinutes], [0, CHART_WIDTH_PX]) - BORDER_WIDTH_PX;

		return (
			<Animated.View
				key={index}
				layout={Transition}
				style={{
					position: "absolute",
					top: top, left: left, width: width,
				}}
			>
				{/* Nested View is a workaround to fix Reanimated bug that breaks borderRadius on layout animation */}
				<View style={[styles.bar, { backgroundColor: SleepStage[segment.type].color }]} />
			</Animated.View>
		);
	}) as unknown as React.JSX.Element;
};

const styles = StyleSheet.create({
	bar: {
		minWidth: 1,
		height: BAR_HEIGHT_PX - BORDER_WIDTH_PX * 2,
		borderRadius: 6,
	},
});

type Props = {
	totalMinutes: number;
};

export {
	Bars,
};

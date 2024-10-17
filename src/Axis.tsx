import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { CHART_WIDTH_PX, ROW_HEIGHT_PX, Transition, LINE_SIZE_PX, theme } from "./theme.ts";
import { SleepStage } from "./SleepDataContext.tsx";
import { DashedLine } from "./DashedLine.tsx";

const Axis: React.FC<Props> = ({ endHours, startHours }) => {
	const cols = Array.from({ length: endHours - startHours + 1 }, (_, index) =>
		`${(index + startHours).toString().padStart(2, "0")}:00`,
	);

	const colWidth = CHART_WIDTH_PX / cols.length;

	return (
		<>
			{
				Object.values(SleepStage).map((stage, index) => (
					<Animated.View
						key={index}
						layout={Transition}
						style={{ height: ROW_HEIGHT_PX }}
					>
						{
							// Skip the first row to avoid a horizontal line at the top
							!!index && <View style={styles.horizontal} />
						}
						<Text style={styles.label}>
							{stage.label}
						</Text>
					</Animated.View>
				))
			}
			{
				cols.map((hour, index) => (
					<Animated.View
						key={index}
						layout={Transition}
						style={[styles.col, { width: colWidth, left: colWidth * index }]}
					>
						<Text style={styles.label}>
							{hour}
						</Text>
						{
							// Skip the last column to avoid rendering a vertical line on top of the container's right border
							index != cols.length - 1 && <DashedLine />
						}
					</Animated.View>
				))
			}
		</>
	);
};

const styles = StyleSheet.create({
	horizontal: {
		width: "100%",
		height: LINE_SIZE_PX,
		backgroundColor: theme.colors.background.tertiary,
	},
	col: {
		bottom: 0,
		height: "100%",
		position: "absolute",
		flexDirection: "row",
		alignItems: "flex-end",
	},
	label: {
		fontSize: 10,
		left: 4, top: 4,
		color: theme.colors.text.tertiary,
	},
});

type Props = {
	startHours: number;
	endHours: number;
};

export {
	Axis,
};

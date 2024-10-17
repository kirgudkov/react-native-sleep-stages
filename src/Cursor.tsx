import React from "react";
import { Text, type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolation, type SharedValue, useSharedValue } from "react-native-reanimated";

import { CHART_WIDTH_PX, theme, CHART_HEIGHT_PX } from "./theme.ts";
import { SleepStage, type SleepSegment } from "./SleepDataContext.tsx";

const Cursor = React.forwardRef<Cursor, Props>(({ panX, opacity, minPanX, maxPanX }, ref) => {

	const [data, setData] = React.useState<CursorData>();
	const cardLayout = useSharedValue({ width: 0, height: 0 });

	const onCardLayout = (event: LayoutChangeEvent) => {
		cardLayout.value = event.nativeEvent.layout;
	};

	const barAnimation = useAnimatedStyle(() => ({
		transform: [{ translateX: interpolate(panX.value, [minPanX, maxPanX], [minPanX, maxPanX], Extrapolation.CLAMP) }],
		opacity: opacity.value,
	}), [minPanX, maxPanX]);

	const cardAnimation = useAnimatedStyle(() => ({
		transform: [{
			translateX: interpolate(panX.value - (cardLayout.value.width / 2), [0, CHART_WIDTH_PX - cardLayout.value.width], [0, CHART_WIDTH_PX - cardLayout.value.width], Extrapolation.CLAMP),
		}],
		opacity: opacity.value,
		top: -cardLayout.value.height,
	}), []);

	React.useImperativeHandle(ref, () => ({
		setData: newData => {
			if (newData.segment.id != data?.segment.id) {
				setData(newData);
			}
		},
	}), [data]);

	if (!data) {
		return null;
	}

	let label = `${SleepStage[data.segment.type].label} sleep`.toUpperCase();

	if (data.segment.type == "awake") {
		label = "Awake".toUpperCase();
	}

	const dateFormatted = "Today, "
		+ new Date(data.segment.from).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		+ " - "
		+ new Date(data.segment.to).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

	return (
		<>
			<Animated.View
				pointerEvents={"none"}
				onLayout={onCardLayout}
				style={[styles.card, cardAnimation]}
			>
				<Text style={styles.regular}>
					{label}
				</Text>
				<Text style={styles.regular}>
					<Text style={styles.prominent}>
						{data.durationMin}
					</Text>
					{" min"}
				</Text>
				<Text style={styles.regular}>
					{dateFormatted}
				</Text>
			</Animated.View>

			<Animated.View
				style={[styles.bar, barAnimation]}
			/>
		</>
	);
});

const styles = StyleSheet.create({
	card: {
		position: "absolute",
		padding: 10,
		alignSelf: "baseline",
		backgroundColor: theme.colors.background.secondary,
		borderRadius: 12,
		borderCurve: "continuous",
	},
	regular: {
		fontSize: 12,
		color: theme.colors.text.secondary,
	},
	prominent: {
		fontSize: 24,
		fontWeight: "500",
		color: theme.colors.text.primary,
	},
	bar: {
		width: 2.5,
		height: CHART_HEIGHT_PX,
		position: "absolute",
		backgroundColor: theme.colors.background.secondary,
	},
});

type Cursor = {
	setData: (data: CursorData) => void,
};

type CursorData = {
	segment: SleepSegment,
	durationMin: number,
}

type Props = {
	panX: SharedValue<number>,
	opacity: SharedValue<number>,
	minPanX: number,
	maxPanX: number,
};

export {
	Cursor,
};

export type {
	CursorData,
};

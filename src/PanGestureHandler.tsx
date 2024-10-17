import React from "react";
import { StyleSheet, View } from "react-native";
import { withTiming, runOnJS, withSpring, type SharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { CHART_WIDTH_PX, CHART_HEIGHT_PX, LINE_SIZE_PX, theme } from "./theme.ts";

const PanGestureHandler: React.FC<Props> = ({ onPan, panX, opacity, children }) => {

	const gesture = Gesture.Pan()
		.onBegin((event) => {
			panX.value = event.x;
			opacity.value = withTiming(1);
			runOnJS(onPan)(event.x);
		})
		.onChange((event) => {
			runOnJS(onPan)(event.x);

			panX.value = withSpring(event.x, {
				mass: 0.5,
				damping: 18,
				stiffness: 300,
			});
		})
		.onTouchesUp(() => {
			opacity.value = withTiming(0);
		})
		.onEnd(() => {
			opacity.value = withTiming(0);
		});

	return (
		<GestureDetector gesture={gesture}>
			<View style={[styles.container, { width: CHART_WIDTH_PX, height: CHART_HEIGHT_PX }]}>
				{children}
			</View>
		</GestureDetector>
	);
};

const styles = StyleSheet.create({
	container: {
		alignSelf: "center",
		borderLeftWidth: LINE_SIZE_PX,
		borderRightWidth: LINE_SIZE_PX,
		borderColor: theme.colors.background.tertiary,
	},
});

type Props = React.PropsWithChildren & {
	opacity: SharedValue<number>;
	panX: SharedValue<number>;
	onPan: (x: number) => void;
};

export {
	PanGestureHandler,
};

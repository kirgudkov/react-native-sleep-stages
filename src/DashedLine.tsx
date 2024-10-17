import React from "react";
import { View, StyleSheet } from "react-native";
import { CHART_HEIGHT_PX, LINE_SIZE_PX, theme } from "./theme.ts";

const DashedLine = () => (
	<View style={styles.container}>
		{
			Array.from({ length: CHART_HEIGHT_PX / 2 / DASH_SIZE }).map((_, i) => (
				<View key={i} style={[styles.dash, { height: DASH_SIZE, marginTop: DASH_SIZE }]} />
			))
		}
	</View>
);

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: LINE_SIZE_PX,
		position: "absolute",
		right: 0,
	},
	dash: {
		width: 1,
		marginLeft: 0,
		backgroundColor: theme.colors.background.tertiary,
	},
});

const DASH_SIZE = 3;

export {
	DashedLine,
};

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SleepStagesChart } from "./SleepStagesChart.tsx";
import { SleepDataProvider } from "./SleepDataContext.tsx";
import { theme } from "./theme.ts";

export default () => (
	<GestureHandlerRootView>
		<SleepDataProvider>
			<SafeAreaView style={styles.root}>
				<SleepStagesChart />
			</SafeAreaView>
		</SleepDataProvider>
	</GestureHandlerRootView>
);

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: theme.colors.background.primary,
	},
});

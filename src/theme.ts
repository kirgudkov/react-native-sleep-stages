import { StyleSheet, Dimensions, DynamicColorIOS, Platform } from "react-native";
import { LinearTransition } from "react-native-reanimated";
import { SleepStage } from "./SleepDataContext.tsx";

const margin = 16;

const WINDOW_WIDTH_PX = Dimensions.get("window").width;
const CHART_HEIGHT_PX = 260;
const CHART_WIDTH_PX = WINDOW_WIDTH_PX - margin * 2;
const BAR_HEIGHT_PX = (CHART_HEIGHT_PX / Object.keys(SleepStage).length) * 0.45; // 40% of the row height
const BAR_TOP_OFFSET_PX = BAR_HEIGHT_PX * 0.8; // Offset from the row top boundary: 90% of the bar height
const BORDER_WIDTH_PX = 2; // Width of the bar borders and connecting lines
const LINE_SIZE_PX = 1 - StyleSheet.hairlineWidth; // Width of the grid lines
const ROW_HEIGHT_PX = (CHART_HEIGHT_PX - margin) / Object.keys(SleepStage).length;

const theme = {
	colors: {
		background: {
			primary: Platform.OS === "android" ? "#ffffff" : DynamicColorIOS({
				light: "#ffffff",
				dark: "#000000",
			}),
			secondary: Platform.OS === "android" ? "#efefef" : DynamicColorIOS({
				light: "#efefef",
				dark: "#222222",
			}),
			tertiary: Platform.OS === "android" ? "#e4e4e4" : DynamicColorIOS({
				light: "#e4e4e4",
				dark: "#404040",
			}),
		},
		text: {
			primary: Platform.OS === "android" ? "#272727" : DynamicColorIOS({
				light: "#272727",
				dark: "#f0f0f0",
			}),
			secondary: Platform.OS === "android" ? "#595959" : DynamicColorIOS({
				light: "#595959",
				dark: "#b8b8b8",
			}),
			tertiary: Platform.OS === "android" ? "#b8b8b8" : DynamicColorIOS({
				light: "#b8b8b8",
				dark: "#595959",
			}),
		},
	},
};

const Transition = LinearTransition.springify()
	.mass(1.5)
	.damping(30)
	.stiffness(300);

export {
	theme,
	Transition,
	WINDOW_WIDTH_PX,
	CHART_HEIGHT_PX,
	CHART_WIDTH_PX,
	BAR_HEIGHT_PX,
	BAR_TOP_OFFSET_PX,
	BORDER_WIDTH_PX,
	LINE_SIZE_PX,
	ROW_HEIGHT_PX,
};

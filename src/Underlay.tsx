import React from "react";
import { View, StyleSheet } from "react-native";

import Svg, { Path } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { interpolate } from "react-native-reanimated";

import { useSleepData, SleepStage } from "./SleepDataContext.tsx";
import { ROW_HEIGHT_PX, BAR_TOP_OFFSET_PX, CHART_WIDTH_PX, BORDER_WIDTH_PX, BAR_HEIGHT_PX, Transition } from "./theme.ts";
import { Gradient } from "./Gradient.tsx";

const Underlay: React.FC<Props> = ({ totalMinutes }) => {
	const [sleepData] = useSleepData();

	const underlay = sleepData.map((item, index) => {
		const fromMinutes = item.from.getHours() * 60 + item.from.getMinutes();
		const toMinutes = new Date(item.to).getHours() * 60 + new Date(item.to).getMinutes();

		const topOffset = SleepStage[item.type].position * ROW_HEIGHT_PX + BAR_TOP_OFFSET_PX;
		const leftOffset = interpolate(fromMinutes, [0, totalMinutes], [0, CHART_WIDTH_PX]) - BORDER_WIDTH_PX;
		const barWidth = interpolate(toMinutes - fromMinutes, [0, totalMinutes], [0, CHART_WIDTH_PX]) + BORDER_WIDTH_PX;

		const leftLinkHeight = index > 0
			? (ROW_HEIGHT_PX - BAR_HEIGHT_PX) * Math.abs(SleepStage[item.type].position - SleepStage[sleepData[index - 1].type].position)
			: 0;

		const rightLinkHeight = index < sleepData.length - 1
			? (ROW_HEIGHT_PX - BAR_HEIGHT_PX) * Math.abs(SleepStage[item.type].position - (SleepStage[sleepData[index + 1]?.type].position ?? 0))
			: 0;

		return (
			<React.Fragment key={item.id}>

				{/* Bubble that wraps around the bar */}
				<Animated.View
					layout={Transition}
					style={{ top: topOffset, left: leftOffset, width: barWidth, position: "absolute" }}
				>
					{/* Nested View is a workaround to fix Reanimated bug that breaks borderRadius on layout animation */}
					<View style={styles.bubble} />
				</Animated.View>

				{
					// Left connection line + corner: rendered if the previous item is of a different type and the current item is not the first one
					index != 0 && sleepData[index - 1].type != item.type && (
						<>
							<Animated.View
								layout={Transition}
								style={[styles.line, {
									left: leftOffset,
									height: leftLinkHeight,
									// Adjust top offset based on the previous item's position (higher or lower than the current item)
									top: SleepStage[sleepData[index - 1]?.type].position > SleepStage[item.type].position
										? topOffset + BAR_HEIGHT_PX / 2
										: topOffset - leftLinkHeight + BAR_HEIGHT_PX / 2,
								},
								]}
							/>
							<Animated.View
								layout={Transition}
								style={{
									position: "absolute",
									transform: [{ rotate: "180deg" }],
									// Bunch of magic numbers to adjust the corner position, because I drew SVG on my own and it's far from perfect
									left: leftOffset + 1.3,
									opacity: barWidth > 8 ? 1 : 0,
									top: topOffset - 7.2 + (SleepStage[sleepData[index - 1]?.type].position > SleepStage[item.type].position ? BAR_HEIGHT_PX - 1 : 1),
								}}
							>
								<CornerSVG />
							</Animated.View>
						</>
					)
				}
				{
					// Right connection line + corner: rendered if the next item is of a different type and the current item is not the last one
					index != sleepData.length - 1 && sleepData[index + 1].type != item.type && (
						<>
							<Animated.View
								layout={Transition}
								style={[styles.line, {
									left: leftOffset + barWidth - BORDER_WIDTH_PX,
									height: rightLinkHeight,
									// Adjust top offset based on the next item's position (higher or lower than the current item)
									top: SleepStage[sleepData[index + 1]?.type].position > SleepStage[item.type].position
										? topOffset + BAR_HEIGHT_PX / 2
										: topOffset - rightLinkHeight + BAR_HEIGHT_PX / 2,
								},
								]}
							/>
							<Animated.View
								layout={Transition}
								style={{
									position: "absolute",
									// Bunch of magic numbers to adjust the corner position, because I drew SVG on my own and it's far from perfect
									left: leftOffset + barWidth - 7.3,
									opacity: barWidth > 8 ? 1 : 0,
									top: topOffset - 7.2 + (SleepStage[sleepData[index + 1]?.type].position > SleepStage[item.type].position ? BAR_HEIGHT_PX - 1 : 1),
								}}
							>
								<CornerSVG />
							</Animated.View>
						</>
					)
				}
			</React.Fragment>
		);
	});

	return (
		<MaskedView
			style={styles.maskedView}
			maskElement={
				<>{underlay}</>
			}
		>
			<Gradient />
		</MaskedView>
	);
};

const CornerSVG = () => (
	<Svg width={6} height={15}>
		<Path d={RoundCornerSVGPathTp} />
		<Path d={RoundCornerSVGPathBt} />
	</Svg>
);

const styles = StyleSheet.create({
	line: {
		width: BORDER_WIDTH_PX,
		position: "absolute",
		backgroundColor: "black",
	},
	bubble: {
		minWidth: 4,
		height: BAR_HEIGHT_PX,
		backgroundColor: "black",
		borderCurve: "continuous",
		borderRadius: 8,
	},
	maskedView: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	gradient: {
		flex: 1,
		marginVertical: BAR_HEIGHT_PX / 2,
	},
});

const RoundCornerSVGPathTp = "M6 7V15H5C5 15 5.30874 11.8133 4.02284 10.107C2.73695 8.40073 0 8 0 8V7H6Z";
const RoundCornerSVGPathBt = "M6 8V0H5C5 0 5.28401 3.15824 4 5C2.71599 6.84176 0 7 0 7V8H6Z";

type Props = {
	totalMinutes: number;
};

export {
	Underlay,
};

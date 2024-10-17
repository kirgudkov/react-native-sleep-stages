import React from "react";
import { Text, TouchableOpacity, Image, View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import { theme } from "./theme.ts";
import { AnimatedNums } from "./AnimatedNums.tsx";

const Header: React.FC<Props> = ({ opacity, startDate, endDate, onRefreshPress }) => {

	const mins = (endDate.getTime() - startDate.getTime()) / 1000 / 60;
	const hours = Math.floor(mins / 60);
	const minsFormatted = (mins % 60).toString().padStart(2, "0");
	const dateFormatted = startDate.toLocaleDateString([], dateOptions);

	const opacityAnimation = useAnimatedStyle(() => ({
		opacity: 1 - opacity.value,
	}), []);

	return (
		<Animated.View style={[styles.container, opacityAnimation]}>
			<Animated.View style={styles.infoContainer}>
				<Text style={styles.regular}>
					TIME ASLEEP
				</Text>
				<View style={styles.timeContainer}>
					<AnimatedNums
						nums={hours}
						textStyle={styles.prominent}
					/>
					<Text style={styles.regular}>
						{" hr "}
					</Text>
					<AnimatedNums
						nums={minsFormatted}
						textStyle={styles.prominent}
					/>
					<Text style={styles.regular}>
						{" min"}
					</Text>
				</View>
				<Text style={styles.regular}>
					{dateFormatted}
				</Text>
			</Animated.View>

			<TouchableOpacity
				onPress={onRefreshPress}
				style={styles.refreshButton}
			>
				<Image
					style={styles.refreshIcon}
					source={require("./refresh.png")}
				/>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	timeContainer: {
		marginVertical: 4,
		flexDirection: "row",
		alignItems: "flex-end",
	},
	infoContainer: {
		margin: 16,
		flex: 1,
	},
	regular: {
		fontSize: 14,
		color: theme.colors.text.tertiary,
	},
	prominent: {
		fontSize: 24,
		fontWeight: "500",
		color: theme.colors.text.primary,
	},
	refreshButton: {
		padding: 16,
	},
	refreshIcon: {
		width: 24,
		height: 24,
	},
});

const dateOptions = {
	month: "short",
	day: "numeric",
	year: "numeric",
} as const;

type Props = {
	opacity: SharedValue<number>;
	startDate: Date;
	endDate: Date;
	onRefreshPress: () => void;
};

export {
	Header,
};

import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Text, View, type StyleProp, type TextStyle, StyleSheet } from "react-native";

const AnimatedNums: React.FC<AnimatedNumsProps> = (props) => {
	const nums = props.nums.toString()
		.split("")
		.map(Number);

	return (
		<View
			style={[styles.container, {
				height: DIGIT_HEIGHT,
				width: DIGIT_WIDTH * nums.length,
			}]}
		>
			{
				nums.map((num, index) => (
					<NumsCol
						textStyle={props.textStyle}
						num={num} key={index} index={index}
					/>
				))
			}
		</View>
	);
};

const NumsCol: React.FC<AnimatedNumProps> = (props) => {
	const progress = useSharedValue(props.num);

	const animation = useAnimatedStyle(() => ({
		transform: [
			{ translateY: -progress.value * DIGIT_HEIGHT },
		],
	}), []);

	useEffect(() => {
		const delta = Math.abs(props.num - progress.value);
		const duration = Math.min(600, delta * 300);

		progress.value = withSpring(props.num, { duration });
	}, [props.num]);

	return (
		<Animated.View
			style={[styles.num, animation, {
				left: props.index * DIGIT_WIDTH,
			}]}
		>
			{
				Array.from({ length: 10 }, (_, i) => (
					<Text key={i} style={[props.textStyle, { height: DIGIT_HEIGHT }]}>
						{i}
					</Text>
				))
			}
		</Animated.View>
	);
};

// TODO: calculate these values based on the font size?
const DIGIT_WIDTH = 16;
const DIGIT_HEIGHT = 26;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		overflow: "hidden",
	},
	num: {
		top: -4, // TODO: does it depend on lineHeight?
		position: "absolute",
	},
});

type AnimatedNumsProps = {
	nums: number | string;
	textStyle?: StyleProp<TextStyle>;
};

type AnimatedNumProps = {
	num: number;
	index: number;
	textStyle?: StyleProp<TextStyle>;
};

export {
	AnimatedNums,
};

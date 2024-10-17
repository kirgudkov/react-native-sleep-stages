import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

import { CHART_HEIGHT_PX, CHART_WIDTH_PX } from "./theme.ts";
import { SleepStage } from "./SleepDataContext.tsx";

const Component = () => (
	<Svg
		width={CHART_WIDTH_PX}
		height={CHART_HEIGHT_PX}
	>
		<Defs>
			<LinearGradient
				x1={0} y1={0.2}
				x2={0} y2={0.95}
				id={"grad"}
			>
				{
					Object.values(SleepStage).map(stage => (
						<Stop
							key={stage.label}
							offset={stage.position / Object.keys(SleepStage).length}
							stopColor={stage.color}
							stopOpacity={"0.3"}
						/>
					))
				}
			</LinearGradient>
		</Defs>

		<Rect
			x={0} y={0}
			fill={"url(#grad)"}
			width={CHART_WIDTH_PX}
			height={CHART_HEIGHT_PX}
		/>
	</Svg>
);

export const Gradient = React.memo(Component);

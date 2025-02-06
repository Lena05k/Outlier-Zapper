import React from "react";

const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.zScore) return null;

    return payload.zScore >= 2 ? (
        <circle cx={cx} cy={cy} r={5} fill="red" stroke="red" strokeWidth={1} />
    ) : (
        <circle
            cx={cx}
            cy={cy}
            r={3}
            fill="#8884d8"
            stroke="#8884d8"
            strokeWidth={1}
        />
    );
};

export default CustomizedDot;

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Line,
    LineChart,
    Area,
    AreaChart,
} from "recharts";
import { processData } from "./DataProcessor";
import CustomizedDot from "./CustomDot";
import { rawHeights } from "./heights";

export default function Histogram() {
    const [data, setData] = useState({
        histogramData: [],
        bellCurveData: [],
        zScoreData: [],
        zScoreDataOutside: [],
    });

    useEffect(() => {
        setData(processData(rawHeights));
    }, []);

    const thresholdIndex = data.zScoreData.findIndex((d) => d.zScore >= 2);
    const offset =
        thresholdIndex === -1
            ? 1
            : (thresholdIndex / data.zScoreData.length).toFixed(2);

    return (
        <div>
            <h2 style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
                Гистограмма и кривая нормального распределения
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data.histogramData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="x"
                        label={{
                            value: "Рост (дюймы)",
                            position: "insideBottom",
                            offset: -5,
                        }}
                        tickFormatter={(value) => parseFloat(value.toFixed(1))}
                    />
                    <YAxis
                        label={{
                            value: "Количество",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={400}>
                <h2 style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
                    Кривая нормального распределения
                </h2>
                <LineChart data={data.bellCurveData} width={800} height={400}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="stdMultiplier"
                        label={{
                            value: "Стандартное отклонение",
                            position: "insideBottom",
                            offset: -5,
                        }}
                        tickFormatter={(tick) => `${tick}σ`}
                        domain={[-3, 3]}
                        ticks={[-3, -2, -1, 0, 1, 2, 3]}
                    />
                    <YAxis
                        label={{ value: "Плотность", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="density" stroke="#ff7300" />
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer
                style={{ marginTop: "70px" }}
                width="100%"
                height={400}
            >
                <h2 style={{ textAlign: "center", margin: "20px 0 20px 0" }}>
                    Площадная диаграмма с разделением по Z-score
                </h2>
                <AreaChart data={data.zScoreData} width={800} height={400}>
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="1" y2="0">
                            <stop offset={offset} stopColor="white" stopOpacity="0" />
                            <stop offset={offset} stopColor="red" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="zScore"
                        label={{
                            value: "Z-оценка",
                            position: "insideBottom",
                            offset: -5,
                        }}
                        domain={[-3, 3]}
                        ticks={[-3, -2, -1, 0, 1, 2, 3]}
                    />
                    <YAxis
                        label={{ value: "Плотность", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="density"
                        stroke="#8884d8"
                        fill="url(#splitColor)"
                        dot={<CustomizedDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

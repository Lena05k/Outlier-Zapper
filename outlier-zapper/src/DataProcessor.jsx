// Функция для вычисления нормального распределения (функция Гаусса)
export function gaussian(x, mean, std) {
    return (
        (1 / (std * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / std, 2))
    );
}

// Удаление выбросов из данных
export function removeOutliers(data) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(
        data.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) / data.length
    );
    const lowerLimit = mean - 3 * std;
    const upperLimit = mean + 3 * std;
    return data.filter((h) => h >= lowerLimit && h <= upperLimit);
}

// Обработка данных для построения графиков
export function processData(rawHeights) {
    const heights = removeOutliers(rawHeights);
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    const bins = 20;
    const binWidth = (max - min) / bins;
    const mean = heights.reduce((a, b) => a + b, 0) / heights.length;
    const std = Math.sqrt(
        heights.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) / heights.length
    );

    // Вычисление z-оценок и данных для кривой нормального распределения
    const zScoreData = Array.from({ length: 7 }, (_, i) => {
        const stdMultiplier = i - 3; // Значения от -3 до 3
        const x = stdMultiplier * std; // Переводим в исходные единицы
        return {
            zScore: stdMultiplier,
            density: gaussian(mean + x, mean, std) * heights.length,
        };
    });

    const zScoreDataOutside = zScoreData.map((d) =>
        d.zScore > 1 ? d : { ...d, density: null }
    );

    // Гистограмма
    let counts = new Array(bins).fill(0);
    heights.forEach((h) => {
        let binIndex = Math.min(Math.floor((h - min) / binWidth), bins - 1);
        counts[binIndex]++;
    });
    const histogramData = counts.map((count, i) => ({
        x: min + i * binWidth,
        count,
    }));

    const bellCurveData = Array.from({ length: 7 }, (_, i) => {
        const stdMultiplier = i - 3;
        const x = stdMultiplier * std;
        return {
            stdMultiplier,
            density: gaussian(mean + x, mean, std) * heights.length,
        };
    });

    return {
        histogramData,
        bellCurveData,
        zScoreData,
        zScoreDataOutside,
    };
}

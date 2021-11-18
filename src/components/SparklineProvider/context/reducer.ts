import { INIT_STATE } from './';
import { types } from './types';
import { TActions, TState } from './typings';
import { getMinOfArrNumber, getMaxOfArrNumber, getMinOfArrChart, getMaxOfArrChart } from './utils';

export const peakMetrics = (state: TState = INIT_STATE, action: TActions): TState => {
    if (action.type === types.SEND_PEAKS) {
        const { id, min, max, metricName } = action.payload;
        const newChart = { id, min, max, metricName };
        if (state.peaks[metricName] === undefined) {
            return {
                peaks: {
                    ...state.peaks,
                    [metricName]: { min, max },
                },
                charts: [...state.charts, newChart],
            };
        } else {
            const peakMetric = state.peaks[metricName];
            const newMin = getMinOfArrNumber([peakMetric.min, min]);
            const newMax = getMaxOfArrNumber([peakMetric.max, max]);
            return {
                peaks:
                    newMin === peakMetric.min && newMax === peakMetric.max
                        ? state.peaks
                        : { ...state.peaks, [metricName]: { min: newMin, max: newMax } },
                charts: [...state.charts, newChart],
            };
        }
    }

    if (action.type === types.DELETE_PEAKS) {
        const { id, metricName } = action.payload;
        const newCharts = [...state.charts];
        const indexChart: number = newCharts.findIndex(chart => chart.id === id);
        newCharts.splice(indexChart, 1);
        const newMin = getMinOfArrChart(newCharts, metricName);
        const newMax = getMaxOfArrChart(newCharts, metricName);

        return {
            peaks:
                state.peaks[metricName].min === newMin && state.peaks[metricName].max === newMax
                    ? state.peaks
                    : { ...state.peaks, [metricName]: { min: newMin, max: newMax } },
            charts: newCharts,
        };
    }

    if (action.type === types.CHANGE_PEAKS) {
        const { id, min, max, metricName } = action.payload;
        const newCharts = [...state.charts];
        const indexChart: number = newCharts.findIndex(chart => chart.id === id);
        newCharts.splice(indexChart, 1, { id, min, max, metricName });
        const newMin = getMinOfArrChart(newCharts, metricName);
        const newMax = getMaxOfArrChart(newCharts, metricName);

        return {
            peaks:
                state.peaks[metricName].min === newMin && state.peaks[metricName].max === newMax
                    ? state.peaks
                    : { ...state.peaks, [metricName]: { min: newMin, max: newMax } },
            charts: newCharts,
        };
    }

    return state;
};

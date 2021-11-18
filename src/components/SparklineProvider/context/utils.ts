import { TChart } from './typings';

export const getMinOfArrNumber = (arr: number[]): number => {
    return Math.min(...arr);
};

export const getMaxOfArrNumber = (arr: number[]): number => {
    return Math.max(...arr);
};

export const getMinOfArrChart = (arr: TChart[], propName: string): number => {
    return Math.min(...arr.filter(chart => chart.metricName === propName).map(chart => chart.min));
};

export const getMaxOfArrChart = (arr: TChart[], propName: string): number => {
    return Math.max(...arr.filter(chart => chart.metricName === propName).map(chart => chart.max));
};

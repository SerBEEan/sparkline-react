import React from 'react';
import * as actions from './actions';

type TInferValue<T> = T extends { [key: string]: infer U } ? U : never;
export type TActions = ReturnType<TInferValue<typeof actions>>;

export type TChart = { metricName: string; id: number; min: number; max: number };
export type TPeaks = { min: number; max: number };
export type TSelectPeaks = TPeaks | undefined;

export type TPeakMetrics = {
    [key: string]: TPeaks;
};

export type TState = {
    peaks: TPeakMetrics;
    charts: TChart[];
};

export type TContext = {
    state: TState;
    dispatch: React.Dispatch<TActions>;
};

export type TSelectorState = {
    dispatch: React.Dispatch<TActions>;
    peaks: TSelectPeaks;
};

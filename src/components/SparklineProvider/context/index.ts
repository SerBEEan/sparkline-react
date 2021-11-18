import { createContext } from 'use-context-selection';
import { TContext, TState } from './typings';
import * as action from './actions';

export const INIT_STATE: TState = { peaks: {}, charts: [] };
export const PeakMetricsContext = createContext<TContext>({
    state: INIT_STATE,
    dispatch: () => undefined,
});

export { peakMetrics as peakMetricsReducer } from './reducer';
export const peakMetricsActions = action;

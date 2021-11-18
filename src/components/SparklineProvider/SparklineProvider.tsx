import React, { useReducer } from 'react';
import { PeakMetricsContext, peakMetricsReducer, INIT_STATE } from './context';

export const SparklineProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(peakMetricsReducer, INIT_STATE);

    return <PeakMetricsContext.Provider value={{ state, dispatch }}>{children}</PeakMetricsContext.Provider>;
};

import { types } from './types';
import { TChart } from './typings';

export const sendPeaks = (props: TChart) =>
    ({
        type: types.SEND_PEAKS,
        payload: props,
    } as const);

type TDeletePeaksProps = { metricName: string; id: number };
export const deletePeaks = (props: TDeletePeaksProps) =>
    ({
        type: types.DELETE_PEAKS,
        payload: props,
    } as const);

export const changePeaks = (props: TChart) =>
    ({
        type: types.CHANGE_PEAKS,
        payload: props,
    } as const);

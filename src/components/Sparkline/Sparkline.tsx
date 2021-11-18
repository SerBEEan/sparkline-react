import React, { useEffect, useState } from 'react';
import { useContextSelection } from 'use-context-selection';
import block from 'bem-cn';
import { uniqueId } from 'lodash';
import { buildChartTheme, AnimatedLineSeries, Tooltip, XYChart, Axis } from '@visx/xychart';
import { RenderTooltipParams } from '@visx/xychart/lib/components/Tooltip';

import { PeakMetricsContext, peakMetricsActions } from '../SparklineProvider/context';
import { TContext, TSelectorState, TSelectPeaks } from '../SparklineProvider/context/typings';
import { getFormattedDate, getFormattedNumber } from '../../utils/formatter';
import { SparklineSyncModes } from '../../utils/enums';
import numeral from 'numeral';

import './Sparkline.scss';

const customTheme = buildChartTheme({
    backgroundColor: '#fff',
    colors: ['#0890F4'],
    gridColor: '#30475e',
    gridColorDark: '#222831',
    svgLabelSmall: { fill: '#30475e' },
    svgLabelBig: { fill: '#30475e' },
    tickLength: 4,
});

type TDatum = { x: number; y: number };
type TGetDomain = (syncMode: SparklineSyncModes, peaks: TSelectPeaks, yLocalMin: number, yLocalMax: number) => [number, number];

interface ISparklineProps {
    name: string;
    categories: number[];
    data: number[];
    width?: number;
    height?: number;
    syncMode?: SparklineSyncModes;
    showTopValue?: boolean;
    showLastValue?: boolean;
}

const b = block('sparkline');
const xAccessor = (d: TDatum) => d.x;
const yAccessor = (d: TDatum) => d.y;

const getDomain: TGetDomain = (syncMode, peaks, yLocalMin, yLocalMax) => {
    if (peaks !== undefined) {
        const { min, max } = peaks;
        if (syncMode === SparklineSyncModes.max_min) {
            return [min > yLocalMin ? yLocalMin : min, max < yLocalMax ? yLocalMax : max];
        }
        if (syncMode === SparklineSyncModes.max) {
            return [yLocalMin, max < yLocalMax ? yLocalMax : max];
        }
        if (syncMode === SparklineSyncModes.min) {
            return [min > yLocalMin ? yLocalMin : min, yLocalMax];
        }
    }

    return [yLocalMin, yLocalMax];
};

const calcPaddingByLength = (value: string): number => {
    if (value.length === 1) {
        return 15;
    }

    if (value.length === 2) {
        return value.length * 12;
    }

    return value.length * 8;
};

const toNumeralFormat = (value: number) => numeral(value).format('0a');

const InnerSparkline: React.FC<ISparklineProps> = props => {
    const { name, categories, data, width, height, syncMode = SparklineSyncModes.off, showTopValue, showLastValue } = props;
    const { peaks, dispatch }: TSelectorState = useContextSelection<TContext>(PeakMetricsContext, (context: TContext) => ({
        dispatch: context.dispatch,
        peaks: context.state.peaks[name],
    }));

    const [id] = useState<number>(Number(uniqueId()));
    const yLocalMin: number = Math.min(...data);
    const yLocalMax: number = Math.max(...data);
    const lineData: TDatum[] = data.map((value: number, index: number) => ({ x: index, y: value }));
    const [chartMin, chartMax] = getDomain(syncMode, peaks, yLocalMin, yLocalMax);
    const lastValue: number = data[data.length - 1];

    useEffect(() => {
        if (syncMode !== SparklineSyncModes.off) {
            dispatch(peakMetricsActions.sendPeaks({ id, metricName: name, min: yLocalMin, max: yLocalMax }));

            return () => {
                dispatch(peakMetricsActions.deletePeaks({ metricName: name, id }));
            };
        }
    }, []);

    useEffect(() => {
        if (syncMode !== SparklineSyncModes.off) {
            dispatch(peakMetricsActions.changePeaks({ id, metricName: name, min: yLocalMin, max: yLocalMax }));
        }
    }, [yLocalMin, yLocalMax]);

    const renderTooltip = ({ tooltipData, colorScale }: RenderTooltipParams<TDatum>) => {
        const point: {
            datum: TDatum;
            index: number;
            key: string;
        } = tooltipData!.datumByKey.sparkline;

        return (
            tooltipData!.nearestDatum!.key && (
                <div className={b('tooltip').toString()}>
                    <div className={b('tooltip-title').toString()}>
                        {getFormattedDate(categories[point.index])}
                    </div>
                    <div className={b('tooltip-content').toString()}>
                        <div className={b('tooltip-label').toString()}>
                            <div
                                className={b('tooltip-marker').toString()}
                                style={{ backgroundColor: colorScale && colorScale(tooltipData!.nearestDatum!.key) }}
                            />
                            {name}
                        </div>
                        {getFormattedNumber(point.datum.y)}
                    </div>
                </div>
            )
        );
    };

    return (
        <XYChart
            margin={{
                top: 10,
                right: showLastValue ? calcPaddingByLength(toNumeralFormat(lastValue)) : 0,
                bottom: 10,
                left: showTopValue ? calcPaddingByLength(toNumeralFormat(chartMax)) : 0,
            }}
            width={width}
            height={height}
            xScale={{
                type: 'linear',
            }}
            yScale={{
                type: 'linear',
                domain: [chartMin, chartMax],
                zero: false,
            }}
            theme={customTheme}
        >
            {showTopValue && <Axis orientation="left" hideAxisLine={true} tickValues={[chartMax]} tickFormat={toNumeralFormat} />}
            {showLastValue && (
                <Axis orientation="right" hideAxisLine={true} hideTicks={true} tickValues={[lastValue]} tickFormat={toNumeralFormat} />
            )}
            <AnimatedLineSeries dataKey="sparkline" data={lineData} xAccessor={xAccessor} yAccessor={yAccessor} />
            <Tooltip<TDatum> showVerticalCrosshair snapTooltipToDatumX renderTooltip={renderTooltip} />
        </XYChart>
    );
};

export const Sparkline = React.memo(InnerSparkline);
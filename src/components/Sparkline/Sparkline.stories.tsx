import React, { useState, useReducer } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Sparkline } from './Sparkline';
import { PeakMetricsContext, peakMetricsReducer, INIT_STATE } from '../SparklineProvider/context';
import { SparklineSyncModes } from '../../utils/enums';

const name: string = 'Ошибки';
const categories: number[] = [
    1627648088000,
    1627648388000,
    1627648688000,
    1627648988000,
    1627649288000,
    1627649588000,
    1627649888000,
    1627650188000,
    1627650488000,
    1627650788000,
    1627651088000,
    1627651388000,
];
const data: number[] = [695396, 867215, 820072, 690322, 581228, 812462, 854535, 521250, 815516, 851173, 862075, 825997];

const data1 = [7, 6, 5, 4, 5, 5, 8, 6, 6, 6];
const data2 = [6, 5, 2, 9, 13, 7, 9, 9, 9, 7];
const data3 = [9, 12, 12, 5, 12, 12, 12, 10, 6, 7];
const data4 = [7, 10, 10, 4, 5, 14, 14, 10, 10, 12];
const data5 = [4, 10, 10, 4, 2, 14, 17, 10, 10, 12];
const data6 = [9, 12, 12, 5, 16, 12, 12, 10, 6, 7];
const data7 = [1867215, ...data];

const dataCharts = [
    { id: 0, name: 'errors', data: data1, syncMode: 'max_min' },
    { id: 1, name: 'errors', data: data2, syncMode: 'max_min' },
    { id: 2, name: 'errors', data: data3, syncMode: 'max_min' },
    { id: 4, name: 'warnings', data: data4, syncMode: 'max_min' },
    { id: 5, name: 'errors', data: data5, syncMode: 'max_min' },
    { id: 6, name: 'warnings', data: data6, syncMode: 'max_min' },
];

const Wrapper: React.FC = () => {
    const [charts, setCharts] = useState<Array<{ id: number; name: string; data: number[]; syncMode: string }>>(dataCharts);
    const [state, dispatch] = useReducer(peakMetricsReducer, INIT_STATE);
    const [countCharts, setCountCharts] = useState<number>(2);

    const pushData = () => {
        setCharts(prev => {
            prev[2] = { ...prev[2], data: [...data3, 20] };

            return [...prev];
        });
    };

    const deleteData = () => {
        setCharts(prev => {
            prev[2] = { ...prev[2], data: data3.filter(peak => peak !== 20) };

            return [...prev];
        });
    };

    return (
        <PeakMetricsContext.Provider value={{ state, dispatch }}>
            <button disabled={countCharts >= charts.length} onClick={() => setCountCharts(prev => prev + 1)}>
                +
            </button>
            <button disabled={countCharts <= 0} onClick={() => setCountCharts(prev => prev - 1)}>
                -
            </button>
            <button onClick={pushData}>добавить к 3-у 20</button>
            <button onClick={deleteData}>удалить у 3-го 20</button>

            <div style={{ display: 'flex', width: '1000px', flexWrap: 'wrap' }}>
                {charts.map(
                    (chart, index) =>
                        countCharts > index && (
                            <div style={{ width: '50%', height: '200px', padding: '15px', boxSizing: 'border-box' }} key={chart.id}>
                                <Sparkline
                                    name={chart.name}
                                    categories={categories}
                                    data={chart.data}
                                    syncMode={chart.syncMode as SparklineSyncModes}
                                />
                            </div>
                        )
                )}
            </div>
        </PeakMetricsContext.Provider>
    );
};

export default {
    title: 'Sparkline',
    component: Sparkline,
} as ComponentMeta<typeof Sparkline>;


export const Default: ComponentStory<typeof Sparkline> = (args) => (
    <Sparkline {...args} />
);
Default.args = {
    name, 
    categories, 
    data, 
    width: 220, 
    height: 84,
};

export const Fluid = () => (
    <div style={{ width: '400px', height: '200px' }}>
         <Sparkline name={name} categories={categories} data={data} />
    </div>
);

export const Sync = () => <Wrapper />;

export const ShowValues = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '25% 25%' }}>
        <Sparkline name={name} categories={categories} data={data1} width={220} height={84} showLastValue showTopValue />
        <Sparkline name={name} categories={categories} data={data2} width={220} height={84} showLastValue showTopValue />
        <Sparkline name={name} categories={categories} data={data4} width={220} height={84} showLastValue showTopValue />
        <Sparkline name={name} categories={categories} data={data} width={220} height={84} showLastValue showTopValue />
        <Sparkline name={name} categories={categories} data={data7} width={220} height={84} showLastValue showTopValue />
    </div>
);

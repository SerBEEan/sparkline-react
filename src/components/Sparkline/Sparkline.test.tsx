import React, { useReducer, useState } from 'react';
import { mount } from 'enzyme';
import { Sparkline } from './Sparkline';
import { INIT_STATE, PeakMetricsContext, peakMetricsReducer } from '../SparklineProvider/context';
import { SparklineSyncModes } from '../../utils/enums';

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

const small = { id: 0, name: 'errors', data: [7, 6, 5, 4, 5, 5, 8, 6, 6, 6], syncMode: SparklineSyncModes.max_min },
    smallMinMode = { id: 4, name: 'errors', data: [7, 6, 5, 4, 5, 5, 8, 6, 6, 6], syncMode: SparklineSyncModes.min },
    smallMaxMode = { id: 5, name: 'errors', data: [7, 6, 5, 4, 5, 5, 8, 6, 6, 6], syncMode: SparklineSyncModes.max },
    smallMin = Math.min(...small.data),
    smallMax = Math.max(...small.data);
const medium = { id: 1, name: 'errors', data: [6, 5, 2, 9, 12, 7, 9, 9, 9, 7], syncMode: SparklineSyncModes.max_min },
    mediumMin = Math.min(...medium.data),
    mediumMax = Math.max(...medium.data);
const large = { id: 2, name: 'errors', data: [6, 5, 1, 9, 30, 7, 9, 9, 9, 7], syncMode: SparklineSyncModes.max_min },
    largeOffMode = { id: 2, name: 'errors', data: [6, 5, 1, 9, 30, 7, 9, 9, 9, 7], syncMode: SparklineSyncModes.off },
    largeMin = Math.min(...large.data),
    largeMax = Math.max(...large.data);
const big = { id: 3, name: 'warning', data: [6, 5, 0, 9, 32, 7, 9, 9, 9, 7], syncMode: SparklineSyncModes.max_min },
    bigModeOff = { id: 3, name: 'error', data: [6, 5, 0, 9, 32, 7, 9, 9, 9, 7], syncMode: SparklineSyncModes.off },
    bigMin = Math.min(...big.data),
    bigMax = Math.max(...big.data);

type TChart = { id: number; name: string; data: number[]; syncMode: SparklineSyncModes };

const Wrapper: React.FC<{ initState: TChart[] }> = ({ initState }) => {
    const [state, dispatch] = useReducer(peakMetricsReducer, INIT_STATE);
    const [charts, setCharts] = useState<TChart[]>(initState);

    const addMedium = () => {
        setCharts(prev => [...prev, { ...medium }]);
    };
    const addBig = () => {
        setCharts(prev => [...prev, { ...big }]);
    };
    const addBigModeOff = () => {
        setCharts(prev => [...prev, { ...bigModeOff }]);
    };

    const deleteLastChart = () => {
        setCharts(prev => prev.slice(0, -1));
    };

    const set25ToSmall = () => {
        setCharts(prev => {
            return [{ ...prev[0], data: [...prev[0].data, 25] }, { ...prev[1] }];
        });
    };

    return (
        <PeakMetricsContext.Provider value={{ state, dispatch }}>
            <button id="addMedium" onClick={addMedium}>
                addMedium
            </button>
            <button id="addBig" onClick={addBig}>
                addBig
            </button>
            <button id="addBigModeOff" onClick={addBigModeOff}>
                addBigModeOff
            </button>
            <button id="delLastChart" onClick={deleteLastChart}>
                delLastChart
            </button>
            <button id="set25ToSmall" onClick={set25ToSmall}>
                set25ToSmall
            </button>

            {charts.map(chart => (
                <Sparkline key={chart.id} name={chart.name} categories={categories} data={chart.data} syncMode={chart.syncMode} />
            ))}
        </PeakMetricsContext.Provider>
    );
};

const setUp = (props: { initState: TChart[] }) => mount(<Wrapper {...props} />);

const mockFn = jest.fn().mockImplementation(props => props);
jest.mock('@visx/xychart', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('@visx/xychart'),
    XYChart: (props: unknown) => {
        mockFn(props);
        return <></>;
    },
}));

describe('синхронизация Sparkline-ов', () => {
    it('при добавлении нового с максимальными значениями, изменился первый', () => {
        const wrapper = setUp({ initState: [small] });

        const oldPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksSmall).toEqual([smallMin, smallMax]);

        wrapper.find('#addMedium').simulate('click');

        const newPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksSmall).toEqual([mediumMin, mediumMax]);
    });

    it('при удалении второго, с максимальными значениями, изменился первый', () => {
        const wrapper = setUp({ initState: [small, medium] });

        const oldPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksSmall).toEqual([mediumMin, mediumMax]);

        wrapper.find('#delLastChart').simulate('click');

        const newPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksSmall).toEqual([smallMin, smallMax]);
    });

    it('при изменении глобальных макс/мин в первом, изменился второй', () => {
        const wrapper = setUp({ initState: [small, medium] });

        const oldPeaksMedium = wrapper
            .find('Memo(InnerSparkline)')
            .at(1)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksMedium).not.toContain(25);

        wrapper.find('#set25ToSmall').simulate('click');

        const newPeaksMedium = wrapper
            .find('Memo(InnerSparkline)')
            .at(1)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksMedium).toContain(25);
    });

    it('при добавлении второго, макс/мин у которого меньше, первый не перерисовывается', () => {
        const wrapper = setUp({ initState: [large] });
        mockFn.mockClear();

        expect(mockFn.mock.calls.length).toBe(0);

        wrapper.find('#addMedium').simulate('click');

        expect(mockFn.mock.calls.length).toBe(1);
    });

    it('при добавлении второго графика, другого типа', () => {
        const wrapper = setUp({ initState: [large] });
        mockFn.mockClear();

        const oldPeaksLarge = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksLarge).toEqual([largeMin, largeMax]);

        wrapper.find('#addBig').simulate('click');

        const newPeaksLarge = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksLarge).toEqual(oldPeaksLarge);

        const newPeaksBig = wrapper
            .find('Memo(InnerSparkline)')
            .at(1)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksBig).toEqual([bigMin, bigMax]);

        expect(mockFn.mock.calls.length).toBe(2);
    });

    it('синхронизация первого в режиме min, при добавлении второго', () => {
        const wrapper = setUp({ initState: [smallMinMode] });

        const oldPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksSmall).toEqual([smallMin, smallMax]);

        wrapper.find('#addMedium').simulate('click');

        const newPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksSmall).toEqual([mediumMin, smallMax]);
    });

    it('синхронизация первого в режиме max, при добавлении второго', () => {
        const wrapper = setUp({ initState: [smallMaxMode] });

        const oldPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksSmall).toEqual([smallMin, smallMax]);

        wrapper.find('#addMedium').simulate('click');

        const newPeaksSmall = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksSmall).toEqual([smallMin, mediumMax]);
    });

    it('синхронизация обоих одного типа в режиме off, при добавлении второго', () => {
        const wrapper = setUp({ initState: [largeOffMode] });
        mockFn.mockClear();

        const oldPeaksLarge = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(oldPeaksLarge).toEqual([largeMin, largeMax]);
        expect(mockFn.mock.calls.length).toBe(0);

        wrapper.find('#addBigModeOff').simulate('click');

        const newPeaksLarge = wrapper
            .find('Memo(InnerSparkline)')
            .at(0)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksLarge).toEqual([largeMin, largeMax]);

        const newPeaksBig = wrapper
            .find('Memo(InnerSparkline)')
            .at(1)
            .childAt(0)
            .prop('yScale')['domain'];
        expect(newPeaksBig).toEqual([bigMin, bigMax]);
        expect(mockFn.mock.calls.length).toBe(1);
    });
});

import React from 'react';
import moment from 'moment';
import numeral from 'numeral';

export const getFormattedDate = (timestamp: number) => {
    const parsedDate = moment(timestamp);

    if (parsedDate.isValid()) {
        return (
            <span>
                {parsedDate.format('DD.MM.YYYY HH:mm:ss')}
            </span>
        );
    }

    return <React.Fragment>-</React.Fragment>;
};

export const getFormattedNumber = (value: number) => (
    <span>{numeral(value).format('0,0[.][0000]')}</span>
);
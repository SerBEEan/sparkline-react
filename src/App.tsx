import React from 'react';
import { Sparkline } from './components/Sparkline';

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

const a = 5;

const App: React.FC = () => {
  return (
    <>
      <Sparkline name='Ошибки' categories={categories} data={data} width={220} height={84} />
    </>
  );
}

export default App;

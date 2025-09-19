import { useMemo } from 'react';
import {  processItemsOverTime, aggregateItemsOverTime, sortItemsOverTime } from '../utils/dataProcessing';

export const useDepositsVisualizer = (filteredData) => {
  
  const depositsOverTime = useMemo(() => {
    return processItemsOverTime(filteredData?.filteredDeposits || []);
  }, [filteredData]);

  const formattedDepositsOverTime = useMemo(() => {
    const aggregatedData = aggregateItemsOverTime(depositsOverTime);
    return sortItemsOverTime(aggregatedData);
  }, [depositsOverTime]);

  return {

    depositsOverTime,
    formattedDepositsOverTime,
  };
};

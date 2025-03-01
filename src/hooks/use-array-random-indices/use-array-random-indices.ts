import { useState, useEffect } from 'react';
import { LoadingStatus } from '../../const';
import { getUniqueRandomInts } from '../../util';

function useArrayRandomIndices(arrayLength: number, count: number, loadingStatus: LoadingStatus) {
  const [indices, setIndices] = useState<Array<number>>([]);

  useEffect(() => {
    if (loadingStatus === LoadingStatus.Pending) {
      setIndices([]);
    } else if (loadingStatus === LoadingStatus.Success && arrayLength) {
      setIndices(
        getUniqueRandomInts({ from: 0, to: arrayLength - 1 }, Math.min(arrayLength, count))
      );
    }
  }, [arrayLength, count, loadingStatus]);

  return indices;
}

export default useArrayRandomIndices;

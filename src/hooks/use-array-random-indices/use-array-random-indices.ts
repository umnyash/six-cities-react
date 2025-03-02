import { useState, useEffect } from 'react';
import { RequestStatus } from '../../const';
import { getUniqueRandomInts } from '../../util';

function useArrayRandomIndices(arrayLength: number, count: number, loadingStatus: RequestStatus) {
  const [indices, setIndices] = useState<Array<number>>([]);

  useEffect(() => {
    if (loadingStatus === RequestStatus.Pending) {
      setIndices([]);
    } else if (loadingStatus === RequestStatus.Success && arrayLength) {
      setIndices(
        getUniqueRandomInts({ from: 0, to: arrayLength - 1 }, Math.min(arrayLength, count))
      );
    }
  }, [arrayLength, count, loadingStatus]);

  return indices;
}

export default useArrayRandomIndices;

import { renderHook } from '@testing-library/react';
import { RequestStatus } from '../../const';
import { useArrayRandomIndices } from './use-array-random-indices';

describe('Hook: useArrayRandomIndices', () => {
  it('should return array', () => {
    const { result } = renderHook(() => useArrayRandomIndices(10, 3, RequestStatus.Success));

    expect(result.current).toHaveLength(3);
    expect(result.current.every((item) => typeof item === 'number' && !isNaN(item))).toBe(true);
  });

  it.each([0, 1, 2, 3, 4])(
    'should return an array of %i numbers when loading status is "Success" and count of requested indices is less than or equal to the array length',
    (requestedIndicesCount) => {
      const { result } = renderHook(() => useArrayRandomIndices(4, requestedIndicesCount, RequestStatus.Success));

      expect(result.current).toHaveLength(requestedIndicesCount);
      expect(result.current.every((item) => typeof item === 'number' && !isNaN(item))).toBe(true);
    }
  );

  it.each([0, 4])(
    'should return an array of %i when loading status is "Success" and count of requested indices is greater than the array length',
    (arrayLength) => {
      const requestedIndicesCount = arrayLength + 1;
      const { result } = renderHook(() => useArrayRandomIndices(arrayLength, requestedIndicesCount, RequestStatus.Success));

      expect(result.current).toHaveLength(arrayLength);
      expect(result.current.every((item) => typeof item === 'number' && !isNaN(item))).toBe(true);
    }
  );

  it('should return empty array when loading status is "Pending"', () => {
    const { result } = renderHook(() => useArrayRandomIndices(4, 3, RequestStatus.Pending));
    expect(result.current).toHaveLength(0);
  });

  it('should update random indices array when the data array is reloaded', () => {
    const requestedIndicesCount = 3;
    const { result, rerender } = renderHook(({ loadingStatus }) => useArrayRandomIndices(10, requestedIndicesCount, loadingStatus), {
      initialProps: { loadingStatus: RequestStatus.Success }
    });
    const firstIndices = [...result.current];

    expect(result.current).toHaveLength(requestedIndicesCount);

    rerender({ loadingStatus: RequestStatus.Pending });

    expect(result.current).toHaveLength(0);

    rerender({ loadingStatus: RequestStatus.Success });
    const secondIndices = [...result.current];

    expect(result.current).toHaveLength(requestedIndicesCount);
    expect(secondIndices).not.toEqual(firstIndices);
  });
});

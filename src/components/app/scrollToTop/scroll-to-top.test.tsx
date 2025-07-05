import { MemoryHistory, createMemoryHistory } from 'history';
import { render, act } from '@testing-library/react';

import { AppRoute } from '../../../const';
import { withHistory } from '../../../mocks/render-helpers';

import ScrollToTop from './scroll-to-top';

describe('Component: ScrollToTop', () => {
  let mockHistory: MemoryHistory;
  const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => { });

  beforeEach(() => {
    mockHistory = createMemoryHistory();
    vi.clearAllMocks();
  });

  it('scrolls to top on initial render', () => {
    const withHistoryComponent = withHistory(<ScrollToTop />, mockHistory);
    render(withHistoryComponent);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('does not scroll if path hasn\'t changed', () => {
    mockHistory.push(AppRoute.Root);
    const withHistoryComponent = withHistory(<ScrollToTop />, mockHistory);

    render(withHistoryComponent);
    act(() => mockHistory.push(AppRoute.Root));

    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });

  it('scrolls on every path change', () => {
    mockHistory.push(AppRoute.Root);
    const withHistoryComponent = withHistory(<ScrollToTop />, mockHistory);

    render(withHistoryComponent);
    expect(scrollToMock).toHaveBeenCalledTimes(1);

    act(() => mockHistory.push(AppRoute.Offer));
    expect(scrollToMock).toHaveBeenCalledTimes(2);

    act(() => mockHistory.push(AppRoute.Root));
    expect(scrollToMock).toHaveBeenCalledTimes(3);
  });
});

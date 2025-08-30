import { screen, render, waitFor } from '@testing-library/react';
import { Outlet } from 'react-router-dom';

import { PageTitle } from '../../../const';
import { withHistory } from '../../../tests/render-helpers';
import { useLayoutSettings } from '../../../hooks';
import Header from '../header';
import Footer from '../footer';

import Layout from './layout';

vi.mock('../../../hooks/use-layout-settings/use-layout-settings', () => ({
  useLayoutSettings: vi.fn(() => null)
}));

vi.mock('../header', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../footer', () => ({
  default: vi.fn(() => null)
}));

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');

  return {
    ...originalModule,
    Outlet: vi.fn(() => null)
  };
});

describe('Component: Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      pageTitle: PageTitle.Root,
      pageClassName: 'some class name-1',
      withUserNavigation: true,
      withFooter: true,
    },
    {
      pageTitle: PageTitle.Favorites,
      pageClassName: 'some class name-2',
      withUserNavigation: false,
      withFooter: false,
    },
  ])(
    'should render correctly',
    async ({ pageTitle, pageClassName, withUserNavigation, withFooter }) => {
      vi
        .mocked(useLayoutSettings)
        .mockReturnValue({ pageTitle, pageClassName, withUserNavigation, withFooter });
      const withHistoryComponent = withHistory(<Layout />);

      render(withHistoryComponent);
      const layoutElement = screen.getByTestId('layout');

      await waitFor(() => expect(document.title).toBe(pageTitle));
      expect(useLayoutSettings).toHaveBeenCalledOnce();
      expect(layoutElement).toHaveAttribute('class', pageClassName);
      expect(Header).toHaveBeenCalledOnce();
      expect(Header).toBeCalledWith({ withUserNavigation }, expect.anything());
      expect(Outlet).toHaveBeenCalledOnce();
      expect(Footer).toBeCalledTimes(+withFooter);
    }
  );
});

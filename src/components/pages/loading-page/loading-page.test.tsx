import { render, waitFor } from '@testing-library/react';

import { withHistory } from '../../../mocks/render-helpers';
import Spinner from '../../ui/spinner';

import LoadingPage from './loading-page';

vi.mock('../../ui/spinner', () => ({
  default: vi.fn(() => null)
}));

describe('Component: LoadingPage', () => {
  it('should render correctly', async () => {
    const expectedTitle = '6 cities: loading...';

    render(withHistory(<LoadingPage />));

    await waitFor(() => expect(document.title).toBe(expectedTitle));
    expect(Spinner).toHaveBeenCalledOnce();
  });
});

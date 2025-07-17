import { render } from '@testing-library/react';

import Logo from '../../ui/logo';
import UserNavigation from '../user-navigation';

import Header from './header';

vi.mock('../../ui/logo', () => ({
  default: vi.fn(() => null)
}));

vi.mock('../user-navigation', () => ({
  default: vi.fn(() => null)
}));

describe('Component: Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Header />);
    expect(Logo).toHaveBeenCalledOnce();
  });

  it('should render UserNavigation when withUserNavigation is true', () => {
    render(<Header withUserNavigation />);
    expect(UserNavigation).toHaveBeenCalledOnce();
  });

  it('should not render UserNavigation when withUserNavigation is false', () => {
    render(<Header />);
    expect(UserNavigation).not.toHaveBeenCalled();
  });
});

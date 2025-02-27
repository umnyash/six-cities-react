import Logo from '../logo';
import UserNavigation from '../user-navigation';
import { memo } from 'react';

type HeaderProps = {
  withUserNavigation?: boolean;
}

function HeaderComponent({ withUserNavigation }: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo />
          </div>

          {withUserNavigation && (
            <nav className="header__nav">
              <UserNavigation />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

const Header = memo(HeaderComponent);

export default Header;

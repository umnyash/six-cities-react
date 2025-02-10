import Logo from '../logo';
import UserNavigation from '../user-navigation';

type HeaderProps = {
  withUserNavigation?: boolean;
}

function Header({ withUserNavigation }: HeaderProps): JSX.Element {
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

export default Header;

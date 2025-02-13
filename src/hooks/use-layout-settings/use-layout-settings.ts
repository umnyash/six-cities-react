import { useMatch } from 'react-router-dom';
import { AppRoute, PageTitle } from '../../const';
import useAppSelector from '../../hooks/use-app-selector';

const useLayoutSettings = () => {
  let pageTitle = PageTitle.Root;
  let pageClassName = 'page';
  let withUserNavigation = true;
  let withFooter = false;

  const favorites = useAppSelector((state) => state.favorites);

  const isMainPage = !!useMatch(AppRoute.Root);
  const isLoginPage = !!useMatch(AppRoute.Login);
  const isFavoritesPage = !!useMatch(AppRoute.Favorites);
  const isOfferPage = !!useMatch(AppRoute.Offer);

  switch (true) {
    case isMainPage:
      pageClassName = `${pageClassName} page--gray page--main`;
      break;

    case isLoginPage:
      pageTitle = PageTitle.Login;
      pageClassName = `${pageClassName} page--gray page--login`;
      withUserNavigation = false;
      break;

    case isFavoritesPage:
      pageTitle = PageTitle.Favorites;
      pageClassName = favorites.length ? pageClassName : `${pageClassName} page--favorites-empty`;
      withFooter = true;
      break;

    case isOfferPage:
      pageTitle = PageTitle.Offer;
      break;

    default:
      pageTitle = PageTitle.NotFound;
  }

  return { pageTitle, pageClassName, withUserNavigation, withFooter };
};

export default useLayoutSettings;

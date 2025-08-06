import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useLayoutSettings } from '../../../hooks';

import Header from '../header';
import Footer from '../footer';

function Layout(): JSX.Element {
  const { pageTitle, pageClassName, withUserNavigation, withFooter } = useLayoutSettings();

  return (
    <div className={pageClassName} data-testid="layout">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <Header withUserNavigation={withUserNavigation} />
      <Outlet />
      {withFooter && <Footer />}
    </div>
  );
}

export default Layout;

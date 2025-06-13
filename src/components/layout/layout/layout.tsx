import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import useLayoutSettings from '../../../hooks/use-layout-settings';

import Header from '../header';
import Footer from '../footer';

function Layout(): JSX.Element {
  const { pageTitle, pageClassName, withUserNavigation, withFooter } = useLayoutSettings();

  return (
    <div className={pageClassName} style={{ paddingLeft: 'calc(100vw - 100%)' }}>
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

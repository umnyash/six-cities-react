import { Helmet } from 'react-helmet-async';

import Spinner from '../../ui/spinner';

function LoadingPage(): JSX.Element {
  return (
    <div className="page" style={{ display: 'grid', minHeight: '100vh' }}>
      <Helmet>
        <title>6 cities: loading...</title>
      </Helmet>

      <Spinner />
    </div>
  );
}

export default LoadingPage;

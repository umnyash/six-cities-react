import MainPage from '../../pages/main-page/main-page';

type AppProps = {
  offersCount: number;
}

function App({ offersCount }: AppProps): JSX.Element {
  return (
    <MainPage offersCount={offersCount} />
  );
}

export default App;

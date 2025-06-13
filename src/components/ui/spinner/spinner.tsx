import style from './spinner.module.css';

function Spinner(): JSX.Element {
  return (
    <div className={style.spinner}>
      <p className="visually-hidden">Loading...</p>
      <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" rx="1" width="10" height="10" fill='#4481c3' />
        <rect x="1" y="1" rx="1" width="10" height="10" fill='#4481c3' />
        <rect x="1" y="1" rx="1" width="10" height="10" fill='#4481c3' />
      </svg>
    </div>
  );
}

export default Spinner;

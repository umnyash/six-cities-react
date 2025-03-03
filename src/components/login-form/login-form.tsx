import { useState, ChangeEvent, FormEvent } from 'react';
import { RequestStatus } from '../../const';
import useAppDispatch from '../../hooks/use-app-dispatch';
import useAppSelector from '../../hooks/use-app-selector';
import { getLoggingInStatus } from '../../store/user/user.selectors';
import { loginUser } from '../../store/async-actions';
import Button, { ButtonType } from '../../components/button';

function LoginForm(): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loggingInStatus = useAppSelector(getLoggingInStatus);
  const dispatch = useAppDispatch();

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <form className="login__form form" action="#" method="post" onSubmit={handleFormSubmit}>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden" htmlFor="email">E-mail</label>
        <input
          className="login__input form__input"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          required
          disabled={loggingInStatus === RequestStatus.Pending}
          onChange={handleFieldChange}
        />
      </div>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden" htmlFor="password">Password</label>
        <input
          className="login__input form__input"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          required
          disabled={loggingInStatus === RequestStatus.Pending}
          onChange={handleFieldChange}
          pattern="(?=.*[a-zA-Z])(?=.*\d).*"
          title="Пароль должен состоять минимум из одной буквы и цифры."
        />
      </div>
      <Button
        className="login__submit"
        type={ButtonType.Submit}
        disabled={loggingInStatus === RequestStatus.Pending}
      >
        Sign in
      </Button>
    </form>
  );
}

export default LoginForm;

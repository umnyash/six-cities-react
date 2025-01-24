import { useState, ChangeEvent } from 'react';

function LoginForm(): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form className="login__form form" action="#" method="post">
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
          onChange={handleFieldChange}
          pattern="(?=.*[a-zA-Z])(?=.*\d).*"
          title="Пароль должен состоять минимум из одной буквы и цифры."
        />
      </div>
      <button className="login__submit form__submit button" type="submit">Sign in</button>
    </form>
  );
}

export default LoginForm;

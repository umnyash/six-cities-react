import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { RequestStatus, AuthorizationStatus, NameSpace } from '../../../const';
import { State } from '../../../types/state';
import { apiPaths } from '../../../services/api';
import { getMockAuthUser } from '../../../data/mocks';
import { extractActionsTypes } from '../../../mocks/util';
import { withStore } from '../../../mocks/render-helpers';
import { loginUser } from '../../../store/async-actions';

import LoginForm from './login-form';

describe('Component: LoginForm', () => {
  const emailFieldTestId = 'email-field';
  const passwordFieldTestId = 'password-field';
  const someValidEmail = 'test@test.com';
  const someValidPassword = 'abc123';
  const submitButtonText = /sign in/i;
  const mockAuthUser = getMockAuthUser();

  let mockInitialState: Pick<State, NameSpace.User>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.User]: {
        user: null,
        loggingInStatus: RequestStatus.None,
        authorizationStatus: AuthorizationStatus.NoAuth,
      }
    };
  });

  it('should render correctly', () => {
    const emailLabelText = 'E-mail';
    const passwordLabelText = 'Password';
    const { withStoreComponent } = withStore(<LoginForm />, mockInitialState);

    render(withStoreComponent);

    expect(screen.getByLabelText(emailLabelText)).toBeInTheDocument();
    expect(screen.getByLabelText(passwordLabelText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: submitButtonText })).toBeInTheDocument();
  });

  it('should render correctly when user enter email or password', async () => {
    const { withStoreComponent } = withStore(<LoginForm />, mockInitialState);

    render(withStoreComponent);
    await userEvent.type(
      screen.getByTestId(emailFieldTestId),
      someValidEmail
    );
    await userEvent.type(
      screen.getByTestId(passwordFieldTestId),
      someValidPassword
    );

    expect(screen.getByDisplayValue(someValidEmail)).toBeInTheDocument();
    expect(screen.getByDisplayValue(someValidPassword)).toBeInTheDocument();
  });

  describe('validation', () => {
    let withStoreComponent: ReturnType<typeof withStore>['withStoreComponent'];
    let emailFieldElement: HTMLInputElement;
    let passwordFieldElement: HTMLInputElement;

    beforeEach(() => {
      ({ withStoreComponent } = withStore(<LoginForm />, mockInitialState));

      render(withStoreComponent);
      emailFieldElement = screen.getByTestId(emailFieldTestId);
      passwordFieldElement = screen.getByTestId(passwordFieldTestId);
    });

    describe('email field', () => {
      it('should be invalid when email is empty', () => {
        expect(emailFieldElement.validity.valid).toBe(false);
        expect(emailFieldElement.validity.valueMissing).toBe(true);
      });

      it('should be invalid when email has wrong format', async () => {
        await userEvent.type(emailFieldElement, '@test');

        expect(emailFieldElement.validity.valid).toBe(false);
        expect(emailFieldElement.validity.valueMissing).toBe(false);
      });

      it('should be valid when email has correct format', async () => {
        await userEvent.type(emailFieldElement, someValidEmail);

        expect(emailFieldElement.validity.valid).toBe(true);
        expect(emailFieldElement.validity.valueMissing).toBe(false);
      });
    });

    describe('password field', () => {
      it('should be invalid when password is empty', () => {
        expect(passwordFieldElement.validity.valueMissing).toBe(true);
        expect(passwordFieldElement.validity.valid).toBe(false);
      });

      it('should be invalid when password not contain a single letter', async () => {
        await userEvent.type(passwordFieldElement, '1234');

        expect(passwordFieldElement.validity.valid).toBe(false);
        expect(passwordFieldElement.validity.patternMismatch).toBe(true);
      });

      it('should be invalid when password not contain a single number', async () => {
        await userEvent.type(passwordFieldElement, 'abcd');

        expect(passwordFieldElement.validity.valid).toBe(false);
        expect(passwordFieldElement.validity.patternMismatch).toBe(true);
      });

      it('should be valid when password contains at least 1 letter and 1 number', async () => {
        await userEvent.type(passwordFieldElement, someValidPassword);

        expect(passwordFieldElement.validity.valid).toBe(true);
        expect(passwordFieldElement.validity.patternMismatch).toBe(false);
      });
    });
  });

  describe('submitting form', () => {
    it('should submit form and dispatch "loginUser" with user input when fields is valid and user clicked submit button', async () => {
      const mockAuthData = { email: someValidEmail, password: someValidPassword };
      const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(<LoginForm />, mockInitialState);
      mockAPIAdapter.onPost(apiPaths.login()).reply(StatusCodes.CREATED, mockAuthUser);

      render(withStoreComponent);
      const emailFieldElement = screen.getByTestId(emailFieldTestId);
      const passwordFieldElement = screen.getByTestId(passwordFieldTestId);
      const submitButtonElement = screen.getByRole('button', { name: submitButtonText });
      await userEvent.type(emailFieldElement, mockAuthData.email);
      await userEvent.type(passwordFieldElement, mockAuthData.password);
      await userEvent.click(submitButtonElement);
      const dispatchedActions = mockStore.getActions();
      const loginUserPending = dispatchedActions[0] as ReturnType<typeof loginUser.pending>;
      const actionsTypes = extractActionsTypes(dispatchedActions);

      expect([
        loginUser.pending.type,
        loginUser.fulfilled.type,
      ]).toEqual(actionsTypes);
      expect(loginUserPending.meta.arg).toEqual(mockAuthData);
    });

    it('should lock form while submitting (loggingInStatus is "Pending")', () => {
      mockInitialState[NameSpace.User].loggingInStatus = RequestStatus.Pending;
      const { withStoreComponent } = withStore(<LoginForm />, mockInitialState);

      render(withStoreComponent);
      const emailFieldElement = screen.getByTestId(emailFieldTestId);
      const passwordFieldElement = screen.getByTestId(passwordFieldTestId);
      const submitButtonElement = screen.getByRole('button', { name: submitButtonText });

      expect(emailFieldElement).toBeDisabled();
      expect(passwordFieldElement).toBeDisabled();
      expect(submitButtonElement).toBeDisabled();
    });

    it.each([
      RequestStatus.None,
      RequestStatus.Success,
      RequestStatus.Error,
    ])('should not lock form when not submitting (loggingInStatus is "%s")', (requestStatus) => {
      mockInitialState[NameSpace.User].loggingInStatus = requestStatus;
      const { withStoreComponent } = withStore(<LoginForm />, mockInitialState);

      render(withStoreComponent);
      const emailFieldElement = screen.getByTestId(emailFieldTestId);
      const passwordFieldElement = screen.getByTestId(passwordFieldTestId);
      const submitButtonElement = screen.getByRole('button', { name: submitButtonText });

      expect(emailFieldElement).toBeEnabled();
      expect(passwordFieldElement).toBeEnabled();
      expect(submitButtonElement).toBeEnabled();
    });
  });
});

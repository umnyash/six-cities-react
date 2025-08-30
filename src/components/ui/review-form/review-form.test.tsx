import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusCodes } from 'http-status-codes';

import { RATINGS, RequestStatus, NameSpace, ReviewCommentLength } from '../../../const';
import { State } from '../../../types/state';
import { apiPaths } from '../../../services/api';
import { getMockReview } from '../../../data/mocks';
import { extractActionsTypes } from '../../../tests/util';
import { withStore } from '../../../tests/render-helpers';
import { submitReview } from '../../../store/async-actions';

import ReviewForm from './review-form';

describe('Component: ReviewForm', () => {
  const someOfferId = 'some-offer-id';
  const helpElementTestId = 'review-form-help';
  const helpAdditionalText = 'and no more than 300';
  const commentFieldPlaceholder = 'Tell how was your stay, what you like and what can be improved';
  let mockInitialState: Pick<State, NameSpace.Reviews>;

  beforeEach(() => {
    mockInitialState = {
      [NameSpace.Reviews]: {
        reviews: [],
        reviewSubmittingStatus: RequestStatus.None,
      }
    };
  });

  it('should render correctly', () => {
    const commentLabelText = 'Your review';
    const helpText = 'To submit review please make sure to set rating and describe your stay with at least 50 characters.';
    const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

    render(withStoreComponent);
    const commentLabel = screen.getByLabelText(commentLabelText);
    const radiobuttons = screen.getAllByRole('radio');
    const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const help = screen.getByTestId(helpElementTestId);

    expect(commentLabel).toBeInTheDocument();
    expect(commentField).toBeInTheDocument();
    expect(radiobuttons).toHaveLength(RATINGS.length);
    expect(submitButton).toBeInTheDocument();
    expect(help).toHaveTextContent(helpText);
  });

  it('should render correctly when user select rating and enter comment', async () => {
    const someText = 'Lorem ipsum';
    const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

    render(withStoreComponent);
    const radiobutton = screen.getByRole('radio', { name: RATINGS[2] });
    const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
    await userEvent.click(commentField);
    await userEvent.paste(someText);
    await userEvent.click(radiobutton);

    expect(screen.getByDisplayValue(someText)).toBeInTheDocument();
    expect(radiobutton).toBeChecked();
  });

  describe('validation', () => {
    const someValidShortComment = '*'.repeat(ReviewCommentLength.Min);
    const someValidLongComment = '*'.repeat(ReviewCommentLength.Max);
    const someInvalidShortComment = '*'.repeat(ReviewCommentLength.Min - 1);
    const someInvalidLongComment = '*'.repeat(ReviewCommentLength.Max + 1);

    it.each([
      {
        condition: 'rating is not selected',
        comment: someValidShortComment,
      },
      {
        condition: 'comment is empty',
        rating: RATINGS[2],
      },
      {
        condition: `comment is shorter than ${ReviewCommentLength.Min} characters`,
        rating: RATINGS[2],
        comment: someInvalidShortComment,
      },
      {
        condition: `comment is longer than ${ReviewCommentLength.Max} characters`,
        rating: RATINGS[2],
        comment: someInvalidLongComment,
      },
    ])('should disable submit button when $condition', async ({ rating, comment }) => {
      const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

      render(withStoreComponent);
      const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      if (rating) {
        const radiobutton = screen.getByRole('radio', { name: rating });
        await userEvent.click(radiobutton);
        expect(screen.getByRole('radio', { checked: true })).toBeInTheDocument();
      } else {
        const radiobuttons = screen.getAllByRole('radio');
        radiobuttons.forEach((radiobutton) => expect(radiobutton).not.toBeChecked());
      }

      if (comment) {
        await userEvent.click(commentField);
        await userEvent.paste(comment);
        expect(commentField).toHaveValue(comment);
      } else {
        expect(commentField).toHaveValue('');
      }

      expect(submitButton).toBeDisabled();
    });

    it.each([50, 300])(
      'should not disable submit button and not add additional help text when rating is selected and comment length (%d) is correct',
      async (commentLength) => {
        const validComment = '-'.repeat(commentLength);
        const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

        render(withStoreComponent);

        const radiobutton = screen.getByRole('radio', { name: RATINGS[2] });
        const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const help = screen.getByTestId(helpElementTestId);
        await userEvent.click(radiobutton);
        await userEvent.click(commentField);
        await userEvent.paste(validComment);

        expect(screen.getByRole('radio', { checked: true })).toBeInTheDocument();
        expect(submitButton).toBeEnabled();
        expect(help).not.toHaveTextContent(helpAdditionalText);
      }
    );

    describe('Max length help text', () => {
      let commentField: HTMLElement;
      let help: HTMLElement;

      beforeEach(async () => {
        const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

        render(withStoreComponent);
        commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
        help = screen.getByTestId(helpElementTestId);

        await userEvent.click(commentField);
      });

      it(`should add additional help text when comment is longer than ${ReviewCommentLength.Max} characters`, async () => {
        await userEvent.paste(someInvalidLongComment);

        expect(commentField).toHaveTextContent(someInvalidLongComment);
        expect(help).toHaveTextContent(helpAdditionalText);
      });

      it(`should not add additional help text when comment is no longer than ${ReviewCommentLength.Max} characters`, async () => {
        await userEvent.paste(someValidLongComment);

        expect(commentField).toHaveTextContent(someValidLongComment);
        expect(help).not.toHaveTextContent(helpAdditionalText);
      });
    });
  });

  describe('form submitting', () => {
    it('should submit form and dispatch "submitReview" when submit button is enabled and user clicked it', async () => {
      const mockReviewContent = {
        comment: '-'.repeat(ReviewCommentLength.Min),
        rating: 5,
      };
      const { withStoreComponent, mockStore, mockAPIAdapter } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);
      mockAPIAdapter.onPost(apiPaths.reviews('some-offer-id')).reply(StatusCodes.CREATED, getMockReview());

      render(withStoreComponent);
      const radiobutton = screen.getByRole('radio', { name: RATINGS[mockReviewContent.rating - 1] });
      const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(commentField);
      await userEvent.paste(mockReviewContent.comment);
      await userEvent.click(radiobutton);
      await userEvent.click(submitButton);
      const dispatchedActions = mockStore.getActions();
      const actionsTypes = extractActionsTypes(dispatchedActions);
      const submitReviewPending = dispatchedActions[0] as ReturnType<typeof submitReview.pending>;

      expect(actionsTypes).toEqual([
        submitReview.pending.type,
        submitReview.fulfilled.type,
      ]);
      expect(submitReviewPending.meta.arg).toEqual({
        offerId: someOfferId,
        content: mockReviewContent,
      });
    });

    it('should lock form when form submitting (reviewSubmittingStatus is "Pending")', () => {
      mockInitialState[NameSpace.Reviews].reviewSubmittingStatus = RequestStatus.Pending;
      const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

      render(withStoreComponent);
      const radiobuttons = screen.getAllByRole('radio');
      const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeDisabled());
      expect(commentField).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it.each([
      RequestStatus.None,
      RequestStatus.Success,
      RequestStatus.Error]
    )('should not lock form when not submitting (reviewSubmittingStatus is "%s")', (status) => {
      mockInitialState[NameSpace.Reviews].reviewSubmittingStatus = status;
      const { withStoreComponent } = withStore(<ReviewForm offerId={someOfferId} />, mockInitialState);

      render(withStoreComponent);
      const radiobuttons = screen.getAllByRole('radio');
      const commentField = screen.getByPlaceholderText(commentFieldPlaceholder);

      radiobuttons.forEach((radiobutton) => expect(radiobutton).toBeEnabled());
      expect(commentField).toBeEnabled();
    });
  });
});

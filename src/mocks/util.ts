import { Action } from 'redux';

export const extractActionsTypes = (actions: Array<Action<string>>) => actions.map(({ type }) => type);

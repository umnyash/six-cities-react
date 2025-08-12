import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.CONFLICT]: true,
};

export const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

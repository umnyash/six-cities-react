import { memo } from 'react';
import clsx from 'clsx';

import { Author } from '../../../types/user';

type OfferHostProps = {
  host: Author;
}

function OfferHostComponent({ host }: OfferHostProps) {
  const { name, avatarUrl, isPro } = host;

  const hostAvatarWrapperClassName = clsx(
    'offer__avatar-wrapper user__avatar-wrapper',
    isPro && 'offer__avatar-wrapper--pro'
  );

  return (
    <>
      <h2 className="offer__host-title">Meet the host</h2>
      <div className="offer__host-user user">
        <div className={hostAvatarWrapperClassName}>
          <img className="offer__avatar user__avatar" src={avatarUrl} width="74" height="74" alt="Host avatar" />
        </div>
        <span className="offer__user-name">{name}</span>
        {isPro && <span className="offer__user-status">Pro</span>}
      </div>
    </>
  );
}

const OfferHost = memo(OfferHostComponent);

export default OfferHost;

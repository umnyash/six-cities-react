import { useState, useEffect } from 'react';
import { PageOffer } from '../../types/offers';
import { api } from '../../store';
import { APIRoute } from '../../const';

function useOfferData(id: string) {
  const [offer, setOffer] = useState<undefined | null | PageOffer>(undefined);

  useEffect(() => {
    api.get<PageOffer>(`${APIRoute.Offers}/${id}`)
      .then((response) => {
        setOffer(response.data);
      })
      .catch(() => {
        setOffer(null);
      });
  }, [id]);

  return offer;
}

export default useOfferData;

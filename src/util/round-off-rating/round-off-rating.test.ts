import { roundOffRating } from './round-off-rating';

describe('Function: roundOffRating', () => {
  it('should round down ratings with a fractional part below 0.5', () => {
    expect(roundOffRating(3.1)).toBe(3);
    expect(roundOffRating(3.4)).toBe(3);
  });

  it('should round up ratings with a fractional part of 0.5 or higher', () => {
    expect(roundOffRating(3.5)).toBe(4);
    expect(roundOffRating(3.9)).toBe(4);
  });
});

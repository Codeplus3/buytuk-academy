import { similarity } from './handlers.js';

describe('worker handlers', () => {
  it('scores an exact transcription higher than a mismatch', () => {
    expect(similarity('hello world', 'hello world')).toBe(1);
    expect(similarity('hello world', 'different')).toBeLessThan(1);
  });
});
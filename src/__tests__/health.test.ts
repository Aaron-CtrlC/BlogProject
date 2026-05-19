import { describe, it, expect } from '@jest/globals';

describe('Smoke test — Jest setup', () => {
  it('should run a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});

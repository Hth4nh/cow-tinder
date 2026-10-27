import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_COWS,
  INITIAL_CONVERSATIONS,
  ICEBREAKER_SUGGESTIONS,
  COW_AUTO_REPLIES,
} from '../src/data/cows.ts';

test('INITIAL_COWS dataset has 8 complete prize cow profiles with 3 SVG gallery scenes each', () => {
  assert.equal(INITIAL_COWS.length, 8);
  for (const cow of INITIAL_COWS) {
    assert.ok(cow.id.startsWith('cow-'));
    assert.ok(cow.name.length > 0);
    assert.equal(cow.images.length, 3);
    for (const img of cow.images) {
      assert.ok(img.startsWith('data:image/svg+xml;utf8,'));
    }
    assert.ok(cow.stats.weightKg > 300);
    assert.ok(cow.stats.marblingScore >= 1 && cow.stats.marblingScore <= 12);
    assert.equal(cow.prompts.length, 2);
  }
});

test('INITIAL_CONVERSATIONS reference valid cow IDs and contain initial messages', () => {
  const validIds = new Set(INITIAL_COWS.map((c) => c.id));
  assert.ok(INITIAL_CONVERSATIONS.length >= 2);
  for (const conv of INITIAL_CONVERSATIONS) {
    assert.ok(validIds.has(conv.cowId));
    assert.ok(conv.messages.length > 0);
  }
  assert.ok(ICEBREAKER_SUGGESTIONS.length >= 3);
  assert.ok(COW_AUTO_REPLIES.length >= 3);
});

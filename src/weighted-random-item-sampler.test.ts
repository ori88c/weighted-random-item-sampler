/**
 * Copyright 2024 Ori Cohen https://github.com/ori88c
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WeightedRandomItemSampler } from './weighted-random-item-sampler';

describe('WeightedRandomItemSampler tests', () => {
  describe('Happy path tests', () => {
    test('items should be sampled with proportion to their weight', async () => {
      // Arrange.
      const items: ReadonlyArray<string> = [
        "weighted",
        "random",
        "item",
        "sampler",
        "suitable for",
        "genetic algorithms",
        "distributed systems",
        "surveys and polls",
        "and more"
      ];
      const respectiveWeights: ReadonlyArray<number> = [
        1.13,
        6,
        27,
        14.85,
        17.781,
        2.5,
        40,
        34.56,
        64.1
      ];

      const amountOfSamples = 30 * 1000; // Sufficiently big.
      const allowedErrorPercentage = 1.5; // At most 1.5% deviation from expectancy is reasonable.
      const weightsSum = respectiveWeights.reduce((sum, curr) => sum + curr);
      const maxAllowedFrequencyError = Math.ceil(amountOfSamples * allowedErrorPercentage / 100);

      // Act.
      const sampler = new WeightedRandomItemSampler(items, respectiveWeights);
      const itemToFrequency = new Map<string, number>();
      for (let i = 0; i < amountOfSamples; ++i) {
        const sampledItem = sampler.sample();
        const frequency = itemToFrequency.get(sampledItem) ?? 0;
        itemToFrequency.set(sampledItem, 1 + frequency);
      }

      // Assert.
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const weight = respectiveWeights[i];

        const actualFrequency = itemToFrequency.get(item);
        expect(actualFrequency).toBeDefined();

        const expectancy = Math.floor(amountOfSamples * weight / weightsSum);
        expect(actualFrequency).toBeGreaterThanOrEqual(expectancy - maxAllowedFrequencyError);
        expect(actualFrequency).toBeLessThanOrEqual(expectancy + maxAllowedFrequencyError);
      }
    });
  });

  describe('Negative path tests', () => {
    test('constructor should throw when it is given 0 items', () => {
      expect(() => new WeightedRandomItemSampler([], [5,4])).toThrow();
    });

    test('constructor should throw when the amount of items is not equal to the amount of weights', () => {
      expect(() => new WeightedRandomItemSampler(["item1", "item2"], [1,2,3])).toThrow();
      expect(() => new WeightedRandomItemSampler(["item1", "item2"], [51])).toThrow();
    });

    test('constructor should throw when non-positive weight is provided', () => {
      expect(() => new WeightedRandomItemSampler(["item1", "item2"], [1, -2])).toThrow();
      expect(() => new WeightedRandomItemSampler(["item1", "item2"], [0, 5.6])).toThrow();
      expect(() => new WeightedRandomItemSampler(["item1", "item2", "item3"], [0.3, 4, 0])).toThrow();
      expect(() => new WeightedRandomItemSampler(["item1", "item2", "item3"], [6, 4, -0.7])).toThrow();
    });
  });
});

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

/**
 * WeightedRandomItemSampler
 * 
 * The `WeightedRandomItemSampler` class implements a random sampler where the probability of selecting 
 * an item is proportional to its weight. 
 * 
 * For example, given items [A, B] with respective weights [5, 12], the probability of sampling item B 
 * is 12/5 higher than the probability of sampling item A.
 * 
 * Weights must be positive numbers, and there are no restrictions on them being natural numbers. 
 * Floating point weights such as 0.95, 5.4, and 119.83 are also supported.
 * 
 * The sampling method utilizes a binary search optimization, making it suitable for performance-demanding 
 * applications where the set of items is large and the sampling frequency is high.
 * 
 * ### Use Case Examples
 * 1. **Distributed Systems**: The sampler can assist in distributing workloads among servers based on their 
 *    capacities or current load, ensuring that more capable servers handle a greater number of tasks.
 * 2. **Surveys and Polls**: The sampler can be used to select participants based on demographic weights, 
 *    ensuring a representative sample.
 * 
 * ### Complexity
 * - **Constructor**: Performs pre-processing with O(items.length) time and space complexity.
 * - **sample**: O(log(items.length)) time and O(1) space complexity.
 */
export class WeightedRandomItemSampler<T> {
    private readonly _items: ReadonlyArray<T>;

    // The 0th imaginary range corresponds interval [0, _ascRangeEnds[0]).
    // The ith imaginary range corresponds interval [_ascRangeEnds[i-1], _ascRangeEnds[i]).
    private readonly _ascRangeEnds: ReadonlyArray<number>; // Ascending exclusive-ends of ranges.
    private readonly _lastRangeEnd: number;

    /**
     * Constructor
     * 
     * Initializes the sampler by performing input validations and O(items.length) pre-processing.
     * The number of items must be positive and equal to the number of respective weights. All weights must be positive.
     * 
     * @param items - The items to sample from.
     * @param respectiveWeights - The respective weights for the items, where respectiveWeights[i] is the weight of items[i].
     * @throws Will throw an error if validation fails.
     */
    constructor(
        items: ReadonlyArray<T>,
        respectiveWeights: ReadonlyArray<number>
    ) {
        if (items.length === 0) {
            throw new Error("Zero items were provided to WeightedRandomItemSampler");
        }

        if (items.length !== respectiveWeights.length) {
            throw new Error(
                `WeightedRandomItemSampler received ${items.length} items and ${respectiveWeights.length} ` +
                `weights. Each item must have exactly 1 respective weight`
            );
        }
        
        const ascRangeEnds = new Array<number>();
        let weightsPrefixSum = 0;
        for (const weight of respectiveWeights) {
            if (weight <= 0) {
                throw new Error(`WeightedRandomItemSampler received a non-positive weight of ${weight}`);
            }

            weightsPrefixSum += weight;
            ascRangeEnds.push(weightsPrefixSum);
            // The ith item (0-indexed) is associated with the following imaginary range:
            // [previous prefix sum, current prefix sum)
            // Ranges are pairwise disjoint intervals with inclusive starts and exclusive ends.
        }

        this._items = items;
        this._ascRangeEnds = ascRangeEnds;
        this._lastRangeEnd = weightsPrefixSum;
    }

    /**
     * sample
     * 
     * Randomly samples an item, with the probability of selecting a given item being proportional 
     * to its weight.
     * 
     * For example, given items [A, B] with respective weights [5, 12], the probability of sampling item B 
     * is 12/5 higher than that of sampling item A.
     * 
     * This method has O(log(items.length)) time complexity and O(1) space complexity, making it 
     * suitable for performance-demanding applications where the set of items is large and the sampling
     * frequency is high.
     * 
     * @returns An item from the items array provided to the constructor.
     */
    public sample(): T {
        const randomPoint = Math.random() * this._lastRangeEnd;
        const rangeIndex = this._findCorrespondingRangeIndex(randomPoint);
        return this._items[rangeIndex];
    }

    /**
     * _findCorrespondingRangeIndex
     * 
     * @param pointInRange A numeric point within the total range [0, this._lastRangeEnd)
     * @returns The index of the range where pointInRange is located.
     */
    private _findCorrespondingRangeIndex(pointInRange: number): number {
        // Find the leftmost (smallest) index i such that randomPoint < this._ascRangeEnds[i].
        // This index corresponds to the imaginary range in which the random point is located.
        let rangeIndex = 0;
        let left = 0;
        let right = this._ascRangeEnds.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (pointInRange < this._ascRangeEnds[mid]) {
                rangeIndex = mid; // This is an improving candidate.
                right = mid - 1; // If possible, find a lower index which satisfies the condition.
            } else { 
                left = mid + 1;
            }
        }

        return rangeIndex;
    }
}

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
export declare class WeightedRandomItemSampler<T> {
    private readonly _items;
    private readonly _ascRangeEnds;
    private readonly _lastRangeEnd;
    /**
     * Constructor
     *
     * Initializes the sampler by performing input validations and O(items.length) pre-processing.
     * The number of items must be positive and equal to the number of respective weights. All weights
     * must be positive.
     *
     * ### Ownership Transfer
     * Ownership of the 'items' array is transferred to this class upon instantiation, meaning the caller should
     * **not modify** the array after passing it to the constructor.
     * While cloning the array would prevent unintended modifications, transferring ownership is generally more
     * efficient since callers rarely need to retain references for other purposes beyond sampling.
     * If your use case does require retaining the original items for additional purposes, consider storing a copy
     * in a separate data structure.
     *
     * @param items - The items to sample from. Ownership of this array is transferred to the class;
     *                therefore, **do not** modify it after passing it to the constructor.
     * @param respectiveWeights - The respective weights for the items, where respectiveWeights[i] is the
     *                            weight of items[i].
     * @throws Error if validation fails; possible causes can be:
     *         - No items provided
     *         - A negative weight is provided
     *         - The length of items differs from the length of respectiveWeights
     */
    constructor(items: ReadonlyArray<T>, respectiveWeights: ReadonlyArray<number>);
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
    sample(): T;
    /**
     * _findCorrespondingRangeIndex
     *
     * @param pointInRange A numeric point within the total range [0, this._lastRangeEnd)
     * @returns The index of the range where pointInRange is located.
     */
    private _findCorrespondingRangeIndex;
}

<h2 align="middle">Weighted Random Item Sampler</h2>

The `WeightedRandomItemSampler` class implements a random sampler where the probability of selecting an item is proportional to its weight, with **replacement allowed** between samples. In other words, an item can be sampled more than once.

For example, given items [A, B] with respective weights [5, 12], the probability of sampling item B is 12/5 higher than the probability of sampling item A.

Weights must be positive numbers, and there are no restrictions on them being natural numbers. Floating point weights such as 0.95, 5.4, and 119.83 are also supported.

Use case examples include:
* __Distributed Systems__: The sampler can assist in distributing workloads among servers based on their capacities or current load, ensuring that more capable servers handle a greater number of tasks.
* __Surveys and Polls__: The sampler can be used to select participants based on demographic weights, ensuring a representative sample.
* __Attack Simulation__: Randomly select attack vectors for penetration testing based on their likelihood or impact.
* __ML Model Training__: Select training samples with weights based on their importance or difficulty to ensure diverse and balanced training data.

If your use case requires sampling each item **exactly once** without replacement, consider using [non-replacement-weighted-random-item-sampler](https://www.npmjs.com/package/non-replacement-weighted-random-item-sampler) can instead.

## Table of Contents :bookmark_tabs:

* [Key Features](#key-features)
* [API](#api)
* [Use Case Example: Training Samples for a ML model](#use-case-example)
* [Algorithm](#algorithm)
* [License](#license)

## Key Features :sparkles:<a id="key-features"></a>

- __Weighted Random Sampling :weight_lifting_woman:__: Sampling items with proportional probability to their weight.
- __With Replacement__: Items can be sampled multiple times.
- __Efficiency :gear:__: O(log(n)) time and O(1) space per sample, making this class suitable for performance-critical applications where the set of items is large and the sampling frequency is high.
- __Comprehensive documentation :books:__: The class is thoroughly documented, enabling IDEs to provide helpful tooltips that enhance the coding experience.
- __Tests :test_tube:__: Fully covered by unit tests.
- **TypeScript** support.
- No external runtime dependencies: Only development dependencies are used.
- ES2020 Compatibility: The `tsconfig` target is set to ES2020, ensuring compatibility with ES2020 environments.

## API :globe_with_meridians:<a id="api"></a>

The `WeightedRandomItemSampler` class provides the following method:

* __sample__: Randomly samples an item, with the probability of selecting a given item being proportional to its weight.

If needed, refer to the code documentation for a more comprehensive description.

## Use Case Example: Training Samples for a ML model :man_technologist:<a id="use-case-example"></a>

Consider a component responsible for selecting training-samples for a ML model. By assigning weights based on the importance or difficulty of each sample, we ensure a diverse and balanced training dataset.

```ts
import { WeightedRandomItemSampler } from 'weighted-random-item-sampler';

interface TrainingSampleData {
  // ...
}

interface TrainingSampleMetadata {
  importance: number; // Weight for sampling.
  // ...
}

interface TrainingSample {
  data: TrainingSampleData;
  metadata: TrainingSampleMetadata;
}

class ModelTrainer {
  private readonly _trainingSampler: WeightedRandomItemSampler<TrainingSample>;

  constructor(samples: ReadonlyArray<TrainingSample>) {
    this._trainingSampler = new WeightedRandomItemSampler(
      samples, // Items array.
      samples.map(sample => sample.metadata.importance) // Respective weights array.
    );
  }

  public selectTrainingSample(): TrainingSample {
    return this._trainingSampler.sample();
  }
}
```

## Algorithm :gear:<a id="algorithm"></a>

This section introduces a foundational algorithm, which will later be optimized. For simplicity, we assume all weights are natural numbers (1, 2, 3, ...). A plausible and efficient solution with **O(1)** time complexity and **O(weights sum)** space complexity involves allocating an array with a size equal to the sum of the weights. Each item is assigned to its corresponding number of cells based on its weight. For example, given items A and B with respective weights of 1 and 2, we would allocate one cell for item A and two cells for item B. This approach is valid when the number of items and their weights are relatively small. However, challenges arise when weights can be non-natural (e.g., 5.4, 0.23) or when the total weight sum is substantial, leading to significant memory overhead.

Next, we introduce an optimization over this basic idea. We calculate a **prefix sum** of the weights, treating each cell in the prefix sum array as denoting an **imaginary half-open range**. Using the previous example with items A and B (weights 1 and 2), the first range is denoted as [0, 1), while the second range is [1, 3). We can then randomly sample a number (not necessarily a natural number) within the total range [0, 3) and match it to its corresponding range index, which corresponds to a specific item. This random-to-interval matching can be performed in **O(log n)** time using a left-biased binary search to find the leftmost index i such that `randomPoint < prefix_sum[i]`. A key observation that enables this binary search is the monotonic ascending nature of the prefix sum array, as weights are necessarily positive.

## License :scroll:<a id="license"></a>

[Apache 2.0](LICENSE)

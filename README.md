<h2 align="middle">Weighted Random Item Sampler</h2>

The `WeightedRandomItemSampler` class implements a random sampler where the probability of selecting an item is proportional to its weight.

For example, given items [A, B] with respective weights [5, 12], the probability of sampling item B is 12/5 higher than the probability of sampling item A.

Weights must be positive numbers, and there are no restrictions on them being natural numbers. Floating point weights such as 0.95, 5.4, and 119.83 are also supported.

Use case examples include:
* __Distributed Systems__: The sampler can assist in distributing workloads among servers based on their capacities or current load, ensuring that more capable servers handle a greater number of tasks.
* __Surveys and Polls__: The sampler can be used to select participants based on demographic weights, ensuring a representative sample.
* __Attack Simulation__: Randomly select attack vectors for penetration testing based on their likelihood or impact.
* __Anomaly Detection__: Sample data points from a dataset with weights based on their anomaly scores for further analysis.
* __ML Model Training__: Select training samples with weights based on their importance or difficulty to ensure diverse and balanced training data.

## Key Features :sparkles:

- __Weighted Random Sampling__: Sampling items with proportional probability to their weight.
- __Efficiency :gear:__: O(log(n)) time and O(1) space per sample, making this class suitable for performance-demanding applications where the set of items is large and the sampling frequency is high.
- __Comprehensive documentation :books:__: The class is thoroughly documented, enabling IDEs to provide helpful tooltips that enhance the coding experience.
- __Tests__: Fully covered by unit tests.
- No external runtime dependencies: Only development dependencies are used.
- ES2020 Compatibility: The `tsconfig` target is set to ES2020, ensuring compatibility with ES2020 environments.
- TypeScript support.

## Use Case Example :man_technologist:

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

## License :scroll:

[Apache 2.0](LICENSE)

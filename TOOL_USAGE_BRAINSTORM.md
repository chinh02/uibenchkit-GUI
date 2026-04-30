# Tool Usage Brainstorm for WebBench Paper

## Core Problem
Your current `Tool Usage` section is accurate, but it reads too much like a summary of the architecture:

- select input
- choose model and method
- submit run
- render and evaluate
- inspect outputs

That overlaps heavily with Section II. For an ASE tool paper, the usage section usually works better when it answers:

- who uses the tool,
- what concrete task they are trying to accomplish,
- what they actually do with the interface or CLI,
- what artifact the tool returns,
- why this is useful in practice.

So instead of describing the pipeline again, this section should feel more like:

- a user journey,
- a demo script,
- or a short scenario-driven walkthrough.

## Better Directions

### Direction 1: Reproducible Benchmark Scenario
This is probably the strongest fit for your paper.

Frame the section around a researcher who wants to reproduce or extend prior work.

Good emphasis:

- selecting a benchmark dataset,
- choosing one method and one model,
- launching a run through CLI or API,
- monitoring execution,
- collecting a final report,
- comparing against prior leaderboard entries.

Why this works:

- it highlights the benchmark value of WebBench,
- it matches the tool-and-dataset spirit of ASE,
- it avoids repeating architectural internals.

Possible subsection title:

`A. Reproducing a Benchmark Run`

### Direction 2: Rapid Method Comparison Scenario
Frame the tool around comparative evaluation.

Example:

- a researcher wants to compare `dcgen` and `direct` on the same small subset,
- both runs are submitted with identical input conditions,
- WebBench returns comparable HTML outputs, screenshots, and metrics,
- the user inspects differences in both leaderboard metrics and rendered outputs.

Why this works:

- it makes the "unified execution framework" benefit visible,
- it shows why the tool matters beyond automation,
- it directly supports your contribution claim.

Possible subsection title:

`A. Comparing Methods Under a Unified Setting`

### Direction 3: Interactive Demonstration Scenario
This is best for the GUI subsection.

Frame the live demo as:

- upload one screenshot,
- choose a provider/model/method,
- inspect generated HTML and rendered screenshot,
- review metrics and download artifacts.

Why this works:

- concrete,
- easy for reviewers to visualize,
- pairs naturally with a screenshot figure.

Possible subsection title:

`B. Interactive Exploration via the Web Interface`

## Recommended Structure
I would recommend restructuring Section IV into:

### `IV. TOOL USAGE`

#### `A. Reproducing and Comparing Benchmark Runs`
Focus on CLI/API usage for experiment management.

#### `B. Interactive Exploration with the Web Interface`
Focus on the live demo and leaderboard.

This is better than `Proof-of-Concept Example` because your tool is not just a toy example runner. Its real strength is controlled benchmarking and comparison.

## What Section IV Should Not Repeat
Try not to restate these again:

- dataset manager standardizes inputs
- orchestrator manages run lifecycle
- model interface abstracts providers
- evaluation suite computes metrics

Those belong in Section II.

Instead, Section IV should show:

- what the user wants,
- what action they take,
- what output they get,
- what decision they can make from it.

## Candidate Angles for the Section

### Option A: Research Reproduction
Best if you want the tool to sound useful for researchers.

Key message:

> WebBench enables a researcher to reproduce a published design-to-code evaluation without reimplementing method-specific pipelines or metric scripts.

### Option B: Fair Comparison
Best if you want to stress the benchmark contribution.

Key message:

> WebBench enables side-by-side comparison of heterogeneous methods under one execution and evaluation setting.

### Option C: Demonstration and Accessibility
Best if you want to stress the demo-track angle.

Key message:

> WebBench lowers the barrier to entry by exposing the same backend workflow through an interactive interface.

## Stronger Content to Include
These are the details that make the usage section feel concrete rather than repetitive:

- the user can run on either a benchmark dataset or a custom folder,
- the user can choose among multiple methods and models without changing the rest of the workflow,
- the tool returns both artifacts and metrics,
- the tool supports iterative experiment management through polling, rerun, retry, and artifact retrieval,
- the GUI supports both qualitative inspection and quantitative comparison.

## Phrases Worth Using

- `reproduce a prior benchmark setting`
- `launch a controlled evaluation run`
- `compare methods under identical inputs and metrics`
- `inspect qualitative outputs alongside quantitative scores`
- `retrieve run artifacts for further analysis`
- `move from ad hoc experimentation to repeatable evaluation`

## Phrases to Avoid

- `the orchestrator dispatches jobs`
- `the model interface normalizes providers`
- `the dataset manager prepares files`

These are not wrong, but they belong in Section II and make Section IV feel repetitive.

## Draft Alternatives

### Version 1: Benchmark-Centric
Use this if you want the usage section to reinforce the benchmark contribution.

#### `A. Reproducing and Comparing Benchmark Runs`
WebBench is designed to support a common research workflow in which a user reproduces an existing design-to-code evaluation or compares several methods under a shared setting. A typical session begins by selecting a benchmark dataset, a generation method, and a target model. The user then launches the run through the CLI or REST API, which allows the same workflow to be embedded into scripts or executed interactively from the command line. During execution, WebBench exposes run status through polling interfaces and records intermediate artifacts, making it possible to monitor progress and recover from interrupted experiments.

After completion, the tool returns a consolidated report containing generated HTML outputs, rendered screenshots, token statistics, and evaluation scores. Because the same submission and reporting workflow is shared across all supported methods, the user can repeat this process with alternative methods or models and directly compare the resulting outputs under identical benchmark conditions. This usage mode is particularly useful for reproducing published baselines, testing newly added methods, and generating leaderboard-ready result files without reimplementing the surrounding infrastructure.

### Version 2: Comparison-Centric
Use this if you want a more direct "why the tool matters" tone.

#### `A. Comparing Methods Under a Unified Setting`
A central use case of WebBench is controlled comparison among design-to-code methods. For example, a researcher may wish to compare a decomposition-based method such as DCGen against a direct prompting baseline on the same subset of benchmark inputs. In WebBench, both runs can be launched through the same CLI or API interface by changing only the method and model parameters, while leaving the rest of the workflow unchanged. The tool then produces standardized artifacts and reports for each run, including generated code, rendered screenshots, token usage, and evaluation scores.

This usage pattern is valuable because it shifts effort away from one-off engineering glue code and toward actual empirical analysis. Rather than separately implementing preprocessing, rendering, and metric scripts for each method, the user can focus on interpreting differences in structural similarity, visual fidelity, fine-grained alignment, and computational overhead. As a result, WebBench supports a more repeatable and transparent form of experimental comparison.

### Version 3: Demo-Centric
Use this if reviewers care strongly about usability.

#### `B. Interactive Exploration with the Web Interface`
In addition to its programmatic interfaces, WebBench provides a web-based frontend for lightweight experimentation and result inspection. A user may upload either a single screenshot or a folder of benchmark-style inputs, select a provider, model, and generation method, and then launch a run directly from the browser. Once execution finishes, the interface presents the generated HTML, rendered screenshot, and evaluation scores together, enabling the user to inspect qualitative failures and quantitative outcomes in the same view.

This interface is especially useful for rapid exploration, demonstrations, and small-scale debugging runs. It allows users to quickly test how a given method behaves on a new design example before committing to a larger benchmark campaign. The same frontend also includes leaderboard views for browsing previously collected results, making it possible to move fluidly between interactive experimentation and aggregate comparison.

## Best Combined Version
If you want one polished Section IV, I would combine Version 1 and Version 3:

- Subsection A: benchmark reproduction and comparison through CLI/API
- Subsection B: interactive exploration through the web interface

That gives you one serious research-facing usage mode and one demo-facing usage mode.

## Suggested Rewrite for Your Paper

### `A. Reproducing and Comparing Benchmark Runs`
WebBench is intended to support a common research workflow in which a user reproduces a published evaluation or compares several design-to-code methods under a shared setting. The user begins by selecting either a benchmark dataset or a custom input folder, together with a target model and generation method, and then launches the run through the CLI or REST API. During execution, WebBench exposes run status through polling interfaces and records intermediate artifacts, allowing the user to monitor progress, recover interrupted runs, and retrieve final outputs in a uniform format.

Once the run completes, the tool returns a consolidated report containing generated HTML files, rendered screenshots, token statistics, and evaluation scores. Because this submission and reporting workflow is shared across all supported methods, the user can repeat the same procedure with different models or methods and directly compare the resulting outputs under identical benchmark conditions. In this way, WebBench is useful not only for single-run experimentation, but also for reproducible method comparison and leaderboard construction.

### `B. Interactive Exploration with the Web Interface`
To complement the programmatic workflow, WebBench also provides a web-based interface for interactive experimentation and result inspection. A user may upload a single screenshot or a folder of benchmark-style inputs, choose a provider, model, and generation method, and launch a run directly from the browser. After execution, the interface presents the generated HTML, rendered output, and evaluation metrics side by side, allowing users to inspect both qualitative behavior and quantitative performance within the same environment.

This interface is particularly useful for lightweight debugging, demonstration, and exploratory analysis. Users can quickly test how a method behaves on a new design example, inspect the returned artifacts, and download the results for further examination. In addition, the frontend includes leaderboard views for browsing benchmark results across methods and models, making the graphical interface a practical entry point for both live demonstration and comparative analysis.

## Shorter IEEE-Friendly Version
If space gets tight, use this instead.

### `A. Reproducing and Comparing Runs`
WebBench supports a research workflow in which a user launches a benchmark run through the CLI or REST API by specifying a dataset or custom input folder, a generation method, and a target model. The tool manages execution and returns a unified report containing generated HTML, rendered screenshots, token statistics, and evaluation metrics. Because the same interface is used across all supported methods, users can easily reproduce prior settings and compare alternative methods under identical conditions.

### `B. Interactive Exploration`
WebBench also provides a web interface for lightweight experimentation. Users can upload screenshots, select a provider, model, and method, and inspect generated outputs and evaluation results in one view. The interface additionally supports leaderboard browsing, making it suitable for both live demonstration and benchmark analysis.

## My Recommendation
For your current draft, the best move is:

1. rename subsection A from `A Proof-of-Concept Example` to `Reproducing and Comparing Benchmark Runs`
2. keep subsection B as `Graphical User Interface` or rename it to `Interactive Exploration with the Web Interface`
3. make Section IV about user workflows and outcomes, not internal pipeline steps

## If You Want To Push It Further
A particularly nice ASE-style framing would be:

> WebBench supports two complementary modes of use: a programmatic mode for reproducible benchmark execution and an interactive mode for exploratory testing and result inspection.

That sentence can become the opening line of Section IV.

# Example GitHub Repository Structure

This project fetches leaderboard data from a GitHub repository, similar to how SWE-bench works.

## Expected Repository Structure

Your GitHub repository should have the following structure:

```
your-repo/
├── benchmarks/
│   ├── interaction2code/
│   │   └── results.json
│   ├── mrweb/
│   │   └── results.json
│   ├── dcgen/
│   │   └── results.json
│   ├── design2code/
│   │   └── results.json
│   └── designbench/
│       └── results.json
└── evaluation/
    └── [benchmark]/
        └── [model]/
            └── results/
                └── results.json
```

## Example `results.json` Format

```json
{
  "name": "interaction2code",
  "lastUpdated": "2025-01-15T10:30:00Z",
  "results": [
    {
      "rank": 1,
      "model": "GPT-4o",
      "clip": "59.55%",
      "ssim": "44.88%",
      "text": "44.74%",
      "position": "52.25%",
      "ir": "81.28%",
      "overall": "55.98%",
      "date": "2025-01-10",
      "org": "OpenAI",
      "logo": ["https://example.com/openai-logo.png"],
      "tags": ["GPT", "Multimodal"]
    },
    {
      "rank": 2,
      "model": "Claude-3.5-Sonnet",
      "clip": "56.74%",
      "ssim": "42.09%",
      "text": "38.33%",
      "position": "51.23%",
      "ir": "79.14%",
      "overall": "54.42%",
      "date": "2025-01-08",
      "org": "Anthropic",
      "tags": ["Claude", "Multimodal"]
    }
  ]
}
```

## Configuration

Update the repository configuration in `client/lib/githubData.ts`:

```typescript
const DEFAULT_REPO = 'your-username/your-repo-name';
const DEFAULT_BRANCH = 'main';
```

## Usage Example

```typescript
import { useGitHubData } from '@/hooks/useGitHubData';
import { LeaderboardTable } from '@/components/LeaderboardTable';

function MyComponent() {
  const { data, loading, error, refetch } = useGitHubData('interaction2code');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <LeaderboardTable data={data?.results || []} />;
}
```

## Features

- ✅ Fetch data from GitHub raw content
- ✅ Sortable columns
- ✅ Filter by tags
- ✅ Automatic refresh
- ✅ Error handling
- ✅ TypeScript support

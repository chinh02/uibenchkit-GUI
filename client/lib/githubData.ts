/**
 * Fetch leaderboard data from GitHub repository
 * Similar to SWE-bench's mainResults.js implementation
 */

export interface LeaderboardEntry {
  rank: number;
  model: string;
  clip: string;
  ssim: string;
  text: string;
  position: string;
  ir: string;
  overall: string;
  date?: string;
  org?: string;
  logo?: string[];
  tags?: string[];
}

export interface LeaderboardData {
  name: string;
  results: LeaderboardEntry[];
  lastUpdated?: string;
}

// Example: Replace with your actual GitHub repo
const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com';
const DEFAULT_REPO = 'your-username/your-repo';
const DEFAULT_BRANCH = 'main';

/**
 * Fetch JSON data from GitHub repository
 * @param repoPath - Repository path (e.g., 'username/repo')
 * @param filePath - Path to file in repo (e.g., 'data/results.json')
 * @param branch - Branch name (default: 'main')
 */
export async function fetchGitHubData<T>(
  repoPath: string = DEFAULT_REPO,
  filePath: string = 'data/results.json',
  branch: string = DEFAULT_BRANCH
): Promise<T> {
  const url = `${GITHUB_RAW_BASE_URL}/${repoPath}/${branch}/${filePath}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}

/**
 * Fetch leaderboard results for a specific benchmark
 * @param benchmark - Benchmark name (e.g., 'interaction2code', 'mrweb')
 * @param repoPath - Optional custom repository path
 */
export async function fetchLeaderboardResults(
  benchmark: string,
  repoPath?: string
): Promise<LeaderboardData> {
  const filePath = `benchmarks/${benchmark}/results.json`;
  
  try {
    const data = await fetchGitHubData<LeaderboardData>(
      repoPath,
      filePath
    );
    return data;
  } catch (error) {
    console.error(`Error fetching ${benchmark} leaderboard:`, error);
    
    // Return empty data structure on error
    return {
      name: benchmark,
      results: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Fetch results for a specific model in a benchmark
 * Similar to SWE-bench's updateMainResults function
 * @param benchmark - Benchmark name
 * @param model - Model name
 * @param repoPath - Optional custom repository path
 */
export async function fetchModelResults(
  benchmark: string,
  model: string,
  repoPath?: string
): Promise<any> {
  const filePath = `evaluation/${benchmark}/${model}/results/results.json`;
  
  try {
    const data = await fetchGitHubData<any>(repoPath, filePath);
    return data;
  } catch (error) {
    console.error(`Error fetching results for ${model} on ${benchmark}:`, error);
    return null;
  }
}

/**
 * Calculate percentage resolved from results
 * @param resolved - Number of resolved instances
 * @param total - Total number of instances
 */
export function calculatePercentResolved(
  resolved: number,
  total: number
): string {
  if (total === 0) return '0.00';
  return ((resolved / total) * 100).toFixed(2);
}

/**
 * Sort leaderboard entries by a specific field
 */
export function sortLeaderboardEntries(
  entries: LeaderboardEntry[],
  field: keyof LeaderboardEntry,
  direction: 'asc' | 'desc' = 'desc'
): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    let aVal: any = a[field];
    let bVal: any = b[field];
    
    // Convert percentage strings to numbers for comparison
    if (typeof aVal === 'string' && aVal.includes('%')) {
      aVal = parseFloat(aVal.replace('%', ''));
      bVal = parseFloat(bVal.replace('%', ''));
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const strA = String(aVal).toLowerCase();
    const strB = String(bVal).toLowerCase();
    
    if (direction === 'asc') {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  });
}

/**
 * Filter leaderboard entries by tags
 */
export function filterByTags(
  entries: LeaderboardEntry[],
  tags: string[]
): LeaderboardEntry[] {
  if (tags.length === 0) return entries;
  
  return entries.filter(entry => {
    if (!entry.tags || entry.tags.length === 0) return false;
    return tags.some(tag => entry.tags?.includes(tag));
  });
}

/**
 * Get unique tags from leaderboard entries
 */
export function getUniqueTags(entries: LeaderboardEntry[]): string[] {
  const tagSet = new Set<string>();
  
  entries.forEach(entry => {
    if (entry.tags) {
      entry.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet).sort();
}

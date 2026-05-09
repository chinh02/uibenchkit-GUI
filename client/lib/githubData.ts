/**
 * Fetch leaderboard data from GitHub repository
 * Uses Express server proxy for private repo access
 */

/**
 * Leaderboard entry matching CSV columns:
 * dataset, method, model, code_similarity_avg, clip_avg, 
 * fg_block_match_avg, fg_text_avg, fg_position_avg, fg_color_avg, fg_clip_avg,
 * run_id, filename
 */
export interface LeaderboardEntry {
  rank: number;
  dataset: string;
  method: string;
  model: string;
  // Metrics (matching CSV columns)
  code_similarity: string;  // code_similarity_avg
  clip: string;             // clip_avg
  block_match: string;      // fg_block_match_avg
  text: string;             // fg_text_avg
  position: string;         // fg_position_avg
  color: string;            // fg_color_avg
  fg_clip: string;          // fg_clip_avg
  // All dataset metrics
  code_similarity_all?: string;
  clip_all?: string;
  block_match_all?: string;
  text_all?: string;
  position_all?: string;
  color_all?: string;
  fg_clip_all?: string;
  // New metrics
  vision_prompt_tokens_per_instance?: string | number;
  text_prompt_tokens_per_instance?: string | number;
  response_tokens_per_instance?: string | number;
  // Metadata
  run_id?: string;
  filename?: string;
  date?: string;
  model_date?: string;
  org?: string;
  logo?: string[];
  tags?: string[];
}

export interface LeaderboardData {
  name: string;
  results: LeaderboardEntry[];
  lastUpdated?: string;
}

// CSV column names from your data files
export const CSV_COLUMNS = [
  'dataset', 'method', 'model', 'code_similarity_avg', 'clip_avg',
  'fg_block_match_avg', 'fg_text_avg', 'fg_position_avg', 'fg_color_avg', 
  'fg_clip_avg', 'run_id', 'filename',
  'vision_prompt_tokens_per_instance', 'text_prompt_tokens_per_instance', 'response_tokens_per_instance'
] as const;

// Configuration for data fetching
const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com';
const DEFAULT_REPO = 'chinh02/uibenchkit-GUI';
const DEFAULT_BRANCH = 'main';

// Use Express proxy for private repos (served at /.netlify/functions/github-proxy)
const USE_PRIVATE_REPO = true;
const PROXY_ENDPOINT = '/.netlify/functions/github-proxy';

/**
 * Parse CSV text into LeaderboardEntry array
 * @param csvText - Raw CSV content
 * @param datasetName - Name of the dataset for filtering
 */
export function parseCSVToLeaderboard(csvText: string, datasetName?: string): LeaderboardEntry[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const entries: LeaderboardEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });

    // Filter by dataset if specified
    if (datasetName && row.dataset !== datasetName) continue;

    // Convert to LeaderboardEntry
    const entry: LeaderboardEntry = {
      rank: 0, // Will be calculated after sorting
      dataset: row.dataset || '',
      method: row.method || '',
      model: row.model || '',
      code_similarity: formatMetric(row.code_similarity_avg),
      clip: formatMetric(row.clip_avg),
      block_match: formatMetric(row.fg_block_match_avg),
      text: formatMetric(row.fg_text_avg),
      position: formatMetric(row.fg_position_avg),
      color: formatMetric(row.fg_color_avg),
      fg_clip: formatMetric(row.fg_clip_avg),
      run_id: row.run_id,
      filename: row.filename,
    };

    // Derive organization from model name
    entry.org = deriveOrganization(entry.model);
    entry.tags = deriveTags(entry.model, entry.method);

    entries.push(entry);
  }

  // Sort by CLIP score (descending) and assign ranks
  entries.sort((a, b) => {
    const aClip = parseFloat(a.clip) || 0;
    const bClip = parseFloat(b.clip) || 0;
    return bClip - aClip;
  });

  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return entries;
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Format a metric value as percentage string
 */
function formatMetric(value: string | undefined): string {
  if (!value || value === '' || value === 'undefined') return '-';
  const num = parseFloat(value);
  if (isNaN(num)) return '-';
  // If value is already a decimal (0-1 range), multiply by 100
  if (num <= 1) {
    return `${(num * 100).toFixed(2)}%`;
  }
  return `${num.toFixed(2)}%`;
}

/**
 * Derive organization from model name
 */
function deriveOrganization(model: string): string {
  const modelLower = model.toLowerCase();
  if (modelLower.includes('gpt')) return 'OpenAI';
  if (modelLower.includes('claude')) return 'Anthropic';
  if (modelLower.includes('gemini')) return 'Google';
  if (modelLower.includes('doubao')) return 'ByteDance';
  if (modelLower.includes('qwen')) return 'Alibaba';
  if (modelLower.includes('llama')) return 'Meta';
  return 'Unknown';
}

/**
 * Derive tags from model and method
 */
function deriveTags(model: string, method: string): string[] {
  const tags: string[] = [];
  const modelLower = model.toLowerCase();
  
  if (method) tags.push(method);
  if (modelLower.includes('gpt')) tags.push('GPT');
  if (modelLower.includes('claude')) tags.push('Claude');
  if (modelLower.includes('gemini')) tags.push('Gemini');
  if (modelLower.includes('flash')) tags.push('Fast');
  if (modelLower.includes('pro')) tags.push('Pro');
  
  return tags;
}

/**
 * Fetch data from private GitHub repo via Netlify proxy
 * @param filePath - Path to file in repo
 * @param branch - Branch name (default: 'main')
 */
export async function fetchPrivateRepoData<T>(
  filePath: string,
  branch: string = DEFAULT_BRANCH
): Promise<T> {
  const url = `${PROXY_ENDPOINT}?filePath=${encodeURIComponent(filePath)}&branch=${encodeURIComponent(branch)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch: ${response.status}`);
    }
    
    // Check if CSV or JSON
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || filePath.endsWith('.csv')) {
      const csvText = await response.text();
      return csvText as unknown as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from private repo:', error);
    throw error;
  }
}

/**
 * Fetch JSON data from GitHub repository (public or private)
 * @param repoPath - Repository path (e.g., 'username/repo') - only used for public repos
 * @param filePath - Path to file in repo (e.g., 'data/results.json')
 * @param branch - Branch name (default: 'main')
 */
export async function fetchGitHubData<T>(
  repoPath: string = DEFAULT_REPO,
  filePath: string = 'data/results.json',
  branch: string = DEFAULT_BRANCH
): Promise<T> {
  // Use proxy for private repos
  if (USE_PRIVATE_REPO) {
    return fetchPrivateRepoData<T>(filePath, branch);
  }

  // Public repo - direct fetch
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
  // Try CSV format first (matching your data structure in uibenchkit-GUI repo)
  const csvFilePath = `leaderboard/comparison_${benchmark}.csv`;
  
  try {
    // Fetch CSV data
    const csvText = await fetchGitHubData<string>(
      repoPath,
      csvFilePath
    );
    
    // Parse CSV to leaderboard entries
    const results = parseCSVToLeaderboard(csvText, benchmark);
    
    return {
      name: benchmark,
      results,
      lastUpdated: new Date().toISOString()
    };
  } catch (csvError) {
    console.log(`CSV fetch failed for ${benchmark}, trying JSON...`);
    
    // Fallback to JSON format
    const jsonFilePath = `leaderboard/${benchmark}-results.json`;
    try {
      const data = await fetchGitHubData<LeaderboardData>(
        repoPath,
        jsonFilePath
      );
      return data;
    } catch (jsonError) {
      console.error(`Error fetching ${benchmark} leaderboard:`, jsonError);
      
      // Return empty data structure on error
      return {
        name: benchmark,
        results: [],
        lastUpdated: new Date().toISOString()
      };
    }
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

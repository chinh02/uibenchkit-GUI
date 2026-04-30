import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Play,
  Loader2,
  Image as ImageIcon,
  Code,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Download,
  ChevronDown,
  FileCode2,
  FolderOpen,
  File,
  FileImage,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Globe,
} from "lucide-react";
import type {
  DCGenSubmitResponse,
  DCGenPollResponse,
  DCGenReportResponse,
  DCGenHealthResponse,
  DCGenStopRunResponse,
} from "@shared/api";

type DemoStage =
  | "idle"
  | "uploading"
  | "processing"
  | "stopping"
  | "stopped"
  | "completed"
  | "error";

type UploadMode = "single" | "folder";

interface UploadedFile {
  path: string;
  name: string;
  type: "image" | "html" | "css" | "other";
  size: number;
  /** base64-encoded content (no data-url prefix) */
  content: string;
  /** Data URL for preview (images only) */
  previewUrl?: string;
}

interface InstanceResult {
  instanceId: string;
  status: "completed" | "failed";
  html: string;
  screenshotBase64: string | null;
  error?: string | null;
}

interface DemoResult {
  runId: string;
  instances: InstanceResult[];
  report: DCGenReportResponse["report"] | null;
  /** Maps instanceId -> data URL of the original uploaded image */
  inputImages: Record<string, string>;
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const IMAGE_EXTS = /\.(png|jpe?g|gif|bmp|webp|svg|tiff?)$/i;
const HTML_EXTS = /\.(html?|htm)$/i;
const CSS_EXTS = /\.css$/i;

function classifyFile(name: string): UploadedFile["type"] {
  if (IMAGE_EXTS.test(name)) return "image";
  if (HTML_EXTS.test(name)) return "html";
  if (CSS_EXTS.test(name)) return "css";
  return "other";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function LiveDemo() {
  // â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [stage, setStage] = useState<DemoStage>("idle");
  const [uploadMode, setUploadMode] = useState<UploadMode>("single");

  // Single-image mode
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Folder mode
  const [folderFiles, setFolderFiles] = useState<UploadedFile[]>([]);
  const [folderName, setFolderName] = useState<string | null>(null);

  // Provider & model
  type Provider = "openai" | "claude" | "gemini" | "openkey" | "other";
  const [provider, setProvider] = useState<Provider>("gemini");
  const [modelVersion, setModelVersion] = useState("gemini-2.0-flash");
  const [customModelName, setCustomModelName] = useState("");
  const [fetchedModels, setFetchedModels] = useState<string[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);

  // Shared
  const [method, setMethod] = useState("dcgen");
  const [referenceHtml, setReferenceHtml] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [userBaseUrl, setUserBaseUrl] = useState("");
  const [referenceHtmlOpen, setReferenceHtmlOpen] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [activeInstanceIdx, setActiveInstanceIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<DCGenPollResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloadingArtifacts, setDownloadingArtifacts] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [stoppingRun, setStoppingRun] = useState(false);
  const [stopMessage, setStopMessage] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [supportedMethods, setSupportedMethods] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const refHtmlInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Snapshot of input images captured at submit time (avoids stale closures in polling) */
  const inputImagesRef = useRef<Record<string, string>>({});

  // â”€â”€ Restore persisted results on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("dcgen-demo-result");
      if (saved) {
        const parsed = JSON.parse(saved) as DemoResult;
        setResult(parsed);
        setStage("completed");
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // â”€â”€ Persist results to sessionStorage when they change â”€
  useEffect(() => {
    if (result && stage === "completed") {
      try {
        sessionStorage.setItem("dcgen-demo-result", JSON.stringify(result));
      } catch {
        // sessionStorage may be full for very large results - ignore
      }
    }
  }, [result, stage]);

  // â”€â”€ Health check on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    fetch("/api/dcgen/health")
      .then((r) => r.json())
      .then((data: DCGenHealthResponse) => {
        setApiHealthy(data.status === "healthy");
        if (data.supported_methods) {
          setSupportedMethods(data.supported_methods);
        }
      })
      .catch(() => setApiHealthy(false));
  }, []);

  // â”€â”€ Provider change handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleProviderChange = useCallback(
    (p: Provider) => {
      setProvider(p);
      setFetchedModels([]);
      setUserApiKey("");
      setUserBaseUrl("");
      setCustomModelName("");
      // Pre-fill base_url for OpenKey
      if (p === "openkey") setUserBaseUrl("https://openkey.cloud/v1");
    },
    [],
  );

  // â”€â”€ Fetch models from provider API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleFetchModels = useCallback(async () => {
    if (!userApiKey.trim()) return;
    setFetchingModels(true);
    try {
      const resp = await fetch("/api/dcgen/list-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          api_key: userApiKey.trim(),
          ...(userBaseUrl.trim() ? { base_url: userBaseUrl.trim() } : {}),
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Failed to fetch models");
      }
      const data = (await resp.json()) as { models: string[] };
      setFetchedModels(data.models);
      if (data.models.length > 0) setModelVersion(data.models[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
    } finally {
      setFetchingModels(false);
    }
  }, [provider, userApiKey, userBaseUrl]);

  // â”€â”€ Cleanup polling on unmount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // â”€â”€ Single-image file handling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (PNG, JPG, etc.)");
        return;
      }
      setImageFile(file);
      setError(null);
      setResult(null);
      setStage("idle");

      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (uploadMode === "folder") {
        // Handle dropped folder / multiple files
        handleDroppedItems(e.dataTransfer);
        return;
      }

      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) {
        setError("Please drop an image file (PNG, JPG, etc.)");
        return;
      }
      setImageFile(file);
      setError(null);
      setResult(null);
      setStage("idle");

      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    [uploadMode]
  );

  // â”€â”€ Folder handling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const processFileList = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    setError(null);
    setResult(null);
    setStage("idle");

    // Determine folder name from the first file's webkitRelativePath
    const first = arr[0] as File & { webkitRelativePath?: string };
    if (first.webkitRelativePath) {
      const parts = first.webkitRelativePath.split("/");
      if (parts.length > 1) setFolderName(parts[0]);
    } else {
      setFolderName("Uploaded files");
    }

    const processed: UploadedFile[] = [];
    for (const file of arr) {
      const relativePath =
        (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
        file.name;
      const type = classifyFile(file.name);

      // Skip very large files (>20MB) and hidden files
      if (file.size > 20 * 1024 * 1024) continue;
      if (file.name.startsWith(".")) continue;

      const content = await fileToBase64(file);
      const entry: UploadedFile = {
        path: relativePath,
        name: file.name,
        type,
        size: file.size,
        content,
      };

      if (type === "image") {
        entry.previewUrl = await fileToDataUrl(file);
      }

      processed.push(entry);
    }

    setFolderFiles(processed);
  }, []);

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFileList(e.target.files);
    },
    [processFileList]
  );

  const handleDroppedItems = useCallback(
    async (dt: DataTransfer) => {
      // Prefer using items API for folder traversal
      if (dt.items && dt.items.length > 0) {
        const allFiles: File[] = [];

        const traverseEntry = (entry: FileSystemEntry): Promise<void> => {
          return new Promise((resolve) => {
            if (entry.isFile) {
              (entry as FileSystemFileEntry).file((f) => {
                // Patch relative path from fullPath
                Object.defineProperty(f, "webkitRelativePath", {
                  value: entry.fullPath.replace(/^\//, ""),
                });
                allFiles.push(f);
                resolve();
              });
            } else if (entry.isDirectory) {
              const reader = (
                entry as FileSystemDirectoryEntry
              ).createReader();
              reader.readEntries(async (entries) => {
                for (const e of entries) {
                  await traverseEntry(e);
                }
                resolve();
              });
            } else {
              resolve();
            }
          });
        };

        const promises: Promise<void>[] = [];
        for (let i = 0; i < dt.items.length; i++) {
          const entry = dt.items[i].webkitGetAsEntry?.();
          if (entry) promises.push(traverseEntry(entry));
        }
        await Promise.all(promises);

        if (allFiles.length > 0) {
          await processFileList(allFiles);
        }
      } else if (dt.files.length > 0) {
        await processFileList(dt.files);
      }
    },
    [processFileList]
  );

  // â”€â”€ Poll for job completion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const startPolling = useCallback((runId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const resp = await fetch(
          `/api/dcgen/poll?run_id=${encodeURIComponent(runId)}`
        );
        if (!resp.ok) return;

        const data: DCGenPollResponse = await resp.json();
        setPollStatus(data);

        if (
          data.status === "completed" ||
          data.status === "failed" ||
          data.status === "stopped"
        ) {
          clearInterval(pollIntervalRef.current!);
          pollIntervalRef.current = null;

          if (data.status === "completed") {
            setCurrentRunId(null);
            await fetchResults(runId, data);
          } else if (data.status === "stopped") {
            setResult(null);
            sessionStorage.removeItem("dcgen-demo-result");
            setStopMessage(
              `Run ${runId} was stopped. The in-flight image may have finished before cancellation took effect.`
            );
            setStage("stopped");
            setCurrentRunId(null);
          } else {
            // Run-level failure - clear any stale result from a previous run
            setResult(null);
            sessionStorage.removeItem("dcgen-demo-result");
            setStage("error");
            setCurrentRunId(null);
            setError(
              `Run ${data.status}. Check WebBench server logs for details.`
            );
          }
        }
      } catch {
        // Silently retry on network errors during polling
      }
    }, 3000);
  }, []);

  // â”€â”€ Fetch results after completion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchResults = async (runId: string, poll: DCGenPollResponse) => {
    try {
      // Get the report
      const reportResp = await fetch("/api/dcgen/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: runId }),
      });
      const reportData: DCGenReportResponse = await reportResp.json();

      // Fetch results for ALL completed instances
      const instanceResults: InstanceResult[] = [];

      for (const instanceId of poll.completed) {
        try {
          const htmlResp = await fetch(
            `/api/dcgen/result-html/${encodeURIComponent(runId)}/${encodeURIComponent(instanceId)}`
          );
          const htmlData = await htmlResp.json();

          let screenshotBase64: string | null = null;
          try {
            const imgResp = await fetch(
              `/api/dcgen/result-image/${encodeURIComponent(runId)}/${encodeURIComponent(instanceId)}`
            );
            if (imgResp.ok) {
              const imgData = await imgResp.json();
              screenshotBase64 = imgData.image;
            }
          } catch {
            // Screenshot may not be available
          }

          instanceResults.push({
            instanceId,
            status: "completed",
            html: htmlData.html || "",
            screenshotBase64,
          });
        } catch {
          // Skip failed instance result fetches
        }
      }

      // Include failed instances with their error messages
      for (const instanceId of poll.failed) {
        const errorMsg =
          poll.failed_details?.[instanceId] ||
          (reportData.report?.results?.instances?.[instanceId] as any)?.error ||
          "Generation failed - check WebBench server logs for details.";
        instanceResults.push({
          instanceId,
          status: "failed",
          html: "",
          screenshotBase64: null,
          error: errorMsg,
        });
      }

      if (instanceResults.length === 0) {
        setStage("error");
        setError("Run completed but no instance results were found.");
        return;
      }

      setResult({
        runId,
        instances: instanceResults,
        report: reportData.report,
        inputImages: inputImagesRef.current,
      });
      setActiveInstanceIdx(0);
      setStage("completed");
    } catch (err) {
      setStage("error");
      setError(`Failed to fetch results: ${String(err)}`);
    }
  };

  // â”€â”€ Derive effective model + credentials from provider state â”€
  const getSubmitCredentials = () => {
    let model: string;
    let apiKey: string | undefined;
    let baseUrl: string | undefined;

    if (provider === "other") {
      model = customModelName.trim();
      apiKey = userApiKey.trim() || undefined;
      baseUrl = userBaseUrl.trim() || undefined;
    } else {
      // openai, claude, gemini, openkey
      model = modelVersion;
      apiKey = userApiKey.trim() || undefined;
      // Only send base_url for proxy-based providers
      if (provider === "openkey") {
        baseUrl = userBaseUrl.trim() || undefined;
      }
    }

    return { model, apiKey, baseUrl };
  };

  // â”€â”€ Submit (single image) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSubmitSingle = async () => {
    if (!imageFile) {
      setError("Please select an image first");
      return;
    }

    setStage("uploading");
    setError(null);
    setResult(null);
    setPollStatus(null);
    setCurrentRunId(null);
    setStopMessage(null);
    setStoppingRun(false);
    sessionStorage.removeItem("dcgen-demo-result");

    // Snapshot input image for comparison (before closure goes stale)
    inputImagesRef.current = imagePreview ? { input: imagePreview } : {};

    try {
      const base64 = await fileToBase64(imageFile);

      setStage("processing");

      const creds = getSubmitCredentials();
      const resp = await fetch("/api/dcgen/upload-and-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          model: creds.model,
          method,
          ...(referenceHtml.trim()
            ? { reference_html: referenceHtml.trim() }
            : {}),
          ...(creds.apiKey ? { user_api_key: creds.apiKey } : {}),
          ...(creds.baseUrl ? { user_base_url: creds.baseUrl } : {}),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Submission failed");
      }

      const data: DCGenSubmitResponse = await resp.json();

      if (!data.launched && !data.run_id) {
        throw new Error(data.message || "Failed to launch run");
      }

      setCurrentRunId(data.run_id);
      startPolling(data.run_id);
    } catch (err) {
      setStage("error");
      setCurrentRunId(null);
      setError(String(err instanceof Error ? err.message : err));
    }
  };

  // â”€â”€ Submit (folder) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSubmitFolder = async () => {
    const images = folderFiles.filter((f) => f.type === "image");
    if (images.length === 0) {
      setError("No image files found in the uploaded folder");
      return;
    }

    setStage("uploading");
    setError(null);
    setResult(null);
    setPollStatus(null);
    setCurrentRunId(null);
    setStopMessage(null);
    setStoppingRun(false);
    sessionStorage.removeItem("dcgen-demo-result");

    // Snapshot input images for comparison (before closure goes stale)
    const map: Record<string, string> = {};
    for (const f of folderFiles) {
      if (f.type === "image" && f.previewUrl) {
        const stem = f.name.replace(/\.(png|jpe?g|gif|bmp|webp|svg|tiff?)$/i, "");
        map[stem] = f.previewUrl;
      }
    }
    inputImagesRef.current = map;

    try {
      setStage("processing");

      const creds = getSubmitCredentials();
      const payload = {
        files: folderFiles.map((f) => ({
          path: f.path,
          content: f.content,
          type: f.type,
        })),
        model: creds.model,
        method,
        ...(creds.apiKey ? { user_api_key: creds.apiKey } : {}),
        ...(creds.baseUrl ? { user_base_url: creds.baseUrl } : {}),
      };

      const resp = await fetch("/api/dcgen/upload-folder-and-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || "Submission failed");
      }

      const data: DCGenSubmitResponse = await resp.json();

      if (!data.launched && !data.run_id) {
        throw new Error(data.message || "Failed to launch run");
      }

      setCurrentRunId(data.run_id);
      startPolling(data.run_id);
    } catch (err) {
      setStage("error");
      setCurrentRunId(null);
      setError(String(err instanceof Error ? err.message : err));
    }
  };

  const handleSubmit = uploadMode === "single" ? handleSubmitSingle : handleSubmitFolder;

  // â”€â”€ Copy HTML to clipboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCopyHtml = () => {
    const inst = result?.instances[activeInstanceIdx];
    if (!inst?.html) return;
    navigator.clipboard.writeText(inst.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // â”€â”€ Download helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const downloadFile = (content: string | Blob, filename: string, mime = "text/html") => {
    const blob = typeof content === "string" ? new Blob([content], { type: mime }) : content;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadScreenshot = (inst: InstanceResult) => {
    if (!inst.screenshotBase64) return;
    const byteChars = atob(inst.screenshotBase64);
    const byteArray = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
    downloadFile(new Blob([byteArray], { type: "image/png" }), `${inst.instanceId}.png`, "image/png");
  };

  const getDownloadFilename = (
    contentDisposition: string | null,
    fallback: string
  ) => {
    if (!contentDisposition) return fallback;

    const utf8Match = contentDisposition.match(
      /filename\*\s*=\s*UTF-8''([^;]+)/i
    );
    if (utf8Match?.[1]) {
      try {
        return decodeURIComponent(utf8Match[1].trim().replace(/["']/g, ""));
      } catch {
        return utf8Match[1].trim().replace(/["']/g, "");
      }
    }

    const plainMatch = contentDisposition.match(
      /filename\s*=\s*("?)([^";]+)\1/i
    );
    if (plainMatch?.[2]) return plainMatch[2].trim();

    return fallback;
  };

  const handleDownloadArtifacts = async () => {
    if (!result?.runId || downloadingArtifacts) return;

    setDownloadingArtifacts(true);
    setError(null);

    try {
      const resp = await fetch(
        `/api/dcgen/download-artifacts/${encodeURIComponent(result.runId)}`
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || "Failed to download artifacts");
      }

      const blob = await resp.blob();
      const filename = getDownloadFilename(
        resp.headers.get("content-disposition"),
        `${result.runId}_artifacts.zip`
      );
      downloadFile(blob, filename, "application/zip");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download artifacts");
    } finally {
      setDownloadingArtifacts(false);
    }
  };

  const handleStopRun = async () => {
    if (!currentRunId) {
      setError("No active run is available to stop yet.");
      return;
    }

    const runId = currentRunId;
    setStoppingRun(true);
    setStage("stopping");
    setError(null);
    setStopMessage(null);

    try {
      const resp = await fetch("/api/dcgen/stop-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run_id: runId }),
      });
      const data = (await resp.json().catch(() => ({}))) as Partial<DCGenStopRunResponse>;

      if (!resp.ok) {
        throw new Error(data.message || "Failed to stop run");
      }

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      setCurrentRunId(null);
      setPollStatus(null);
      setResult(null);
      sessionStorage.removeItem("dcgen-demo-result");
      setStopMessage(
        data.message ||
          `Run ${runId} was stopped. The current in-flight image may finish before cancellation fully takes effect.`
      );
      setStage("stopped");
    } catch (err) {
      setStage("processing");
      setError(err instanceof Error ? err.message : "Failed to stop run");
    } finally {
      setStoppingRun(false);
    }
  };

  // â”€â”€ Reset â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleReset = () => {
    setStage("idle");
    setImagePreview(null);
    setImageFile(null);
    setFolderFiles([]);
    setFolderName(null);
    setResult(null);
    setActiveInstanceIdx(0);
    setError(null);
    setPollStatus(null);
    setCurrentRunId(null);
    setStoppingRun(false);
    setStopMessage(null);
    setReferenceHtml("");
    setReferenceHtmlOpen(false);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
    if (refHtmlInputRef.current) refHtmlInputRef.current.value = "";
    sessionStorage.removeItem("dcgen-demo-result");
  };

  // â”€â”€ Derived state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const isProcessing = stage === "uploading" || stage === "processing";
  const isBusy = isProcessing || stage === "stopping";
  const hasValidModel =
    provider === "other" ? !!(customModelName.trim() && userApiKey.trim() && userBaseUrl.trim()) :
    provider === "openkey" ? !!(userApiKey.trim() && userBaseUrl.trim() && fetchedModels.length > 0) :
    !!(userApiKey.trim() && fetchedModels.length > 0);
  const canSubmitSingle = !!imageFile && !isBusy && apiHealthy && hasValidModel;
  const canSubmitFolder =
    folderFiles.filter((f) => f.type === "image").length > 0 &&
    !isBusy &&
    apiHealthy &&
    hasValidModel;
  const canSubmit = uploadMode === "single" ? canSubmitSingle : canSubmitFolder;

  const progressPercent =
    pollStatus && pollStatus.completed
      ? Math.round(
          (pollStatus.completed.length /
            Math.max(
              pollStatus.completed.length +
                pollStatus.pending.length +
                pollStatus.running.length +
                pollStatus.failed.length,
              1
            )) *
            100
        )
      : 0;

  const activeInstance = result?.instances[activeInstanceIdx] ?? null;

  const folderImageCount = folderFiles.filter((f) => f.type === "image").length;
  const folderHtmlCount = folderFiles.filter((f) => f.type === "html").length;
  const folderCssCount = folderFiles.filter((f) => f.type === "css").length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <div className="lg:ml-64 pt-28 pb-12 min-w-0">
        <main className="flex justify-center">
          <div className="w-full max-w-6xl px-8 lg:px-12">
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* â”€â”€â”€ Introduction Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-xl border border-amber-200 bg-white/70">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                  <Sparkles
                    className="w-5 h-5 text-amber-600"
                    strokeWidth={1.67}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="text-amber-700 font-bold text-base sm:text-lg leading-7">
                    Live Demo - Image to HTML Code
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                    Upload a screenshot or an{" "}
                    <strong>entire folder of images &amp; HTML/CSS</strong>,
                    select a model and method, and watch WebBench automatically
                    generate HTML + Tailwind CSS code. This demo connects to the
                    WebBench backend to run the full pipeline: image
                    segmentation, code generation, assembly, and evaluation.
                  </p>
                  {/* API status badge */}
                  <div className="mt-2">
                    {apiHealthy === null ? (
                      <Badge variant="outline" className="gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Checking API...
                      </Badge>
                    ) : apiHealthy ? (
                      <Badge className="gap-1.5 bg-green-100 text-green-700 border-green-300 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3" />
                        WebBench API Connected
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1.5">
                        <XCircle className="w-3 h-3" />
                        WebBench API Offline - Start the server at port 5000
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* â”€â”€â”€ Main Demo Area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* â”€â”€ LEFT: Input Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-600" />
                    Input
                  </h3>

                  {/* Upload mode toggle */}
                  <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setUploadMode("single")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        uploadMode === "single"
                          ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Single Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("folder")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        uploadMode === "folder"
                          ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FolderOpen className="w-4 h-4" />
                      Folder Upload
                    </button>
                  </div>

                  {/* â”€â”€ Single image drop zone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                  {uploadMode === "single" && (
                    <>
                      <div
                        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer min-h-[300px] flex items-center justify-center ${
                          imagePreview
                            ? "border-amber-300 bg-amber-50/30"
                            : "border-gray-300 bg-white/50 hover:border-amber-400 hover:bg-amber-50/20"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Input screenshot"
                            className="max-w-full max-h-[400px] rounded-lg object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400 p-8">
                            <ImageIcon
                              className="w-12 h-12"
                              strokeWidth={1}
                            />
                            <p className="text-sm font-medium">
                              Drop a webpage screenshot here
                            </p>
                            <p className="text-xs text-gray-400">
                              or click to browse - PNG, JPG supported
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Optional: Reference HTML for full evaluation */}
                      <Collapsible
                        open={referenceHtmlOpen}
                        onOpenChange={setReferenceHtmlOpen}
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed border-gray-300 bg-white/60 hover:bg-amber-50/40 hover:border-amber-300 transition-colors text-left group"
                          >
                            <FileCode2 className="w-4 h-4 text-gray-400 group-hover:text-amber-600 flex-shrink-0" />
                            <span className="text-sm text-text-secondary group-hover:text-amber-700 flex-1">
                              Provide original HTML{" "}
                              <span className="text-xs text-gray-400">
                                (optional - enables code similarity &amp;
                                fine-grained metrics)
                              </span>
                            </span>
                            {referenceHtml.trim() && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-5 bg-green-50 border-green-200 text-green-700"
                              >
                                Provided
                              </Badge>
                            )}
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                referenceHtmlOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="relative rounded-xl border border-gray-200 bg-white overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                                Reference HTML
                              </span>
                              <div className="flex items-center gap-2">
                                <input
                                  ref={refHtmlInputRef}
                                  type="file"
                                  accept=".html,.htm"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      const text = ev.target?.result;
                                      if (typeof text === "string") {
                                        setReferenceHtml(text);
                                      }
                                    };
                                    reader.readAsText(file);
                                    e.target.value = "";
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    refHtmlInputRef.current?.click()
                                  }
                                  className="flex items-center gap-1 text-[11px] text-amber-600 hover:text-amber-700 transition-colors font-medium"
                                >
                                  <Upload className="w-3 h-3" />
                                  Upload .html file
                                </button>
                                {referenceHtml.trim() && (
                                  <button
                                    type="button"
                                    onClick={() => setReferenceHtml("")}
                                    className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={referenceHtml}
                              onChange={(e) => setReferenceHtml(e.target.value)}
                              placeholder={`Paste the ground-truth HTML source here, or click "Upload .html file" above.\n\nThis enables the evaluation pipeline to compute:\n  - Code similarity (fuzzy match)\n  - Fine-grained metrics (block match, text, position, color)`}
                              className="w-full h-48 px-3 py-2 text-xs font-mono leading-relaxed resize-y bg-white text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                              spellCheck={false}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  )}

                  {/* â”€â”€ Folder drop zone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                  {uploadMode === "folder" && (
                    <>
                      <div
                        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer min-h-[200px] flex items-center justify-center ${
                          folderFiles.length > 0
                            ? "border-amber-300 bg-amber-50/30"
                            : "border-gray-300 bg-white/50 hover:border-amber-400 hover:bg-amber-50/20"
                        }`}
                        onClick={() => folderInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <input
                          ref={folderInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFolderSelect}
                          {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
                        />
                        {folderFiles.length > 0 ? (
                          <div className="flex flex-col items-center gap-2 p-4 text-center">
                            <FolderOpen className="w-10 h-10 text-amber-500" />
                            <p className="text-sm font-semibold text-amber-700">
                              {folderName}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Badge
                                variant="outline"
                                className="gap-1 bg-blue-50 border-blue-200 text-blue-700"
                              >
                                <FileImage className="w-3 h-3" />
                                {folderImageCount} image
                                {folderImageCount !== 1 && "s"}
                              </Badge>
                              {folderHtmlCount > 0 && (
                                <Badge
                                  variant="outline"
                                  className="gap-1 bg-green-50 border-green-200 text-green-700"
                                >
                                  <FileCode2 className="w-3 h-3" />
                                  {folderHtmlCount} HTML
                                </Badge>
                              )}
                              {folderCssCount > 0 && (
                                <Badge
                                  variant="outline"
                                  className="gap-1 bg-purple-50 border-purple-200 text-purple-700"
                                >
                                  <File className="w-3 h-3" />
                                  {folderCssCount} CSS
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Click or drop to replace
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400 p-8">
                            <FolderOpen
                              className="w-12 h-12"
                              strokeWidth={1}
                            />
                            <p className="text-sm font-medium">
                              Drop a folder here or click to browse
                            </p>
                            <p className="text-xs text-gray-400 text-center max-w-xs">
                              Upload a folder containing images (PNG/JPG) and
                              optionally matching HTML/CSS files for evaluation
                            </p>
                          </div>
                        )}
                      </div>

                      {/* File list */}
                      {folderFiles.length > 0 && (
                        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                              Files ({folderFiles.length})
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {humanFileSize(
                                folderFiles.reduce(
                                  (acc, f) => acc + f.size,
                                  0
                                )
                              )}{" "}
                              total
                            </span>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-100">
                            {folderFiles.map((f, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 px-3 py-1.5 text-xs hover:bg-gray-50"
                              >
                                {f.type === "image" ? (
                                  <FileImage className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                ) : f.type === "html" ? (
                                  <FileCode2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <File className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                )}
                                <span className="text-gray-700 truncate flex-1 font-mono">
                                  {f.path}
                                </span>
                                <span className="text-gray-400 flex-shrink-0">
                                  {humanFileSize(f.size)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Folder mode info */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            How folder upload works
                          </p>
                          <p className="mt-1 text-blue-600 leading-relaxed">
                            Each image (PNG/JPG) becomes a separate test
                            instance. If an HTML file shares the same name as an
                            image (e.g.{" "}
                            <code className="bg-blue-100 px-1 rounded">
                              page1.png
                            </code>{" "}
                            +{" "}
                            <code className="bg-blue-100 px-1 rounded">
                              page1.html
                            </code>
                            ), it serves as the reference for evaluation metrics.
                            CSS files are included as assets.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Provider & Method selectors */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wider">
                        Provider
                      </label>
                      <Select value={provider} onValueChange={(v) => handleProviderChange(v as Provider)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                          <SelectItem value="gemini">Gemini (Google)</SelectItem>
                          <SelectItem value="openkey">OpenKey</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wider">
                        Method
                      </label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(supportedMethods.length > 0
                            ? supportedMethods
                            : ["dcgen", "direct"]
                          ).map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Credentials & model selection */}
                  <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                      {/* API Key */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                          <KeyRound className="w-3 h-3" />
                          API Key
                        </label>
                        <input
                          type="password"
                          value={userApiKey}
                          onChange={(e) => setUserApiKey(e.target.value)}
                          placeholder={
                            provider === "openai" ? "sk-..." :
                            provider === "claude" ? "sk-ant-..." :
                            provider === "gemini" ? "AIza..." :
                            "Your API key"
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 font-mono placeholder:text-gray-300"
                        />
                      </div>

                      {/* Base URL - shown for openkey and other */}
                      {(provider === "openkey" || provider === "other") && (
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            Base URL
                          </label>
                          <input
                            type="url"
                            value={userBaseUrl}
                            onChange={(e) => setUserBaseUrl(e.target.value)}
                            placeholder="https://api.example.com/v1"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 font-mono placeholder:text-gray-300"
                          />
                        </div>
                      )}

                      {/* Model selection */}
                      {provider === "other" ? (
                        /* Free text input for "other" provider */
                        <div>
                          <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wider">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={customModelName}
                            onChange={(e) => setCustomModelName(e.target.value)}
                            placeholder="e.g. deepseek-chat, qwen-vl-max"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 font-mono placeholder:text-gray-300"
                          />
                        </div>
                      ) : (
                        /* Fetch + dropdown for known providers */
                        <div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wider">
                                Model
                              </label>
                              {fetchedModels.length > 0 ? (
                                <Select value={modelVersion} onValueChange={setModelVersion}>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fetchedModels.map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="text-sm text-gray-400 py-2">
                                  Enter your API key, then click Fetch Models
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!userApiKey.trim() || fetchingModels}
                              onClick={handleFetchModels}
                              className="gap-1.5 shrink-0"
                            >
                              {fetchingModels ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                              )}
                              {fetchingModels ? "Fetching..." : "Fetch Models"}
                            </Button>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-gray-400">
                        Your key is sent to the WebBench backend only - never stored.
                      </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-2"
                      size="lg"
                    >
                      {stage === "stopping" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Stopping...
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          {uploadMode === "folder" && folderImageCount > 1
                            ? `Generate HTML (${folderImageCount} images)`
                            : "Generate HTML"}
                        </>
                      )}
                    </Button>
                    {currentRunId && (isProcessing || stage === "stopping") && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleStopRun}
                        disabled={stoppingRun}
                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {stoppingRun ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Stop Run
                      </Button>
                    )}
                    {(imageFile || result || folderFiles.length > 0) && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        disabled={isBusy}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                </div>

                {/* â”€â”€ RIGHT: Output Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-amber-600" />
                    Output
                  </h3>

                  {/* Processing state */}
                  {(isProcessing || stage === "stopping") && (
                    <div className="border-2 border-dashed border-amber-300 bg-amber-50/30 rounded-xl min-h-[300px] flex flex-col items-center justify-center gap-4 p-8">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-amber-700">
                          {stage === "stopping"
                            ? "Stopping run..."
                            : stage === "uploading"
                            ? "Uploading files..."
                            : "Generating HTML code..."}
                        </p>
                        {pollStatus && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {pollStatus.completed.length} done
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" />
                                {pollStatus.running.length} running
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {pollStatus.pending.length} pending
                              </span>
                              {pollStatus.failed.length > 0 && (
                                <span className="flex items-center gap-1 text-red-500">
                                  <XCircle className="w-3 h-3" />
                                  {pollStatus.failed.length} failed
                                </span>
                              )}
                            </div>
                            {/* Progress bar */}
                            <div className="w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {stage === "stopping"
                            ? "The current in-flight model request may finish before cancellation fully takes effect."
                            : "This may take 30s to a few minutes depending on complexity"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stopped state */}
                  {stage === "stopped" && (
                    <div className="border-2 border-dashed border-amber-300 bg-amber-50/30 rounded-xl min-h-[300px] flex flex-col items-center justify-center gap-3 p-8 text-center">
                      <XCircle className="w-12 h-12 text-amber-500" strokeWidth={1.5} />
                      <p className="text-sm font-semibold text-amber-700">
                        Run stopped
                      </p>
                      <p className="text-xs text-gray-500 max-w-md">
                        {stopMessage ||
                          "The run was stopped. The current in-flight image may have finished before cancellation fully took effect."}
                      </p>
                    </div>
                  )}

                  {/* Idle / no result */}
                  {stage === "idle" && !result && (
                    <div className="border-2 border-dashed border-gray-200 bg-white/30 rounded-xl min-h-[300px] flex flex-col items-center justify-center gap-3 p-8 text-gray-400">
                      <Code className="w-12 h-12" strokeWidth={1} />
                      <p className="text-sm font-medium">
                        Generated output will appear here
                      </p>
                      <p className="text-xs">
                        Upload an image and click "Generate HTML" to begin
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {stage === "completed" && result && (
                    <div className="flex flex-col gap-3">
                      {/* Status banner */}
                      {(() => {
                        const failedCount = result.instances.filter(
                          (i) => i.status === "failed"
                        ).length;
                        const completedCount =
                          result.instances.length - failedCount;
                        const allFailed =
                          failedCount > 0 && completedCount === 0;

                        return (
                          <div
                            className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${
                              allFailed
                                ? "bg-red-50 border border-red-200 text-red-700"
                                : failedCount > 0
                                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                                  : "bg-green-50 border border-green-200 text-green-700"
                            }`}
                          >
                            {allFailed ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                              {allFailed
                                ? "All instances failed"
                                : failedCount > 0
                                  ? `Generation complete - ${failedCount} failed`
                                  : "Generation complete!"}
                            </span>
                            <span
                              className={`text-xs ml-auto ${
                                allFailed
                                  ? "text-red-500"
                                  : failedCount > 0
                                    ? "text-amber-600"
                                    : "text-green-600"
                              }`}
                            >
                              {completedCount}/{result.instances.length}{" "}
                              succeeded - Run: {result.runId}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Instance navigator (multi-instance) */}
                      {result.instances.length > 1 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={activeInstanceIdx === 0}
                            onClick={() =>
                              setActiveInstanceIdx((i) => Math.max(0, i - 1))
                            }
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
                            {result.instances.map((inst, idx) => (
                              <button
                                key={inst.instanceId}
                                type="button"
                                onClick={() => setActiveInstanceIdx(idx)}
                                className={`px-2 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1 ${
                                  inst.status === "failed"
                                    ? idx === activeInstanceIdx
                                      ? "bg-red-100 text-red-700 font-semibold"
                                      : "text-red-400 hover:bg-red-50"
                                    : idx === activeInstanceIdx
                                      ? "bg-amber-100 text-amber-700 font-semibold"
                                      : "text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {inst.status === "failed" && (
                                  <XCircle className="w-3 h-3" />
                                )}
                                {inst.instanceId}
                              </button>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={
                              activeInstanceIdx ===
                              result.instances.length - 1
                            }
                            onClick={() =>
                              setActiveInstanceIdx((i) =>
                                Math.min(result.instances.length - 1, i + 1)
                              )
                            }
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* Failed instance error display */}
                      {activeInstance && activeInstance.status === "failed" && (
                        <div className="border rounded-xl bg-white p-6">
                          <div className="flex items-start gap-3">
                            <div className="flex w-10 h-10 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                              <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-red-700 text-sm">
                                Instance "{activeInstance.instanceId}" failed
                              </h4>
                              <p className="mt-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 font-mono break-words whitespace-pre-wrap">
                                {activeInstance.error}
                              </p>
                              {result.inputImages[activeInstance.instanceId] && (
                                <div className="mt-4">
                                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Input image
                                  </span>
                                  <div className="border rounded-xl overflow-hidden bg-white max-w-xs">
                                    <img
                                      src={result.inputImages[activeInstance.instanceId]}
                                      alt="Uploaded input"
                                      className="w-full object-contain"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tabs: Preview / Code / Metrics */}
                      {activeInstance && activeInstance.status !== "failed" && (
                        <Tabs defaultValue="preview" className="w-full">
                          <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="preview" className="gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              Preview
                            </TabsTrigger>
                            <TabsTrigger value="code" className="gap-1.5">
                              <Code className="w-3.5 h-3.5" />
                              HTML Code
                            </TabsTrigger>
                            <TabsTrigger value="metrics" className="gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              Metrics
                            </TabsTrigger>
                          </TabsList>

                          {/* Preview tab */}
                          <TabsContent value="preview" className="mt-3">
                            {/* Download buttons */}
                            <div className="flex justify-end gap-1.5 mb-2">
                              {activeInstance.screenshotBase64 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 text-xs h-7"
                                  onClick={() => downloadScreenshot(activeInstance)}
                                >
                                  <Download className="w-3 h-3" />
                                  PNG
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs h-7"
                                onClick={() =>
                                  downloadFile(
                                    activeInstance.html,
                                    `${activeInstance.instanceId}.html`
                                  )
                                }
                              >
                                <Download className="w-3 h-3" />
                                HTML
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs h-7"
                                onClick={handleDownloadArtifacts}
                                disabled={downloadingArtifacts}
                              >
                                {downloadingArtifacts ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <FolderOpen className="w-3 h-3" />
                                )}
                                Artifacts
                              </Button>
                            </div>

                            {/* Side-by-side when input image available */}
                            {result.inputImages[activeInstance.instanceId] ? (
                              <div className="grid grid-cols-2 gap-3">
                                {/* Input (uploaded) */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                    Input (uploaded)
                                  </span>
                                  <div
                                    className="border rounded-xl overflow-y-auto bg-white h-[420px] cursor-pointer hover:ring-2 hover:ring-amber-300 transition-shadow"
                                    onClick={() => setLightboxOpen(true)}
                                  >
                                    <img
                                      src={result.inputImages[activeInstance.instanceId]}
                                      alt="Uploaded input"
                                      className="w-full object-contain"
                                    />
                                  </div>
                                </div>
                                {/* Output (generated) */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                    Output (generated)
                                  </span>
                                  <div
                                    className="border rounded-xl overflow-y-auto bg-white h-[420px] cursor-pointer hover:ring-2 hover:ring-amber-300 transition-shadow"
                                    onClick={() => setLightboxOpen(true)}
                                  >
                                    {activeInstance.screenshotBase64 ? (
                                      <img
                                        src={`data:image/png;base64,${activeInstance.screenshotBase64}`}
                                        alt="Generated screenshot"
                                        className="w-full object-contain"
                                      />
                                    ) : (
                                      <iframe
                                        srcDoc={activeInstance.html}
                                        title="Generated HTML preview"
                                        className="w-full h-full border-0"
                                        sandbox="allow-scripts"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Full-width when no input image */
                              <div
                                className="border rounded-xl overflow-y-auto bg-white h-[420px] cursor-pointer hover:ring-2 hover:ring-amber-300 transition-shadow"
                                onClick={() => setLightboxOpen(true)}
                              >
                                {activeInstance.screenshotBase64 ? (
                                  <img
                                    src={`data:image/png;base64,${activeInstance.screenshotBase64}`}
                                    alt="Generated screenshot"
                                    className="w-full object-contain"
                                  />
                                ) : (
                                  <iframe
                                    srcDoc={activeInstance.html}
                                    title="Generated HTML preview"
                                    className="w-full h-full border-0"
                                    sandbox="allow-scripts"
                                  />
                                )}
                              </div>
                            )}
                            <p className="text-[10px] text-gray-400 text-center mt-1">
                              Click image to enlarge
                            </p>
                          </TabsContent>

                          {/* Code tab */}
                          <TabsContent value="code" className="mt-3">
                            <div className="relative">
                              <div className="absolute top-2 right-2 z-10 flex gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCopyHtml}
                                  className="gap-1.5 bg-white/90 backdrop-blur text-xs h-7"
                                >
                                  {copied ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 bg-white/90 backdrop-blur text-xs h-7"
                                  onClick={() => {
                                    const blob = new Blob(
                                      [activeInstance.html],
                                      { type: "text/html" }
                                    );
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `${activeInstance.instanceId}.html`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-auto max-h-[500px] font-mono leading-relaxed">
                                <code>{activeInstance.html}</code>
                              </pre>
                            </div>
                          </TabsContent>

                          {/* Metrics tab */}
                          <TabsContent value="metrics" className="mt-3">
                            {result.report?.evaluation?.metrics ? (
                              <div className="border rounded-xl bg-white p-4">
                                <h4 className="font-semibold text-sm text-text-primary mb-3">
                                  Evaluation Metrics
                                  {result.instances.length > 1 && (
                                    <span className="text-xs font-normal text-gray-400 ml-2">
                                      (averaged across all instances)
                                    </span>
                                  )}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {result.report.evaluation.metrics.clip && (
                                    <MetricCard
                                      label="CLIP Score"
                                      value={
                                        (
                                          result.report.evaluation.metrics
                                            .clip as any
                                        ).average
                                      }
                                      format="percent"
                                    />
                                  )}
                                  {result.report.evaluation.metrics
                                    .code_similarity && (
                                    <MetricCard
                                      label="Code Similarity"
                                      value={
                                        (
                                          result.report.evaluation.metrics
                                            .code_similarity as any
                                        ).average
                                      }
                                      format="raw_percent"
                                    />
                                  )}
                                  {result.report.evaluation.metrics
                                    .fine_grained &&
                                    !(
                                      result.report.evaluation.metrics
                                        .fine_grained as any
                                    ).error && (
                                      <>
                                        {(
                                          result.report.evaluation.metrics
                                            .fine_grained as any
                                        ).block_match && (
                                          <MetricCard
                                            label="Block Match"
                                            value={
                                              (
                                                result.report.evaluation.metrics
                                                  .fine_grained as any
                                              ).block_match.average
                                            }
                                            format="percent"
                                          />
                                        )}
                                        {(
                                          result.report.evaluation.metrics
                                            .fine_grained as any
                                        ).text && (
                                          <MetricCard
                                            label="Text"
                                            value={
                                              (
                                                result.report.evaluation.metrics
                                                  .fine_grained as any
                                              ).text.average
                                            }
                                            format="percent"
                                          />
                                        )}
                                        {(
                                          result.report.evaluation.metrics
                                            .fine_grained as any
                                        ).position && (
                                          <MetricCard
                                            label="Position"
                                            value={
                                              (
                                                result.report.evaluation.metrics
                                                  .fine_grained as any
                                              ).position.average
                                            }
                                            format="percent"
                                          />
                                        )}
                                        {(
                                          result.report.evaluation.metrics
                                            .fine_grained as any
                                        ).color && (
                                          <MetricCard
                                            label="Color"
                                            value={
                                              (
                                                result.report.evaluation.metrics
                                                  .fine_grained as any
                                              ).color.average
                                            }
                                            format="percent"
                                          />
                                        )}
                                      </>
                                    )}
                                </div>

                                {/* Per-instance CLIP scores (when multiple) */}
                                {result.instances.length > 1 &&
                                  (
                                    result.report.evaluation.metrics
                                      .clip as any
                                  )?.scores && (
                                    <div className="mt-4 pt-3 border-t">
                                      <h5 className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                                        Per-instance CLIP
                                      </h5>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {Object.entries(
                                          (
                                            result.report.evaluation.metrics
                                              .clip as any
                                          ).scores as Record<string, number>
                                        ).map(([id, score]) => (
                                          <div
                                            key={id}
                                            className="flex items-center justify-between px-2 py-1 rounded bg-gray-50 text-xs"
                                          >
                                            <span className="font-mono text-gray-600 truncate mr-2">
                                              {id}
                                            </span>
                                            <span className="font-semibold text-amber-700">
                                              {(score * 100).toFixed(1)}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Token usage */}
                                {result.report.token_usage && (
                                  <div className="mt-4 pt-3 border-t">
                                    <h5 className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                                      Total Token Usage
                                    </h5>
                                    {(() => {
                                      const usage = result.report
                                        .token_usage as Record<string, unknown>;
                                      const promptTokens = toNumber(
                                        usage.total_prompt_tokens
                                      );
                                      const responseTokens = toNumber(
                                        usage.total_response_tokens
                                      );
                                      const explicitTotal = toNumber(
                                        usage.total_tokens
                                      );
                                      const callCount = toNumber(
                                        usage.call_count
                                      );

                                      const totalTokens =
                                        explicitTotal ??
                                        (promptTokens !== null ||
                                        responseTokens !== null
                                          ? (promptTokens ?? 0) +
                                            (responseTokens ?? 0)
                                          : null);

                                      return (
                                        <>
                                          <p className="text-sm text-text-primary">
                                            {totalTokens !== null
                                              ? `${Math.round(
                                                  totalTokens
                                                ).toLocaleString()} tokens`
                                              : "Token usage unavailable"}
                                          </p>
                                          {(promptTokens !== null ||
                                            responseTokens !== null ||
                                            callCount !== null) && (
                                            <p className="text-xs text-text-secondary mt-1">
                                              {promptTokens !== null
                                                ? `Prompt: ${Math.round(
                                                    promptTokens
                                                  ).toLocaleString()}`
                                                : "Prompt: -"}
                                              {" • "}
                                              {responseTokens !== null
                                                ? `Response: ${Math.round(
                                                    responseTokens
                                                  ).toLocaleString()}`
                                                : "Response: -"}
                                              {callCount !== null &&
                                                ` • Calls: ${Math.round(
                                                  callCount
                                                ).toLocaleString()}`}
                                            </p>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="border rounded-xl bg-white p-6 text-center text-gray-400 text-sm">
                                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>
                                  No evaluation metrics available for this run.
                                </p>
                                <p className="text-xs mt-1.5 text-gray-400">
                                  {uploadMode === "single"
                                    ? "Paste the original HTML source in the input panel to enable code similarity and fine-grained evaluation."
                                    : "Include HTML files with matching image names in your folder to enable evaluation metrics."}
                                </p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* â”€â”€â”€ How it works â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <StepCard
                  step={1}
                  title="Upload Screenshot or Folder"
                  description="Provide a single image, or upload an entire folder with PNG/JPG images and optional HTML/CSS reference files."
                />
                <StepCard
                  step={2}
                  title="Select Model & Method"
                  description='Choose an AI model (Gemini, GPT-4, Claude, etc.) and generation method ("dcgen" for divide-and-conquer, "direct" for single-pass).'
                />
                <StepCard
                  step={3}
                  title="Get HTML + Metrics"
                  description="WebBench generates HTML + Tailwind CSS code for each image, takes screenshots, and evaluates visual and code similarity automatically."
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* â”€â”€â”€ Fullscreen Lightbox Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-3 border-b">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" />
              {activeInstance
                ? `Preview - ${activeInstance.instanceId}`
                : "Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-60px)] p-6">
            {activeInstance && result && (
              <>
                {result.inputImages[activeInstance.instanceId] ? (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Input (uploaded)
                      </span>
                      <div className="border rounded-xl overflow-hidden bg-white">
                        <img
                          src={result.inputImages[activeInstance.instanceId]}
                          alt="Uploaded input"
                          className="w-full object-contain"
                        />
                      </div>
                    </div>
                    {/* Output */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Output (generated)
                      </span>
                      <div className="border rounded-xl overflow-hidden bg-white">
                        {activeInstance.screenshotBase64 ? (
                          <img
                            src={`data:image/png;base64,${activeInstance.screenshotBase64}`}
                            alt="Generated screenshot"
                            className="w-full object-contain"
                          />
                        ) : (
                          <iframe
                            srcDoc={activeInstance.html}
                            title="Generated HTML preview"
                            className="w-full h-[70vh] border-0"
                            sandbox="allow-scripts"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Full-width when no input image */
                  <div className="border rounded-xl overflow-hidden bg-white">
                    {activeInstance.screenshotBase64 ? (
                      <img
                        src={`data:image/png;base64,${activeInstance.screenshotBase64}`}
                        alt="Generated screenshot"
                        className="w-full object-contain"
                      />
                    ) : (
                      <iframe
                        srcDoc={activeInstance.html}
                        title="Generated HTML preview"
                        className="w-full h-[75vh] border-0"
                        sandbox="allow-scripts"
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// â”€â”€ Subcomponents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MetricCard({
  label,
  value,
  format,
}: {
  label: string;
  value: number | undefined;
  format: "percent" | "raw_percent" | "number";
}) {
  if (value === undefined || value === null) return null;
  const displayValue =
    format === "percent"
      ? `${(value * 100).toFixed(1)}%`
      : format === "raw_percent"
        ? `${value.toFixed(1)}%`
        : value.toFixed(3);

  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
      <p className="text-xs text-text-secondary font-medium">{label}</p>
      <p className="text-lg font-bold text-amber-700 mt-0.5">{displayValue}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white/70 flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
          {step}
        </div>
        <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}


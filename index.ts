/**
 * Jina Visit Plugin for OpenClaw
 * Jina Reader API integration with chunked reading support
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

console.log("[jina] Module loading - top level");

// ============ Constants ============

const CHUNK_SIZE = 8000; // 每片 8000 字符
const MAX_CACHE_SIZE = 50; // 最多缓存 50 个页面

// ============ Cache ============

const pageCache = new Map<string, { content: string; fetchedAt: number }>();

// ============ Helper ============

function json(data: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

// ============ Jina API Functions ============

/**
 * Visit webpage via Jina Reader API
 */
async function jinaVisitCore(url: string): Promise<{ url: string; content: string; status: string }> {
  const apiKey = process.env.JINA_API_KEY;
  const https = require('https');

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'r.jina.ai',
      path: `/${encodeURIComponent(url)}`,
      method: 'GET',
      headers: {
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        'Accept': 'text/plain'
      }
    }, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({
            url: url,
            content: body.trim(),
            status: 'success'
          });
        } else {
          reject(new Error(`API Error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', (err: Error) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.end();
  });
}

/**
 * Visit webpage with chunked reading support
 */
async function jinaVisit(params: { url: string; chunk?: number }): Promise<any> {
  const { url, chunk = 1 } = params;

  console.log(`[jina] Visiting: ${url}, chunk: ${chunk}`);

  // 检查缓存
  let cached = pageCache.get(url);
  
  if (!cached) {
    // 抓取页面
    const result = await jinaVisitCore(url);
    cached = {
      content: result.content,
      fetchedAt: Date.now()
    };
    
    // 存入缓存
    pageCache.set(url, cached);
    
    // 清理旧缓存
    if (pageCache.size > MAX_CACHE_SIZE) {
      const oldestKey = [...pageCache.entries()]
        .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)[0][0];
      pageCache.delete(oldestKey);
    }
  }

  const fullContent = cached.content;
  const totalChunks = Math.ceil(fullContent.length / CHUNK_SIZE);
  const validChunk = Math.max(1, Math.min(chunk, totalChunks));
  
  const startIdx = (validChunk - 1) * CHUNK_SIZE;
  const endIdx = Math.min(startIdx + CHUNK_SIZE, fullContent.length);
  const chunkContent = fullContent.substring(startIdx, endIdx);

  // 构建返回结果
  const header = `[Chunk ${validChunk}/${totalChunks} | Total: ${fullContent.length} chars]\n`;
  const footer = validChunk < totalChunks
    ? `\n\n[Call jina_visit with chunk=${validChunk + 1} to continue reading]`
    : `\n\n[End of content]`;

  const text = header + chunkContent + footer;

  return {
    url,
    chunk: validChunk,
    totalChunks,
    totalChars: fullContent.length,
    chunkSize: CHUNK_SIZE,
    content: text,
  };
}

// ============ Plugin Definition ============

const jinaPlugin = {
  id: "jina",
  name: "Jina",
  description: "Jina Reader API plugin for OpenClaw with chunked reading support",
  kind: "extension" as const,
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    console.log("[jina] Extension register() called");

    console.log("[jina] Registering jina_visit tool");
    api.registerTool(
      {
        name: "jina_visit",
        label: "Jina Visit",
        description: "Visit webpage and extract content via Jina Reader API. Returns content in chunks (8000 chars each). First call returns chunk 1 and total count. Use 'chunk' parameter to read subsequent chunks.",
        parameters: Type.Object({
          url: Type.String({ description: "Webpage URL" }),
          chunk: Type.Optional(Type.Number({ description: "Chunk number to read (1-based, default 1). Use this to read subsequent chunks." })),
        }),
        async execute(_toolCallId, params) {
          console.log("[jina] jina_visit called with params:", params);
          try {
            const result = await jinaVisit(params as { url: string; chunk?: number });
            console.log("[jina] jina_visit result:", { 
              url: result.url, 
              chunk: result.chunk, 
              totalChunks: result.totalChunks 
            });
            return json(result);
          } catch (err) {
            console.error("[jina] jina_visit error:", err);
            return json({ error: err instanceof Error ? err.message : String(err) });
          }
        },
      },
      { name: "jina_visit" },
    );
    console.log("[jina] jina_visit registered");
    console.log("[jina] All tools registered successfully");
  },
};

export default jinaPlugin;
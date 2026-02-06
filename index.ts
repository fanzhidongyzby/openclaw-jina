/**
 * Jina Visit Plugin for OpenClaw
 * Jina Reader API integration
 */

import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

console.log("[jina] Module loading - top level");

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
 * Visit webpage
 */
async function jinaVisit(params: { url: string; goal?: string }): Promise<any> {
  const { url, goal } = params;

  console.log(`[jina] Visiting: ${url}`);
  const result = await jinaVisitCore(url);

  // If goal is provided, simple truncate for now
  if (goal) {
    console.log(`[jina] Goal provided: ${goal}, truncating content`);
    const truncated = result.content.substring(0, 2000);
    result.content = truncated;
    result.summary = truncated;
    result.originalLength = result.content.length;
  }

  return {
    url: url,
    goal: goal || null,
    result: result,
  };
}

// ============ Plugin Definition ============

const jinaPlugin = {
  id: "jina",
  name: "Jina",
  description: "Jina Reader API plugin for OpenClaw",
  kind: "extension" as const,
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    console.log("[jina] Extension register() called");

    console.log("[jina] Registering jina_visit tool");
    api.registerTool(
      {
        name: "jina_visit",
        label: "Jina Visit",
        description: "Visit webpage and extract content via Jina Reader API",
        parameters: Type.Object({
          url: Type.String({ description: "Webpage URL" }),
          goal: Type.Optional(Type.String({ description: "Optional goal for LLM summarization" })),
        }),
        async execute(_toolCallId, params) {
          console.log("[jina] jina_visit called with params:", params);
          try {
            const result = await jinaVisit(params as { url: string; goal?: string });
            console.log("[jina] jina_visit result:", result);
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
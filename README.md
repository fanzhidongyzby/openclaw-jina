# OpenClaw Jina Plugin

This plugin integrates the [Jina Reader API](https://jina.ai/reader) into OpenClaw, allowing agents to visit webpages and extract content in a clean, LLM-friendly format.

## Features

- **Jina Reader API Integration**: Converts any URL into clean Markdown/text.
- **Chunked Reading**: Automatically splits large pages into manageable 8000-character chunks to fit within LLM context windows.
- **Caching**: Implements an in-memory LRU cache (max 50 pages) to prevent redundant API calls during pagination.

## Installation

1. Clone this repository into your OpenClaw extensions directory:
   ```bash
   cd ~/.openclaw/extensions
   git clone https://github.com/fanzhidongyzby/openclaw-jina.git jina
   ```

2. Install dependencies:
   ```bash
   cd jina
   npm install
   ```

## Configuration

This plugin requires a Jina API key.

1. Get your API key from [jina.ai](https://jina.ai/).
2. Add it to your OpenClaw environment variables (e.g., in `~/.openclaw/.env` or your shell profile):

```bash
export JINA_API_KEY="jina_..."
```

## Usage

The plugin exposes a single tool: `jina_visit`.

### Tool: `jina_visit`

Visits a webpage and returns its content.

**Parameters:**

- `url` (string, required): The URL of the webpage to visit.
- `chunk` (number, optional): The chunk number to read (1-based). Defaults to 1.

**Return Value:**

Returns a JSON object containing:
- `url`: The visited URL.
- `content`: The text content of the requested chunk.
- `chunk`: Current chunk number.
- `totalChunks`: Total number of chunks available.
- `totalChars`: Total characters in the document.

**Example Flow:**

1. **Agent calls:** `jina_visit(url="https://example.com/long-article")`
2. **Plugin returns:** Chunk 1/5 and indicates there are more chunks.
3. **Agent calls:** `jina_visit(url="https://example.com/long-article", chunk=2)`
   *(This call hits the memory cache, avoiding a new HTTP request)*
4. **Plugin returns:** Chunk 2/5.

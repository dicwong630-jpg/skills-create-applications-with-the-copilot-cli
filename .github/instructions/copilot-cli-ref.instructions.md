---
applyTo: "**/**"
---

# Prompt guidance

Stick to the prompts and context being provided. Don't jump ahead to doing steps.
Only add, commit, and push files when prompted by the user.

# Application overview

This repository contains a Node.js application with two main feature categories:

1. **Cryptocurrency Big-Data Analytics** (`src/crypto-analytics/`)
   - `analyzer.js` — price-trend analysis, SMA/EMA, RSI, volatility, trend detection
   - `dataFetcher.js` — market data fetching helpers (price, historical OHLCV, top coins)
   - `index.js` — module entry point and high-level helpers (`generateReport`, `printMarketOverview`)

2. **AI Video Generation** (`src/ai-video/`)
   - `generator.js` — job creation, pipeline advancement, scene-prompt builder
   - `processor.js` — video composition, post-processing effects, captions, thumbnails
   - `index.js` — module entry point and high-level helper (`generateVideo`)

Unit tests live in `src/tests/` and can be run with `npm test`.
The application entry point is `src/index.js` (run with `npm start`).

# New features

Use `.github/ISSUE_TEMPLATE/feature_request.md` to request all new features.
The template covers all three categories: calculator, crypto analytics, and AI video generation.

# Global shortcuts

```
@             mention files, include contents in context
Esc           cancel the current operation
!             execute command in your local shell (bypass Copilot)
ctrl+c        cancel operation / clear input / exit
ctrl+d        shutdown
ctrl+l        clear the screen
```

## Expand timeline content shortcuts

```
Ctrl+o - expand all timeline/collapse timeline
Ctrl+r - expand recent timeline/collapse timeline
```

## Motion shortcuts

```
Ctrl+a - move to the beginning of the line
Ctrl+e - move to the end of the line
Ctrl+h - delete previous character
Ctrl+w - delete previous word
Ctrl+u - delete from cursor to beginning of line
Ctrl+k - delete from cursor to end of line
Meta+←/→ - move cursor by word
```

Use ↑↓ keys to navigate command history

## Instruction sources

Respects instructions sourced from various locations:

- `.github/instructions/**/*.instructions.md` (in git root and cwd)
- `.github/copilot-instructions.md`
- `AGENTS.md` (in git root and cwd)
- `CLAUDE.md`
- `GEMINI.md`
- `$HOME/.copilot/copilot-instructions.md`
- Additional directories via `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`

## Learn more

To learn about what I can do:

- Ask me "What can you do?"
- Or visit: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli

## Available commands

```
/add-dir <directory> - Add a directory to the allowed list for file access
/agent - Browse and select from available agents (if any)
/clear - Clear the conversation history
/compact - Summarize conversation history to reduce context window usage
/context - Show context window token usage and visualization
/cwd [directory] - Change working directory or show current directory
/delegate <prompt> - Delegate changes to remote repository with AI-generated PR
/exit, /quit - Exit the CLI
/share [file|gist] [path] - Share session to markdown file or GitHub gist
/feedback - Provide feedback about the CLI
/help - Show help for interactive commands
/list-dirs - Display all allowed directories for file access
/login - Log in to Copilot
/logout - Log out of Copilot
/mcp [show|add|edit|delete|disable|enable] [server-name] - Manage MCP server configuration
/model [model] - Select AI model to use
/reset-allowed-tools - Reset the list of allowed tools
/session - Show information about the current CLI session
/skills [list|info|add|remove|reload] [args...] - Manage skills for enhanced capabilities
/terminal-setup - Configure terminal for multiline input support (Shift+Enter and Ctrl+Enter)
/theme [show|set|list] [auto|dark|light] - View or configure terminal theme
/usage - Display session usage metrics and statistics
/user [show|list|switch] - Manage GitHub user list
```

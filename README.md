# Google News CLI

A polished, interactive command-line application built with Node.js to search, browse, and fetch the latest Google News.

## Features
*   **Interactive Menu**: Run the app without flags to navigate categories (Top Stories, Search, Topics) interactively.
*   **Fast CLI Flags**: Retrieve news immediately with direct flags (`--search`, `--topic`, `--limit`).
*   **Styled Output**: Rich terminal styling featuring spinners, colored links, and formatted dates.

## Prerequisites
*   [Node.js](https://nodejs.org) (v18.0.0 or higher recommended)

## Installation

1.  Clone or navigate to the project directory:
    ```bash
    c:\Users\admin\Desktop\agy2-projects\my-first-project
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```

## Usage

### 1. Interactive Mode
Run the script without arguments to open the interactive selection menu:
```bash
node index.js
```

### 2. Direct Query / Flag Mode
Skip the interactive prompts by specifying flags:

*   **Top news matching a search query:**
    ```bash
    node index.js --search "artificial intelligence"
    ```
*   **Browse a specific topic (with custom limit):**
    ```bash
    node index.js --topic technology --limit 5
    ```
    *Supported topics: `world`, `nation`, `business`, `technology`, `entertainment`, `sports`, `science`, `health`*

### 3. Display Options & Help
```bash
node index.js --help
```

---

## Technical Architecture
*   **RSS Parser**: Uses `rss-parser` to request and deserialize official Google News RSS channels.
*   **CLI Framework**: Built using `commander.js` for argument management.
*   **User Interface**: Implements `inquirer` for menu prompt selection, `ora` for terminal spinners, and `chalk` for custom ANSI color styling.

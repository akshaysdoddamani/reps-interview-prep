#!/usr/bin/env node

import { program } from 'commander';
import Parser from 'rss-parser';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const parser = new Parser();

// Helper to format date
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateStr;
  }
}

// Display banner
function showBanner() {
  console.log(chalk.bold.cyan('\n┌───────────────────────────────────────────────┐'));
  console.log(chalk.bold.cyan(`│            ${chalk.yellow('GOOGLE NEWS CLI v1.0.0')}           │`));
  console.log(chalk.bold.cyan('└───────────────────────────────────────────────┘\n'));
}

// Fetch and display news
async function fetchNews(url, limit = 10) {
  const spinner = ora({
    text: chalk.blue('Fetching latest news from Google...'),
    color: 'cyan'
  }).start();

  try {
    const feed = await parser.parseURL(url);
    spinner.succeed(chalk.green(`Successfully loaded news from: ${feed.title || 'Google News'}\n`));

    const items = feed.items.slice(0, limit);

    if (items.length === 0) {
      console.log(chalk.yellow('No news stories found.'));
      return;
    }

    items.forEach((item, index) => {
      // Google News title is usually "Headline - Source"
      // Let's parse the source out of the title if possible, or use item.creator / item.source
      let title = item.title || 'No Title';
      let source = '';
      
      const sourceMatch = title.match(/(.*)\s+-\s+(.*)$/);
      if (sourceMatch) {
        title = sourceMatch[1].trim();
        source = sourceMatch[2].trim();
      }

      const num = chalk.bold.cyan(`${index + 1}.`);
      console.log(`${num} ${chalk.bold.white(title)}`);
      
      const meta = [];
      if (source) meta.push(chalk.yellow(source));
      if (item.pubDate) meta.push(chalk.dim(formatDate(item.pubDate)));
      
      if (meta.length > 0) {
        console.log(`   ${meta.join(' • ')}`);
      }
      
      if (item.link) {
        console.log(`   ${chalk.blue.underline(item.link)}`);
      }
      console.log(); // Blank line between stories
    });
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch news.'));
    console.error(chalk.red(`Error: ${error.message}`));
    console.log(chalk.dim('Please check your network connection or try again later.'));
  }
}

// Interactive prompt
async function interactiveMode() {
  showBanner();

  const choices = [
    { name: '🔥 Top Stories', value: 'top' },
    { name: '🔍 Search for News', value: 'search' },
    { name: '📰 News by Topic', value: 'topic' },
    { name: '❌ Exit', value: 'exit' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What news would you like to read today?',
      choices
    }
  ]);

  if (action === 'exit') {
    console.log(chalk.green('Goodbye! Have a nice day.'));
    process.exit(0);
  }

  if (action === 'top') {
    const url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
    await fetchNews(url);
    await promptReturn();
  } else if (action === 'search') {
    const { query } = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: 'Enter search term:',
        validate: (input) => input.trim() !== '' ? true : 'Search term cannot be empty.'
      }
    ]);
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    await fetchNews(url);
    await promptReturn();
  } else if (action === 'topic') {
    const topics = [
      { name: 'World', value: 'WORLD' },
      { name: 'Nation (US)', value: 'NATION' },
      { name: 'Business', value: 'BUSINESS' },
      { name: 'Technology', value: 'TECHNOLOGY' },
      { name: 'Entertainment', value: 'ENTERTAINMENT' },
      { name: 'Sports', value: 'SPORTS' },
      { name: 'Science', value: 'SCIENCE' },
      { name: 'Health', value: 'HEALTH' }
    ];

    const { topic } = await inquirer.prompt([
      {
        type: 'list',
        name: 'topic',
        message: 'Select a topic:',
        choices: topics
      }
    ]);

    const url = `https://news.google.com/rss/headlines/section/topic/${topic}?hl=en-US&gl=US&ceid=US:en`;
    await fetchNews(url);
    await promptReturn();
  }
}

// Prompt to return to menu
async function promptReturn() {
  const { choice } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'choice',
      message: 'Would you like to return to the main menu?',
      default: true
    }
  ]);

  if (choice) {
    await interactiveMode();
  } else {
    console.log(chalk.green('Goodbye! Have a nice day.'));
    process.exit(0);
  }
}

// Main execution
function main() {
  program
    .name('google-news')
    .description('A Node.js CLI tool to fetch and display the latest news from Google News.')
    .version('1.0.0')
    .option('-s, --search <query>', 'Search Google News for a query')
    .option('-t, --topic <topic>', 'Fetch news by topic (world, nation, business, technology, entertainment, sports, science, health)')
    .option('-l, --limit <number>', 'Number of news items to display', '10')
    .option('-i, --interactive', 'Run in interactive mode')
    .action(async (options) => {
      const limit = parseInt(options.limit, 10) || 10;

      // If specific flags are passed, run in non-interactive mode
      if (options.search) {
        showBanner();
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(options.search)}&hl=en-US&gl=US&ceid=US:en`;
        await fetchNews(url, limit);
      } else if (options.topic) {
        showBanner();
        const allowedTopics = ['world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
        const topic = options.topic.toLowerCase();
        
        if (!allowedTopics.includes(topic)) {
          console.error(chalk.red(`Invalid topic. Allowed topics: ${allowedTopics.join(', ')}`));
          process.exit(1);
        }
        
        const url = `https://news.google.com/rss/headlines/section/topic/${topic.toUpperCase()}?hl=en-US&gl=US&ceid=US:en`;
        await fetchNews(url, limit);
      } else {
        // Default to interactive mode
        await interactiveMode();
      }
    });

  program.parse(process.argv);
}

main();

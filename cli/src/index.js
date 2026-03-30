#!/usr/bin/env node
require('dotenv').config();
const { Command } = require('commander');
const Alarms = require('./commands/alarms');

const program = new Command();

program
  .name('fw')
  .description('Firewalla MSP CLI')
  .version('1.0.0')
  .option('-v, --debug', 'Output debug info to stderr', false); // Global debug flag

// Alarms Domain
const alarms = program.command('alarms').description('Manage network alarms');

alarms
  .command('list')
  .option('--box <name|gid>', 'Box Name or GID')
  .option('--params <json>', 'API filters')
  .action((options) => {
    // Merge global debug flag into command options
    Alarms.list({ ...options, debug: program.opts().debug });
  });

alarms
  .command('update')
  .requiredOption('--id <id>', 'Alarm ID')
  .option('--box <name|gid>', 'Box Name or GID')
  .option('--json <json|@file>', 'JSON body or @file.json')
  .action((options) => {
    Alarms.update(options.id, { ...options, debug: program.opts().debug });
  });

program.parse(process.argv);

#!/usr/bin/env node
require('dotenv').config();
const { Command } = require('commander');
const Alarms = require('./commands/alarms');

const program = new Command();

program
  .name('fw')
  .description('Firewalla MSP CLI')
  .version('1.0.0')
  .option('-v, --debug', 'Output debug info', false)
  .option('-d, --domain <domain>', 'MSP Domain (e.g. company.firewalla.net)');

const alarms = program.command('alarms').description('Manage network alarms');

alarms
  .command('list')
  .description('List alarms from a specific box')
  .option('--box <name|gid>', 'Box Name or GID')
  .option('--params <json>', 'API filters')
  .action((options) => {
    Alarms.list({ ...options, ...program.opts() });
  });

program.parse(process.argv);

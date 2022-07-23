import * as path from 'node:path'
import * as fs from 'node:fs'
import yaml from 'yaml'

import { fileURLToPath } from 'url'

// Get the directory of the script, see https://stackoverflow.com/a/64383997
const projectDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const yamlPath = path.join(projectDir, 'assets/messages.yml')
const messages = yaml.parse(fs.readFileSync(yamlPath, 'utf8'))

const jsonPath = path.join(projectDir, 'assets/js/messages.json')
fs.writeFileSync(jsonPath, JSON.stringify(messages, null, 2))

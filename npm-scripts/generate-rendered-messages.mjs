import * as path from 'node:path'
import * as fs from 'node:fs'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import { fileURLToPath } from 'url'

// Get the directory of the script, see https://stackoverflow.com/a/64383997
const projectDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const jsonPath = path.join(projectDir, 'assets/js/messages.json')
const messages = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

const mojiraHtmlCode = await (await fetch('https://bugs.mojang.com/projects/MC/summary')).text()

const mojiraHtmlDom = new JSDOM(mojiraHtmlCode)
const cssUrls = Array.from(mojiraHtmlDom.window.document.querySelectorAll('html > head > link[type="text/css"]'))
    .map(link => {
        let url = link.getAttribute('href')
        if (url?.startsWith('/')) {
            url = 'https://bugs.mojang.com' + url
        }
        return url
    })

messages.mojiraCssUrls = cssUrls

for (const quickLink of messages.variables['quick_links']) {
    // Remove enclosing `<p>...</p>` because messages in which this variable is inserted already contain it
    quickLink.renderedValue = removePrefixAndSuffix(await renderMessage(quickLink.value), '<p>', '</p>')
}

for (const messageId in messages.messages) {
    for (const messageData of messages.messages[messageId]) {
        messageData.renderedMessage = (await renderMessage(messageData.message)).replace(/%s%/g, '<abbr title="variable placeholder">%s%</abbr>')
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(messages, null, 2))

async function renderMessage(message) {
    const response = await fetch('https://bugs.mojang.com/rest/api/1.0/render', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'rendererType': 'atlassian-wiki-renderer',
            'unrenderedMarkup': message
        })
    })
    return await response.text()
}

function removePrefixAndSuffix(s, prefix, suffix) {
    if (s.startsWith(prefix)) {
        s = s.substring(prefix.length)
    }
    if (s.endsWith(suffix)) {
        s = s.substring(0, s.length - suffix.length)
    }
    return s
}

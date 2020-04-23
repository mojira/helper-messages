// Sort the messages in `messages.json` by their keys alphabetically.

const origin = require('../assets/js/messages.json')
const result = { ...origin, messages: {} }

Object.keys(origin.messages).sort().forEach(k =>
    result.messages[k] = origin.messages[k].map(v =>
        ({ ...v, project: typeof v.project === 'string' ? v.project : v.project.sort() })
    )
)

require('fs').writeFileSync(
    require('path').join(__dirname, '../assets/js/messages.json'),
    JSON.stringify(result, undefined, 4), 'utf8'
)

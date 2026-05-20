const fs = require('fs')
const path = require('path')

const cacheDir = path.join(__dirname, '..', '.next')

if (!fs.existsSync(cacheDir)) {
  console.log('clean-next-cache: .next does not exist, nothing to remove')
  process.exit(0)
}

try {
  fs.rmSync(cacheDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 })
  console.log('clean-next-cache: removed .next')
} catch (err) {
  console.error('clean-next-cache: failed to remove .next — stop `npm run dev` and try again')
  console.error(err.message)
  process.exit(1)
}

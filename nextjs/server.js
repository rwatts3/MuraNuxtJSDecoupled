const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { parse } = require('url')
const { join } = require('path')


app.prepare()
.then(() => {
  const server = express()
  server.get('*', (req, res) => {
		const parsedUrl = parse(req.url, true)
		const { pathname, query } = parsedUrl
		const rootStaticFiles = ['/mura.config.json']
		if (rootStaticFiles.indexOf(pathname) > -1) {
			const path = join(__dirname, 'static', pathname)
			app.serveStatic(req, res, path)
		} else {
			app.render(req, res, '/index',query)
		}
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

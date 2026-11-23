import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import methodOverride from 'method-override'
import session from 'express-session'
import homeRoutes from './routes/homeRoutes.js'
import productRoutes from './routes/productRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import { config } from './lib/appContainer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(rootDir, 'views'))

app.use(morgan('dev'))
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
    },
  }),
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next) => {
  res.locals.currentPath = req.path
  res.locals.appName = 'Harbor MVC'
  res.locals.isAuthenticated = Boolean(req.session.user)
  res.locals.currentUser = req.session.user || null
  res.locals.flash = req.session.flash || null
  delete req.session.flash
  next()
})

app.use('/', homeRoutes)
app.use('/products', productRoutes)
app.use('/contact', contactRoutes)
app.use(authRoutes)
app.use(dashboardRoutes)
app.use('/api', apiRoutes)

app.use((_req, res) => {
  res.status(404).render('pages/404', { title: 'Not found' })
})

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  const message = err instanceof Error ? err.message : 'Something went wrong'
  res.status(500).render('pages/error', {
    title: 'Error',
    message,
  })
})

app.listen(config.port, () => {
  console.log(`Harbor MVC (TypeScript) running at http://127.0.0.1:${config.port}`)
})

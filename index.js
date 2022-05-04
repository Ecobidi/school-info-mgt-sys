require('dotenv').config({path: __dirname + '/.env'})
let express = require('express')
let expressSession = require('express-session')
let connectFlash = require('connect-flash')
let mongoose = require('mongoose')

let { APPNAME, PORT, dbhost, dbport, dbname, sessionsecret, domain,} = require('./config') 

let port = process.env.PORT || PORT

// mongoose.connect(`mongodb://${dbhost}:${dbport}/${dbname}`)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qmunc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

console.log(uri)

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('connected to database: ' + process.env.DB_NAME)
} catch (error) {
  console.log('Error connecting to database: ' + process.env.DB_NAME)
  console.log(error)
}

// routes
const AdminRouter = require('./routes')
const StudentClientRouter = require('./routes/studentRouter')

const RegisteredCoursesService = require('./services/registered_course')

// const DBCounterModel = require('./models/db_counter')

// DBCounterModel.insertMany([{key: 'students_id'}, {key: 'users_id'}, {key: 'courses_id'}, {key: 'departments_id'}, {key: 'programmes_of_study_id'}, {key: 'results_id'}, {key: 'courses_allocations_id'}])

// init express App
let app = express()

// view engine 
app.set('view engine', 'ejs')
app.set('views', './views')

// expressStatic
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

// bodyparser middlewares
app.use(express.json())
app.use(express.urlencoded())

// express-session middleware
app.use(expressSession({
  secret: sessionsecret,
  saveUninitialized: true,
  resave: true,
}))
// connect-flash
app.use(connectFlash())

app.use((req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.user = req.session.user || { username: 'test' }
  app.locals.appname = APPNAME
  app.locals.port = PORT
  app.locals.domain = domain + ':' + PORT
  next()
})

// routes

app.get('/api/student-courses', async (req, res) => {
  let {level, semester, session, student_reg_no} = req.query
  try {
    let doc = await RegisteredCoursesService.findSpecific({level, semester, session, student_reg_no})
    if (doc) res.status(200).json(doc.courses)
    else res.status(200).json([])
  } catch (error) {
    res.status(400).end()
  }
})

app.use('/student', StudentClientRouter)

app.use('/', AdminRouter)


app.listen(port, () => { console.log(`${APPNAME} running on port ${port}`) })
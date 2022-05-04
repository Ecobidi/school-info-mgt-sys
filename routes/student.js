const router = require('express').Router()
const multer = require('multer')

const StudentController = require('../controllers/student')
const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', StudentController.getStudentsPage)

router.get('/new', StudentController.createStudentPage)

router.post('/new', upload.single('photo'), StudentController.createStudent)

router.get('/profile/:serial_number', StudentController.getStudentProfilePage)

router.get('/remove/:student_id', UserController.hasAdminAuthorization, StudentController.removeStudent)

module.exports = router
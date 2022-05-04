const router = require('express').Router()
const StudentController = require('../controllers/studentController')

const checkAuthentication = (req, res, next) => {
  if (req.session.student) next() 
  else res.redirect('/student/login')
}

router.get('/login', StudentController.getLoginPage)

router.post('/login', StudentController.handleLogin)

router.get('/logout', StudentController.handleLogout)

router.use(checkAuthentication)

router.get('/', StudentController.getHomePage)

router.get('/register-semester-courses', StudentController.registerCoursePage)

router.post('/register-semester-courses', StudentController.submitCourseRegistration)

router.get('/preview-courses', StudentController.getSelectCourseFormPage)

router.get('/course-form', StudentController.getCourseFormPage)

router.get('/select-result', StudentController.getSelectResultPage)

router.get('/get-result', StudentController.getResultPage)

module.exports = router
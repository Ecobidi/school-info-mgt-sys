const router = require('express').Router()

const CourseController = require('../controllers/course')

router.get('/', CourseController.getCoursesPage)

router.get('/new', CourseController.createCoursePage)

router.post('/new', CourseController.createCourse)

router.get('/remove/:course_id', CourseController.removeCourse)

module.exports = router
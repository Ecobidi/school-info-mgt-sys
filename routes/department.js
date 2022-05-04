const router = require('express').Router()
const DepartmentController = require('../controllers/department')

router.get('/', DepartmentController.getDepartmentsPage)

router.post('/new', DepartmentController.createDepartment)

router.get('/remove/:department_id', DepartmentController.removeDepartment)

module.exports = router
const router = require('express').Router()

const ResultController = require('../controllers/result')
// const ResultController = require('../controllers/result')

router.get('/', ResultController.getResultsPage)

router.get('/new', ResultController.createResultPage)

router.post('/new', ResultController.createResult)

router.get('/get-result', ResultController.getStudentResult)

// router.get('/remove/:remove_result', ResultController.removeResult)

module.exports = router
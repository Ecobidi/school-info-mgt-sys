const router = require('express').Router()

const ProgrammeOfStudy = require('../controllers/programme_of_study')

router.get('/', ProgrammeOfStudy.getProgrammesOfStudyPage)

// router.get('/new', ProgrammeOfStudy.createProgrammeOfStudyPage)

router.post('/new', ProgrammeOfStudy.createProgrammeOfStudy)

router.get('/remove/:programme_of_study_id', ProgrammeOfStudy.removeProgrammeOfStudy)

module.exports = router
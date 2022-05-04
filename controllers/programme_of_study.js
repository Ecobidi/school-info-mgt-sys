const DepartmentModel = require('../models/department')
const ProgrammeOfStudyService = require('../services/programme_of_study')

class ProgrammeOfStudyController {

  static async getProgrammesOfStudyPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || ProgrammeOfStudyService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let programmes_of_study, totalDocuments
    let departments = await DepartmentModel.find()
    if (search) {
      programmes_of_study = await ProgrammeOfStudyService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await ProgrammeOfStudyService.countMatchingDocuments(search)
    } else {
      programmes_of_study = await ProgrammeOfStudyService.findAll({limit: limit_size, offset})
      totalDocuments = await ProgrammeOfStudyService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('programmes-of-study', {programmes_of_study, departments, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createProgrammeOfStudy(req, res) {
    let dao = req.body

    try {
      await ProgrammeOfStudyService.create(dao)
      req.flash('success_msg', "Successfully added")
      res.redirect('/programmes-of-study')
    } catch (err) {
      console.log(err)
      res.redirect('/programmes-of-study')
    }
  }

  static async removeProgrammeOfStudy(req, res) {
    try {
      let doc = await ProgrammeOfStudyService.removeOne(req.params.programme_of_study_id)
      req.flash('success_msg', 'successfully removed')
      res.redirect('/programmes-of-study')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/programmes-of-study')
    }
  }

}

module.exports = ProgrammeOfStudyController
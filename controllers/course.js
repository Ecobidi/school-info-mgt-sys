const CourseService = require('../services/course')
const ProgrammeOfStudyService = require('../services/programme_of_study')

class CourseController {

  static async getCoursesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || CourseService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let courses, totalDocuments
    if (search) {
      courses = await CourseService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await CourseService.countMatchingDocuments(search)
    } else {
      courses = await CourseService.findAll({limit: limit_size, offset})
      totalDocuments = await CourseService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('courses', {courses, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createCoursePage(req, res) {
    let programmes_of_study = await ProgrammeOfStudyService.findAll({limit: 10000})
    res.render('courses-new', {programmes_of_study})
  }

  static async createCourse(req, res) {
    let dao = req.body

    if (! Array.isArray(dao.programmes_of_study)) {
      let tempArray = []
      tempArray.push(dao.programmes_of_study)
      dao.programmes_of_study = tempArray
    }

    let p_of_study = await ProgrammeOfStudyService.findBySerialNumbers(dao.programmes_of_study)

    dao.names_of_programmes_of_study = []

    for (const {name} of p_of_study) {
      dao.names_of_programmes_of_study.push(name)
    }
    try {
      await CourseService.create(dao)
      req.flash('success_msg', "Course added")
      res.redirect('/courses')
    } catch (err) {
      console.log(err)
      res.redirect('/courses')
    }
  }

  static async removeCourse(req, res) {
    try {
      let doc = await CourseService.removeOne(req.params.course_id)
      req.flash('success_msg', 'Course removed')
      res.redirect('/courses')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/courses')
    }
  }

}

module.exports = CourseController
const DepartmentService = require('../services/department')

class DepartmentController {

  static async getDepartmentsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || DepartmentService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let departments, totalDocuments
    if (search) {
      departments = await DepartmentService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await DepartmentService.countMatchingDocuments(search)
    } else {
      departments = await DepartmentService.findAll({limit: limit_size, offset})
      totalDocuments = await DepartmentService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('departments', {departments, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createDepartmentPage(req, res) {
    res.render('departments-new')
  }

  static async createDepartment(req, res) {
    let dao = req.body

    try {
      await DepartmentService.create(dao)
      req.flash('success_msg', "Department added")
      res.redirect('/departments')
    } catch (err) {
      console.log(err)
      res.redirect('/departments')
    }
  }

  static async removeDepartment(req, res) {
    try {
      let doc = await DepartmentService.removeOne(req.params.department_id)
      req.flash('success_msg', 'Department removed')
      res.redirect('/departments')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/departments')
    }
  }

}

module.exports = DepartmentController
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const StudentService = require('../services/student')
const ProgrammeOfStudyService = require('../services/programme_of_study')
const DepartmentModel = require('../models/department')
const ProgrammeOfStudyModel = require('../models/programme_of_study')

class StudentController {

  static async getStudentProfilePage(req, res) {
    let serial_number = req.params.serial_number
    let student = await StudentService.findBySerialNumber(serial_number)
    res.render('student-profile', { student })
  }

  static async getStudentsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || StudentService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let students, totalDocuments
    
    if (search) {
      students = await StudentService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await StudentService.countMatchingDocuments(search)
    } else {
      students = await StudentService.findAll({limit: limit_size, offset})
      totalDocuments = await StudentService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('students', {students, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createStudentPage(req, res) {
    const departments = await DepartmentModel.find()
    const programmes_of_study = await ProgrammeOfStudyModel.find()

    res.render('students-new', {departments, programmes_of_study})
  }

  static async createStudent(req, res) {
    let dao = req.body
    console.log(dao)
    let programme_of_study = await ProgrammeOfStudyService.findBySerialNumber(dao.programme_of_study)
    dao.name_of_programme_of_study = programme_of_study.name
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(320, 280).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/students")
        dao.photo = imageInfo.url
        dao.photo_public_id = imageInfo.public_id
      }
      await StudentService.create(dao)
      req.flash('success_msg', "Student successfully added")
      res.redirect('/students')
    } catch (err) {
      console.log(err)
      res.redirect('/students')
    }
  }

  // TODO Implement Image Cleanup After Student Removal

  static async removeStudent(req, res) {
    try {
      let doc = await StudentService.removeOne(req.params.student_id)
      // remove photo
      if (doc.photo_public_id) {
        let result = await removeUploadedFile(doc.photo_public_id)  
      }
      // await fs.unlink(process.cwd() + '/uploads/images/members/' + doc.photo)
      req.flash('success_msg', 'Student removed successfully')
      res.redirect('/students')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/students')
    }
  }

}

module.exports = StudentController
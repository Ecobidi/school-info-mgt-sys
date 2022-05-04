const ResultService = require('../services/result')
const StudentService = require('../services/student')

const ProgrammesOfStudyModel = require('../models/programme_of_study')
const CourseModel = require('../models/course')

const getGrade = (score) => {
  let grade
  if (score > 75 && score < 100) {
    grade = { key: 'A', value: 4 }
  } else if (score > 70 && score < 75) { 
    grade = { key: 'AB', value: 3.5 }
  } else if (score > 65 && score < 70) { 
    grade = { key: 'B', value: 3.25 }
  } else if (score > 60 && score < 65) { 
    grade = { key: 'BC', value: 3.0 }
  } else if (score > 55 && score < 60) { 
    grade = { key: 'C', value: 2.75 }
  } else if (score > 50 && score < 55) { 
    grade = { key: 'CD', value: 2.50 }
  } else if (score > 45 && score < 50) { 
    grade = { key: 'D', value: 2.25 }
  } else if (score > 40 && score < 45) { 
    grade = { key: 'E', value: 2.00 }
  } else {
    grade = { key: 'F', value: 0.00 }
  }

  return grade
}

class ResultController {

  static async getResultsPage(req, res) {
    let programmes_of_study = await ProgrammesOfStudyModel.find()
    res.render('results-homepage', {programmes_of_study})
  }

  static async getStudentResult(req, res) {
    let {level, session, semester, student_reg_no} = req.query
    console.log(req.query)
    
    try {
      let student = await StudentService.findByRegNo(student_reg_no)
      if (!student ) throw new Error('No student found')
      let results = await ResultService.findStudentResults({level, session, semester, student_reg_no: student.reg_no, programme_of_study: student.programme_of_study})
      
      res.render('student/student-result', { results, level, semester, session, student })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error Fetching Student Result. Ensure that provided data is correct')
      res.redirect('/students/results')
    }
  }
 
  static async createResultPage(req, res) {
    console.log(req.query)
    try {
      let course = await CourseModel.findOne({course_code: req.query.course_code})
      let student
      if (req.query.student_reg_no) {
        student =  await StudentService.findByRegNo(req.query.student_reg_no)
      } else {
        student = await StudentService.findBySerialNumber(req.query.student_serial_number)
      }
      res.render('result-new', { course, student, query : req.query })
    } catch (error) {
      console.log(error)
      req.flash('err_msg', 'Error Fetching Relevant Data')
      res.redirect('/results')
    }
  }

  static async createResult(req, res) {
    let dao = req.body
    let student = await StudentService.findById(dao.student)
    dao.student_reg_no = student.reg_no
    let course = await CourseModel.findById(dao.course)
    dao.course_code = course.course_code
    dao.course_unit = course.course_unit
    dao.programme_of_study = student.programme_of_study
    dao.name_of_programme_of_study = student.name_of_programme_of_study

    let grade = getGrade(Number.parseFloat(dao.ca_score) + Number.parseFloat(dao.exam_score))
    dao.grade = {
      grade_name: grade.key,
      grade_point: grade.value
    }
    try {
      // check for already exising result and remove it
      let existingStudentCourseResult = await ResultService.findSpecific(dao)
      if (existingStudentCourseResult) await existingStudentCourseResult.delete()

      await ResultService.create(dao)
      res.json({message: 'Result saved'})
    } catch (err) {
      console.log(err)
      res.status(400).json({message: 'Error saving result'})
    }

  }

  static async removeResult(req, res) {
    try {
      let doc = await ResultService.removeOne(req.params.result_id)
      req.flash('success_msg', 'Result removed')
      res.redirect('/results')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/results')
    }
  }

}

module.exports = ResultController
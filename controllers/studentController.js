const StudentService = require('../services/student')
const CourseService = require('../services/course')
const RegisteredCourseService = require('../services/registered_course')
const ResultService = require('../services/result')

class StudentController {
  static async getHomePage(req, res) {
    let student = req.session.student
    res.render('student/home', {student} )
  }

  static async registerCoursePage(req, res) {
    let {level, session, semester} = req.query
    try {
      let courses = await CourseService.findSpecific({level, session, semester})
      // console.log(courses)
      let totalCourseUnits = 0
      courses.forEach(c => totalCourseUnits += c.course_unit )
      res.render('student/register-semester-course', { courses, level, semester, session, totalCourseUnits, student: req.session.student })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An error occured')
      res.redirect('/student')
    }
  }

  static async submitCourseRegistration(req, res) {
    let dao = req.body
    dao.student_reg_no = req.session.student.reg_no
    dao.programme_of_study = req.session.student.programme_of_study
    dao.name_of_programme_of_study = req.session.student.name_of_programme_of_study
    try {
      let existingSemesterCourseRegistration = await RegisteredCourseService.findSpecific({level: dao.level, session: dao.session, semester: dao.semester, student_reg_no: req.session.student.reg_no})
      // remove existing entry if any
      if (existingSemesterCourseRegistration) {
        await existingSemesterCourseRegistration.delete()
      }
      // let courses = await CourseModel.find({serial_number: dao.courses})
      // dao.courses = courses.map(({course_title, course_code, course_unit, elective_status}) => ({course_title, course_code, course_unit, elective_status}))
      
      await RegisteredCourseService.create(dao)
      req.flash('success_msg', 'Semester Course Registration Successful')
      res.redirect('/student/preview-courses')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An error occured')
      res.redirect('/student') 
    }
  }

  static async getSelectCourseFormPage(req, res) {
    let student = req.session.student
    res.render('student/preview-courses', {student} )
  }

  static async getCourseFormPage(req, res) {
    let {level, session, semester} = req.query
    try {
      let doc = await RegisteredCourseService.findSpecific({level, session, semester, student_reg_no: req.session.student.reg_no})
      let totalCourseUnits = 0
      doc.courses.forEach(c => totalCourseUnits += c.course_unit )
      res.render('student/course-form', { courses: doc.courses, level, semester, session, totalCourseUnits, student: req.session.student })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'An error occured')
      res.redirect('/student/preview-courses')
    }
  }

  static async getSelectResultPage(req, res) {
    res.render('student/select-result')
  }

  static async getResultPage(req, res) {
    let {level, session, semester} = req.query
    let student_reg_no = req.session.student.reg_no
    
    try {
      let student = req.session.student
      // if (!student ) throw new Error('Invalid Request: No Matching Student Found!')
      let results = await ResultService.findStudentResults({level, session, semester, student_reg_no, programme_of_study: student.programme_of_study})
      
      res.render('student/student-result', { results, level, semester, session, student })
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error Fetching Student Result. Ensure that provided data is correct')
      res.redirect('/students/results')
    }
  }

  static async getLoginPage(req, res) {
    res.render('student/login')
  }

  static async handleLogin(req, res) {
    let dao = req.body
    try {
      let student = await StudentService.findByRegNo(dao.reg_no)
      if (student && student.password == dao.password) {
        req.session.student = student
        res.redirect('/student')
      } else {
        req.flash('error_msg', 'Incorrect Login Details')
        res.redirect('/student/login')
      }
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Something went wrong, try again!')
      res.redirect('/student/login')
    }
  }

  static async handleLogout(req, res) {
    res.session.student = null
    res.redirect('/student/login')
  }

}


module.exports = StudentController
const RCModel = require('../models/registered_course')

class RegisteredCourseService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return RCModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return RCModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await RCModel.find({ $or: [{course_title: pattern}, {course_code: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ student_reg_no = '', level = '', session = '', semester = '' }, {offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return RCModel.find({student_reg_no, level, session, semester}).skip(offset).limit(limit)
  }

  static async findSpecific({student_reg_no = '', level = '', session = '', semester = '' }) {
    let result = RCModel.findOne({level, session, semester, student_reg_no})
    if (result) {
      result.populate('courses')
    } else {
      result = null
    }
    return result
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await RCModel.count({ $or:[{course_title: pattern}, {course_code: pattern}]})
    } else {
      numberOfDocs = await RCModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return RCModel.create(dao)
  }

  static async updateOne(update) {
    return RCModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return RCModel.findOneAndDelete({serial_number})
  }

}

module.exports = RegisteredCourseService
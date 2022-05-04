const ResultModel = require('../models/result')

class ResultService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return (await ResultModel.findById(id)).populate('course')
  }

  static async findBySerialNumber(serial_number) {
    return ResultModel.findOne({serial_number}).populate(await ResultModel.findById(id)).populate('course')
  }

  static async findByStudentRegNumber(student_reg_no) {
    return ResultModel.findOne({student_reg_no})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await ResultModel.find({ $or: [{student_reg_no: pattern}, {programme_of_study: pattern}]}).skip(offset).limit(limit).populate(await ResultModel.findById(id)).populate('course')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return ResultModel.find().skip(offset).limit(limit).populate(await ResultModel.findById(id)).populate('course')
  }

  static async findSpecific({student_reg_no, course_code, level = '', session = '', semester = '', programme_of_study }) {
    return ResultModel.findOne({student_reg_no, course_code, level, session, semester, programme_of_study}).populate('course')
  }

  static async findStudentResults({student_reg_no, level = '', session = '', semester = '', programme_of_study }) {
    return ResultModel.find({student_reg_no, level, session, semester, programme_of_study}).populate('course')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await ResultModel.count({ $or: [{student_reg_no: pattern}, {programme_of_study: pattern}]})
    } else {
      numberOfDocs = await ResultModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return ResultModel.create(dao)
  }

  static async updateOne(update) {
    return ResultModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return ResultModel.findOneAndDelete({serial_number})
  }

}

module.exports = ResultService
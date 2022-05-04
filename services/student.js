const StudentModel = require('../models/student')

class StudentService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return StudentModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return StudentModel.findOne({serial_number}).populate('programme_of_study.courses')
  }

  static async findByRegNo(reg_no) {
    return StudentModel.findOne({reg_no})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await StudentModel.find({ $or: [{department_serial_number: pattern}, {first_name: pattern}, {surname: pattern}, {middle_name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return StudentModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await StudentModel.count({ $or: [{department_serial_number: pattern}, {first_name: pattern}, {surname: pattern}, {middle_name: pattern}]})
    } else {
      numberOfDocs = await StudentModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return StudentModel.create(dao)
  }

  static async updateOne(update) {
    return StudentModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return StudentModel.findOneAndDelete({serial_number})
  }

}

module.exports = StudentService
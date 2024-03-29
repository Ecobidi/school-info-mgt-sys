const CourseAllocationModel = require('../models/course_allocation')

class CourseAllocationService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return CourseAllocationModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return CourseAllocationModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await CourseAllocationModel.find({ $or: [{course_title: pattern}, {course_code: pattern}, {department_name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return CourseAllocationModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await CourseAllocationModel.count({ $or:[{course_title: pattern}, {course_code: pattern}, {department_name: pattern}]})
    } else {
      numberOfDocs = await CourseAllocationModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return CourseAllocationModel.create(dao)
  }

  static async updateOne(update) {
    return CourseAllocationModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return CourseAllocationModel.findOneAndDelete({serial_number})
  }

}

module.exports = CourseAllocationService
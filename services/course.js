const CourseModel = require('../models/course')

class CourseService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return CourseModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return CourseModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await CourseModel.find({ $or: [{course_title: pattern}, {course_code: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return CourseModel.find().skip(offset).limit(limit)
  } 

  static async findSpecific({level = '', semester = '' }) {
    return CourseModel.find({level, semester})
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await CourseModel.count({ $or:[{course_title: pattern}, {course_code: pattern}]})
    } else {
      numberOfDocs = await CourseModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return CourseModel.create(dao)
  }

  static async updateOne(update) {
    return CourseModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return CourseModel.findOneAndDelete({serial_number})
  }

}

module.exports = CourseService
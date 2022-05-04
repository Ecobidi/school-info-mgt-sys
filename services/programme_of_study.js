const ProgrammeOfStudyModel = require('../models/programme_of_study')

class ProgrammeOfStudyService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return ProgrammeOfStudyModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return ProgrammeOfStudyModel.findOne({serial_number})
  }

  static async findBySerialNumbers(serial_numbers) {
    return ProgrammeOfStudyModel.find({serial_number: serial_numbers})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await ProgrammeOfStudyModel.find({ $or: [{name: pattern}, {department: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return ProgrammeOfStudyModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await ProgrammeOfStudyModel.count({ $or: [{name: pattern}, {department: pattern}]})
    } else {
      numberOfDocs = await ProgrammeOfStudyModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return ProgrammeOfStudyModel.create(dao)
  }

  static async updateOne(update) {
    return ProgrammeOfStudyModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return ProgrammeOfStudyModel.findOneAndDelete({serial_number})
  }

}

module.exports = ProgrammeOfStudyService
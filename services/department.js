const DepartmentModel = require('../models/department')

class DepartmentService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return DepartmentModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return DepartmentModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await DepartmentModel.find({ $or: [{name: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return DepartmentModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await DepartmentModel.count({ $or: [{name: pattern}]})
    } else {
      numberOfDocs = await DepartmentModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return DepartmentModel.create(dao)
  }

  static async updateOne(update) {
    return DepartmentModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return DepartmentModel.findOneAndDelete({serial_number})
  }

}

module.exports = DepartmentService
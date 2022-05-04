const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let DepartmentSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  faculty_school: {
    type: String, 
    required: true
  },
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

DepartmentSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("departments_id")
  }
  next()
})

module.exports = mongoose.model('department', DepartmentSchema)

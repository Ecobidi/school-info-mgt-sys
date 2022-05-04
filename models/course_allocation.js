const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let CourseAllocationSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'course'
  },
  course_title: String,
  course_code: String,
  department: {
    type: mongoose.Types.ObjectId,
    ref: 'department'
  },
  department_name: String,
  level: {
    type: String,
  },
  session: {
    type: String,
  },
  semester: {
    type: String,
  },
  elective_status: {
    type: String,
    enum: ['core', 'elective'],
    default: 'elective'
  }
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

CourseAllocationSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("course_allocations_id")
  }
  next()
})

module.exports = mongoose.model('course_allocation', CourseAllocationSchema)

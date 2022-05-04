const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let CourseSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  course_title: {
    type: String,
    required: true,
  },
  course_code: {
    type: String, 
    required: true
  },
  course_unit: {
    type: Number,
    required: true,
  },
  names_of_programmes_of_study: [{
    type: String,
  }],
  programmes_of_study: [{
    type: Number
  }],
  // session: {
  //   type: String,
  // },
  level: {
    type: String,
  },
  semester: {
    type: String,
    enum: ['First Semester', 'Second Semester']
  },
  elective_status: {
    type: String,
    enum: ['core', 'elective'],
    default: 'core'
  }
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

CourseSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("courses_id")
  }
  next()
})

module.exports = mongoose.model('course', CourseSchema)

const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let RegisteredCourseSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  student_reg_no: {
    type: String,
  },
  courses: [{
    type: mongoose.Types.ObjectId,
    ref: 'course'
  }],
  programme_of_study: {
    type: Number,
  },
  name_of_programme_of_study: {
    type: String,
  },
  level: {
    type: String,
    enum: ['ND 1', 'ND 2', 'HND 1', 'HND 2']
  },
  session: {
    type: String,
  },
  semester: {
    type: String,
    enum: ['First Semester', 'Second Semester']
  },
})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

RegisteredCourseSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("registered_courses_id")
  } 
  next()
})

module.exports = mongoose.model('registered_course', RegisteredCourseSchema)

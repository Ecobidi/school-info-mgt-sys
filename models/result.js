const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let ResultSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'student'
  }, 
  student_reg_no: String,
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'course'
  },
  course_code: String,
  course_unit: Number,
  ca_score: {
    type: Number,
    required: true,
  },
  exam_score: {
    type: Number,
    required: true,
  },
  grade: {
    grade_name: String,
    grade_point: Number
  },
  programme_of_study: Number,
  name_of_programme_of_study: String,
  level: String,
  semester: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

ResultSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("results_id")
  }
  next()
})

module.exports = mongoose.model('result', ResultSchema)

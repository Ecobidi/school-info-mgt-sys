const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let ProgrammeOfStudy = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String, 
  },
  courses: [{
    type: mongoose.Types.ObjectId,
    ref: 'course'
  }]
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

ProgrammeOfStudy.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("programmes_of_study_id")
  }
  next()
})

module.exports = mongoose.model('programme_of_study', ProgrammeOfStudy)

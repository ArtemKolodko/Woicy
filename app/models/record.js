var mongoose = require('mongoose');

RecordSchema = mongoose.Schema({
    _id: String,
    userid: String,
    name: String,
    data: []
});

RecordSchema.statics.append = function(user, data, done) {

    /*var Record = this;

    Record.create(
        {
            userid: user._id,
            data: data
        },
        function(err, data){
            if(err) throw err;
            done(null, data);
        }
    );
    */
    var newRecord = new Record({name: "name_"+user._id, userid: user._id});
    newRecord.save(function (err) {
        console.log(newRecord);
    });
}

RecordSchema.statics.getRecordsById = function(id, data, done) {
    Record.find({ userid: id }, function(err, records){
        done(records);
    });
}

var Record = mongoose.model("Record", RecordSchema);
module.exports = Record;
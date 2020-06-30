const fs = require('fs');

let synsetMap = new Map();




module.exports.Initialize = function(){

    // read the file
    // build the map
    var jsonText;
    fs.readFile('./try.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        // console.log('File data:', jsonString)
        jsonText = JSON.parse(jsonString);

    })
}

module.exports.Query = function(nameToLookup){
    const out1 = synsetMap.get(nameToLookup)
}
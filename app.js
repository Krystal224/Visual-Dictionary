var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var d3 = require('d3');
var clone = require('rfdc')();//For 400% Fast Deep Copy

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.set('view engine','html');

module.exports = app;
const fs = require('fs');

// var dictionaryModule = require('./WordNetDict/SynsetMap.js');
// dictionaryModule.Initialize();


// var jsonText;
// fs.readFile('./try.json', 'utf8', (err, jsonString) => {
//     if (err) {
//         console.log("File read failed:", err)
//         return
//     }
//     // console.log('File data:', jsonString)
//     jsonText = JSON.parse(jsonString);
//
// })

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));
// var jsonText = fs.readFileSync('Synset_verb.json');
// var jsonObj = JSON.parse(jsonText);


// app.get('/all/:userid',(req,res)=> {
//     // const nameToLookup = req.params.userid;
//     // const out = jsonText[nameToLookup];
//     // if(out){
//     //     res.send(out);
//     // }
//     // else{
//     //     res.send('No result');
//     // }
//     const test = jsonText['breathe.v.01']
//     res.send(test);
//
// });


var jsonText;
fs.readFile('./0412noun.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    // console.log('File data:', jsonString);
    jsonText = JSON.parse(jsonString);

});


// <--------- Initialize the Map Object Data Base ----------------->//
let myMap = new Map();
app.get('/initialize',(req,res) =>{

    var word_list = new Set(); //create a new set to store unique words
    for (var attributename in jsonText){

        for (i=0;i<jsonText[attributename].Synonym.length;i++){
            word_list.add(jsonText[attributename].Synonym[i])
        }
        // myMap.set(attributename,syn_list)
    }

    var array_unique = Array.from(word_list); //convert set of unique words to list


    //loop through each unique word
    for (j = 0;j < array_unique.length;j++){
        var syn_list = [];

        //loop through each synset
        for(var synset_name in jsonText){
            var synonym_list = jsonText[synset_name].Synonym
            var exist = -1

            //loop through each Synonym of the synset
            for(k = 0;k < synonym_list.length; k++){
                var check_word = synonym_list[k]
                if (array_unique[j] == check_word){
                    //Append this synset to syn_list
                    syn_list.push(jsonText[synset_name])
                    break;// Exist this inner for loop of Synonym
                }
            }
        }

        //Put unique word and its syn_list into a Map
        myMap.set(array_unique[j],syn_list);

    }// End of outer For Loop

    res.send("Initialize data");
});
//<----------------------- End of Initializing ---------------------- !>

app.post('/users/:userid',(req,res)=>{
    const nameToLookup = req.params.userid;
    console.log('Test!!!');
    const out = myMap.get(nameToLookup);

    if(out == null){
        console.log("NULL")
        res.send('Not founded')
    }
    else{
        console.log(out);
        res.send(out);
    }

});

//query data when click on <a> of synonym for details
app.get('/results/:userid',(req,res)=>{
    const nameToLookup = req.params.userid;

    // dictionaryModule.Query(nameToLookUp);
    let out1 = myMap.get(nameToLookup);
    res.send(out1);
    console.log('send finish')
});

//query data when click on <a> of synonym for details
app.get('/synsets/:userid',(req,res)=>{
    let jsonText_c = clone(jsonText);
    const nameToLookup = req.params.userid;
    const out2 = jsonText_c[nameToLookup]
    const hypon = out2.children
    // res.send(out2);
    // console.log('send2 finish');


    //Create a children list
    const child_list = []
    if (hypon.length != 0){
        let i;
        for (i = 0; i<hypon.length;i++){
            child_list.push(jsonText_c[hypon[i]])
        }
    }

    //remove null elements from children list

    let children = child_list.filter(function (el) {
        return el != null;
    });


    // Re-structure the children node to prepare for the tree structure
    let j;
    if (children.length != 0){
        for(j = 0; j< children.length; j++){
            // let id = children[j].Synset_name;
            children[j]["name"] = children[j].name;
            //Assign parent ID
            children[j]["parent"] = nameToLookup;
            //Assign children ID
            // children[j]["children_list"] = children[j]["Hyponyms_list"]

            // delete children[j]["children"]
            children[j]["children"] = []

            // delete children[j]["Hyperyms"]
            // delete children[j]["Synset_name"]
        }

    }

    //Build the tree structure

    let out3 = out2
    out3.name = out3.name;
    out3.parent = "null";
    // delete out3.Synset_name;
    // delete out3.Hyperyms;
    out3.children = children;
    // delete out3.Hyponyms_list;

    console.log('TREE!!!');
    console.log(out3);

    res.send(out3);


});

app.post('/add_nodes',(req,res)=>{
    let jsonText_c = clone(jsonText);
    let new_names = req.body['0[]'];
    let index;
    let new_data=[];
    for(index = 0; index<new_names.length; index++){
        //Find a list of children for each new name
        let new_children = jsonText_c[new_names[index]]
        new_children = new_children.children;
        //Find information of each children
        let index2;
        new_data[index] = [];
        for(index2 = 0; index2<new_children.length;index2++){
            if(jsonText_c[new_children[index2]] != null){
                let add = jsonText_c[new_children[index2]]
                delete add.children;
                new_data[index].push(add);
            }
        }
    }

    console.log("querying new data");
    console.log(new_data);
    res.send(new_data);
});
//query data to create inner hypon cards for each synset result


app.post('/hypon_card',(req,res)=>{
    console.log('REQUESTING!!!')
    let request_list = req.body['0[]']; //get the list of hyponyms ready to fetch from json files
    console.log(request_list)
    let fetch_object = []

    let i;
    for(i=0; i<request_list.length;i++){
            let request_word = request_list[i];
            let fetch_content = jsonText[request_word];
            if(fetch_content != null){
                fetch_object.push(fetch_content);
            }
    }
    console.log("PRINTING");
    console.log(fetch_object);

    res.send(fetch_object);
});

app.post('/path_card',(req,res)=>{
    console.log('REQUESTING PATH!!!')
    let request_list = req.body['0[]']; //get the list of hyponyms ready to fetch from json files
    console.log(request_list)
    let fetch_object = []


    //CASE 1: If the the request is only one word not a list of words
    if (typeof(request_list) == "string"){
        fetch_object.push(jsonText[request_list]);
        console.log("interable ",fetch_object)
        res.send(fetch_object);
    }
    else{

        let i;
        for(i=0; i<request_list.length;i++){

            let request_word = request_list[i];
            let fetch_content = jsonText[request_word];
            if(fetch_content != null){
                fetch_object.push(fetch_content);
            }
        }

        res.send(fetch_object);
    }

    // console.log(fetch_object);

});



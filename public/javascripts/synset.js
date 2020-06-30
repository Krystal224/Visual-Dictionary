
//Constructor: Synset
function Synset(sd){
    this.synset = sd;
    this.nameEle = null;
    this.def = null;
    this.eg = null;
    // this.synonym = null;
    //     // this.hyperym = null;
    //     // this.hyponyms_list = null
    //     // this.hyper_path = null;
    //     // this.expand_button = null;
    //     // this.visualElement = null;
    this.CreateVisualElement();
}

Synset.prototype.CreateVisualElement = function(){
    // div
    let node = document.createElement('div');
    let index = this.synset.name;
    let object = this.visualElement = d3.select(node).append('a')
        .attr('class', 'synset square')
        .attr('id', index)
        .attr('href','/synset.html?'+ index);

    object.style('text_decoration','none');


    // this.visualElement = d3.select(node)
    //     .attr('class', 'synset square')
    //     .attr('id', index)
    //     .attr('href','/expand_detail.html?'+ index);

    this.nameEle = this.visualElement.append('h4')
        .text(this.synset.name);

    this.def = this.visualElement.append('p')
        .text(this.synset.Definition);


    // this.def = this.visualElement.append(('h6').text("Definition:  ")+('p').text(this.synset.Definition))
    // this.def.append('p').text(this.synset.Definition)


    let e = this.synset.Example;
    if (e.length != 0){
        this.eg = this.visualElement.append('p')
            .text("Example:  "+this.synset.Example);
    }

    // < --------- Create <a> link for each synonym -------------> //
    // this.synonym = this.visualElement.append('p')
    //     .text("Synonyms:");
    //
    // let syn = this.synset.Synonym;
    // var i;
    // for(i=0; i<syn.length;i++){
    //     let content = syn[i]
    //     this.visualElement.append('a')
    //         .text(content + ", ")
    //         // .attr('id','link')
    //         // .attr('onclick','detect_function()')
    //         .attr('href','/synset.html?'+ content);
    //         // .text(content + ", ");
    // }
    //
    // // this.synonym = this.visualElement.append('p')
    // //     .text("Synonym: " + this.synset.Synonym)
    //
    // this.hyperym = this.visualElement.append('p')
    //     .text("Hyperym:  " + this.synset.Hyperyms)
    // this.hyponyms_list = this.visualElement.append('p')
    //     .text("Hyponym:  " + this.synset.Hyponyms_list)
    // this.hyper_path = this.visualElement.append('p')
    //     .text("Hyper Path:  " + this.synset.Hyper_path_list)

// <---- Do not deal with expand button for now -------->
    // this.expand_button = this.visualElement.append('button')
    //     .text('See more')
    //     .attr('onclick', 'expand_function()');


};

//The function CreateSynsets (run in index.js script)
var CreateSynsets = function(data){
    console.log(data);
    let synsets = [];
    for(let sd of data){
        let synset = new Synset(sd);
        synsets.push(synset);
    }
    console.log(synsets);
    let synsetVisuals = d3.select('#all_results').selectAll('.synset').data(synsets)
        .enter()
        .insert(function(d){
            return d.visualElement.node()});

    // synsetVisuals.style('left', function(d,i){
    //
    //
    // });
    // document.getElementById('all_results').appendChild(node)
};

function goBack() {
    console.log("GO BACK!")
    window.history.back();
}



// function detect_function(){
//     let extract = $('#link').text();
//     extract = 'results/' +extract.slice(0,-1);
//     console.log("read text: ",extract)
//
//     $.ajax({
//         url: extract,
//         type:'GET',
//         success: (data)=>{
//             console.log("request success!")
//             console.log(data);
//     }
//     });
// }
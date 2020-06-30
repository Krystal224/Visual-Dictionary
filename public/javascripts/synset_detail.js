
//Constructor: Synset_d
function Synset_d(sd){
    this.synset = sd;
    this.synonym = null;
    this.hyperym = null;
    this.hyponyms_list = null
    this.hyper_path = null;
    this.visualElement = null;
    this.CreateVisualElement();
}

Synset_d.prototype.CreateVisualElement = function(){
    // div
    let node = document.createElement('div');
    let index = this.synset.name;
    let object = this.visualElement = d3.select(node)
        .attr('class', 'synset_d')
        .attr('id', index)
        // .attr('href','/expand_detail.html?'+ index);


    // < --------- Create <a> link for each synonym -------------> //
    // this.synonym = this.visualElement.append('p')
    //     .text("Synonyms:");

    let syn = this.synset.Synonym;
    var i;
    for(i=0; i<syn.length;i++){
        let content = syn[i]
        this.visualElement.append('a')
            .text(content + ", ")
            .attr('href','/expand_detail.html?'+ content);
    }

    // this.synonym = this.visualElement.append('p')
    //     .text("Synonym: " + this.synset.Synonym)

};

//The function CreateSynsets (run in index.js script)
var CreateSynsets_d = function(data){
    console.log(data);
    let dt = new Synset_d(data)
    // let synsets = [];
    // for(let sd of data){
    //     let synset = new Synset_d(sd);
    //     synsets.push(synset);
    // }
    console.log(dt);
    let dtt = dt.visualElement.node()
    $("#all_results").html(dtt)
    // d3.select('#all_results').append(dtt)


};

function goBack() {
    console.log("GO BACK!")
    window.history.back();
}




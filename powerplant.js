#! /usr/bin/env node

var nomnom = require("nomnom");
var fs = require("fs");
var pdf = require("html-pdf");

nomnom.options({
  inputFile: {
    abbr: "i",
    full: "input",
    help: "Name of the JSON input file. If you don't specify a file, data will be read from stdin",
    metavar : "FILE"
  },
  outputFile:{
    abbr: "o",
    full: "output",
    help: "name of the output file",
    default : "powers.html",
    metavar: "FILE"
  },
  format: {
    abbr: "f",
    full: "format",
    default: "html",
    help: "Format to output the power cards in, either \'html\' or \'pdf\'"
  },
  hideFeats: {
    full: "hide-feats",
    default: false,
    flag: true,
    help: "call with --hide-feats to disable generation of feats at the end of the page"
  },
  hideHeader: {
    full: "hide-header",
    default: false,
    flag: true,
    help: "call with --hide-header to disable generation of the character header at the top of the page"
  }
}).script("powerplant");

function PowerPlant(format, input, output, hideFeats, hideHeader){
  this.data = input;
  this.format = format;
  this.outputFile = output;
  this.hideFeats = hideFeats;
  this.hideHeader = hideHeader;
}

PowerPlant.prototype = {
  outputFile: null,
  format:null,
  html: "<!DOCTYPE html><html>",
  data: null,
  typeToClass : { "At-Will" : "atWill", "Encounter" : "encounter", "Daily" : "daily", "Utility" : "utility" },
  hideHeader: false,
  hideFeats: false,
  buildCss : function buildCss(){
    var css = "";
    css += "body { font-family: Helvetica, sans-serif; font-size: 14px;}";
    css += ".card { width: 300px; height: 350px; display: inline-block; float: left; margin: 1px; page-break-inside: avoid;}";
    css += ".cardHeader { color: #FFFFFF; padding-left: 5px; padding-right: 5px; font-size: 16px; padding-top: 2px;}";
    css += ".atWill { background-color: #407040; }";
    css += ".encounter { background-color: #892a2a; }";
    css += ".daily { background-color: #1d1070; }";
    css += ".utility { background-color: #2e2e2e; }";
    css += ".left { float: left; }";
    css += ".right { float: right; }";
    css += ".clear { clear: both; }";
    css += ".header { font-size: 18px; clear: both;}";
    css += ".featTitle { font-size: 16px;}";
    css += "h1 { font-size: 18px; float: left;}";
    css += "h2 {font-size: 16px; float: right;}";
    css += ".featHeader { font-size: 18px;}";
    css += ".feat { padding: 5px; }";
    return css;
  },

  addHeader: function addHeader(){
      this.html += "<div><h1>" + this.data.character + "</h1><h2>Level " + this.data.level + " " + this.data.class + "</h2></div>";
      this.html += "<div class=\'clear\'></div>";
  },

  addDocumentHead: function addDocumentHead(){
    this.html += "<head>";
    this.html += "<title>Power Cards</title>";
    this.html += "</head>";
  },

  addStyle : function addStyle(){
    this.html += "<style type=\"text/css\">";
    this.html += this.buildCss();
    this.html += "</style>";
  },

  finishDocument : function finishDocument(){
    this.html += "</html>";
  },

  slug: function slug(text){
    return text.replace(/s+/g, "-");
  },

  addCards: function addCards(){
    var power;
    if(!this.data.powers){ return; }
    for(var i = 0; i < this.data.powers.length; i++){
      power = this.data.powers[i];
      this.html += "<div class=\'card\' id=\'" + this.slug(power.name) + "\'>";
      this.html += "<div class=\'cardHeader " + this.typeToClass[power.type] + "\'><span class=\'left\'><strong>" + power.name + "</strong></span><span class=\'right\'>" + power.level + "</span><div class=\'clear\'></div></div>";
      this.html += "<div class=\'clear\'><em>" + power.description + "</em></div>";
      this.html += "<div><strong>" + power.type + "</strong></div>";
      this.html += "<div>" + power.action_type + " | <strong>" + power.weapon_type + "</strong></div>";
      if(power.attack && power.targets){
        this.html += "<div><strong>" + power.attack + "</strong> | " + power.targets + "</div><br />";
      }
      if(power.requirement){
        this.html += "<div><strong>Requirement</strong>: " + power.requiremrent + "</strong></div>";
      }
      if(power.trigger){
        this.html += "<div><strong>Trigger</strong>: " + power.trigger + "</div>";
      }
      if(power.effect){
        this.html += "<div><strong>Effect</strong>: " + power.effect + "</div>";
      }
      if(power.hit){
        this.html += "<div><strong>Hit</strong>: " + power.hit + "</div><br /><br />";
      }
      if(power.note){
        this.html += "<div><em>" + power.note + "</em></div>";
      }
      this.html += "</div>";
    }
  },

  addFeats: function addFeats(){
    var feat;
    this.html += "<div class=\'clear\'></div>";
    this.html += "<div class=\'featHeader\'><strong>Feats</strong></div>";
    if(!this.data.feats){ return; }
    for(var i = 0; i < this.data.feats.length; i++){
      feat = this.data.feats[i];
      this.html += "<div class=\'feat\'>";
      this.html += "<div class=\'featTitle\'><strong>" + feat.name + "</strong></div>";
      this.html += "<div><em>" + feat.prerequisite + "</em></div>";
      this.html += "<div>" + feat.benefit + "</div>";
      this.html += "</div>";
    }
  },

  start: function start(){
    this.addDocumentHead();
    this.addStyle();
    if(!this.hideHeader){
      this.addHeader();
    }
    this.addCards();
    if(!this.hideFeats){
      this.addFeats();
    }
    this.finishDocument();
    this.writeOut();
  },

  writeOut: function writeOut(){
    var bits = this.outputFile.split(".");
    if(bits.length > 1){
      //get all the pieces except the last to chop off the file extension (if there is one)
      this.outputFile = bits.slice(0,bits.length -1).concat;
    }
    if(this.format === "html"){
      this.outputFile += ".html";
      fs.writeFile(this.outputFile, this.html, function(error){
        if(error){
          throw error;
        }
      });
    }
    else if(this.format === "pdf"){
      this.outputFile += ".pdf";
      var options = { format : "Letter", type: "pdf" };
      pdf.create(this.html).toFile(this.outputFile, function(err, result){
        if(err){
          throw err;
        }
      });
    }
  }
};

(function main(){

  var opts = nomnom.parse();

  var rawData = "";
  var inputStream;
  var powerplant;
  if(opts.inputFile){
    inputStream = fs.createReadStream(opts.inputFile);
  }
  else{
    inputStream = process.stdin;
  }

  inputStream.on("data", function(chunk){
    rawData += chunk.toString();
  });
  inputStream.on("end", function(){
    powerPlant = new PowerPlant(opts.format, JSON.parse(rawData), opts.outputFile, opts.hideFeats, opts.hideHeader);
    powerPlant.start();
  });

})();

#! /usr/bin/env node

var nomnom = require("nomnom");
var fs = require("fs");

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
  }
});

function PowerPlant(format, input, output){
  this.data = input;
  this.format = format;
  this.outputFile = output;
}

PowerPlant.prototype = {
  outputFile: null,
  format:null,
  html: "<!DOCTYPE html><html>",
  data: null,
  typeToClass : { "At-Will" : "atWill", "Encounter" : "encounter", "Daily" : "daily" },
  buildCss : function buildCss(){
    var css = "";
    css += ".body { font-family: Helvetica, sans-serif; }";
    css += ".card { width: 350px; height: 400px; display: inline-block; }";
    css += ".header { color: #FFFFFF; }";
    css += ".atWill { background-color: #407040; }";
    css += ".encounter { background-color: #892a2a; }";
    css += ".daily { background-color: #892a2a; }";
    css += ".left { float: left; }";
    css += ".right { float: right; }";
    css += ".clear {clear: both; }";

    return css;
  },

  addHeader: function addHeader(){

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
    for(var i = 0; i < this.data.powers.length; i++){
      power = this.data.powers[i];
      this.html += "<div class=\'card\' id=\'" + this.slug(power.name) + "\'>";
      this.html += "<div class=\'header " + this.typeToClass[power.type] + "\'><span class=\'left\'><strong>" + power.name + "</strong></span><span class=\'right\'>" + power.level + "</span><div class=\'clear\'></div></div>";
      this.html += "<div class=\'clear\'><em>" + power.description + "</em></div>";
      this.html += "<div><strong>" + power.type + "</strong></div>";
      this.html += "<div>" + power.action_type + " | <strong>" + power.weapon_type + "</strong></div>";
      this.html += "<div><strong>" + power.attack + "</strong> | " + power.targets + "</div><br />";
      this.html += "<div><strong>Requirement</strong>: " + power.requirstrongent + "</div>";
      this.html += "<div><strong>Trigger</strong>: " + power.trigger + "</div>";
      this.html += "<div><strong>Effect</strong>: " + power.effect + "</div>";
      this.html += "<div><strong>Hit</strong>: " + power.hit + "</div><br /><br />";
      this.html += "<div><em>" + power.note + "</em></div>";
      this.html += "</div>";
    }
  },

  start: function start(){
    debugger;
    this.addDocumentHead();
    this.addStyle();
    this.addHeader();
    this.addCards();
    this.finishDocument();
    this.writeOut();
  },

  writeOut: function writeOut(){
    fs.writeFile(this.outputFile, this.html, function(error){
      if(error){
        throw error;
      }
    });
  }
};

(function main(){
  // var powerplant = new PowerPlant(null,null,null);
  // var fakeData = "{ \"powers\" : [{\"name\": \"Fading Strike\",\"type\": \"At-Will\",\"level\": 1,\"description\": \"You launch an attack against your foe and then back away for safety\",\"action_type\": \"Standard\",\"effect\": null,\"trigger\": null,\"requirement\": null,\"weapon_type\": \"Melee or Ranged\",\"targets\": \"One creature\",\"attack\": \"Dexterity vs. AC\",\"hit\": \"1[W] + Dexterity modifier damage, and you shift 2 squares to a square that is not adjacent to the target\",\"note\": \"Hunter Fighting Style: When making an opportunity attack, you can use this power in place of a melee basic attack\"}]}";
  // powerplant.data = JSON.parse(fakeData);
  //
  // powerplant.addCards();
  //
  // console.log(powerplant.html);

  debugger;
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
    powerPlant = new PowerPlant(opts.format, JSON.parse(rawData), opts.outputFile);
    powerPlant.start();
  });

})();
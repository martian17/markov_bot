const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();


//bitwise
/*
let NO_PREFIX = 1;
let NO_POSTFIX = 2;
let flagMatch = function(n,cmp){
    return n&cmp === cmp;
};
*/

let type1 = {};//([\,\.\/\\\;\:\*\+\[\]\=\(\)\"\'\?\!\#\$\%\&\_])
let type1str = ",.?!;:";
for(let i = 0; i < type1str.length; i++){
    type1[type1str[i]] = 1;
}


let tokenize = function(str){
    let words0 = str.split(/\s/);
    let words = [];
    for(let i = 0; i < words0.length; i++){
        let word = words0[i].trim();
        //if non alphabet dash hyphen
        let ww = word.match(/([a-zA-Z\-]+)|([0-9]+)|([\,\.\/\\\;\:\*\+\[\]\=\(\)\"\'\?\!\#\$\%\&\_])|([^0-9a-zA-Z\-\_]+)/g);
        if(!ww)continue;
        for(let j = 0; j < ww.length; j++){
            let w = ww[j];
            words.push(w);
        }
    }
    return words;
};

let generateTable = function(words){
    let table = {};
    table["."] = {};
    table["."][words[0]] = 1;
    for(let i = 0; i < words.length-1; i++){
        let word1 = words[i];
        let word2 = words[i+1];
        if(!(word1 in table))table[word1] = {};
        if(!(word2 in table[word1]))table[word1][word2] = 0;
        table[word1][word2]++;
    }
    //format table
    for(let word1 in table){
        let entry = table[word1];
        let sum = 0;
        for(let word2 in entry){
            sum += entry[word2];
        }
        let arr = [];
        let csum = 0;
        for(let word2 in entry){
            csum += entry[word2]/sum;
            arr.push([csum,word2]);
        }
        table[word1] = arr;
    }
    return table;
};


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", msg => {
    let str = msg.content;
    if (str.slice(0,2) === "/_") {
        //reading the first argument
        str = str.slice(2);
        let words = tokenize(str);
        let length = words.length;
        if(words[1] === "_" && words[0].match(/^[0-9]+$/)){
            length = parseInt(words[0]);
            words = words.slice(2);
        }
        let table = generateTable(words);
        //logging
        console.log(`author: ${msg.author.username}\n`+
                    `channel: ${msg.channel.name}\n`+
                    `guild: ${msg.channel.guild.name}\n`+
                    `time: ${new Date()}\n`+
                    `contents: ${str}`);
        console.log("");
        
        //generating text
        let prevWord = ".";
        let result = [];
        for(let i = 0; i < length; i++){
            let options = table[prevWord];
            if(!options){//no options, defaulting to 
                result.push(".");
                prevWord = ".";
                continue;
            }
            let rand = Math.random();
            for(let j = 0; j < options.length; j++){
                if(rand < options[j][0]){
                    let word = options[j][1];
                    result.push(word);
                    prevWord = word;
                    break;
                }
            }
        }
        let resultStr = result[0];
        for(let i = 1; i < result.length; i++){
            let w0 = result[i-1];
            let w1 = result[i];
            
            if(w1 in type1){
                resultStr += w1;
            }else{//reserve space
                resultStr += " "+w1;
            }
        }
        
        //new Discord.Message(client, {files: [canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })]}, msg.channel);
        //msg.reply(resultStr);
        msg.channel.send(resultStr);
        //msg.channel.send(msg.author.username+" said:",{files: [canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })]});
        /*
        .Attachments.Add(new Attachment(){
            ContentUrl = canvas.toDataURL();
        });
        */
        //msg.delete();
    }
});

client.login(process.env.TOKEN);


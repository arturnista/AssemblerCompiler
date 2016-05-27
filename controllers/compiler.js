var dic = require('./dictionary.js')

exports.compile = function (data, fnCallback) {
    result = {
        data: []
    }
    for (var i = 0; i < data.length; i++) {
        

        var line = interpretLine(data[i].line);
        result.data.push(line);
    }
    fnCallback(result);
}

interpretLine = function(line){
    var re = new RegExp('\,', 'g');

    var newLine = line.replace(re, ' ');
    newLine = newLine.replace(/\s+/g,' ').trim();
    var functionLine = newLine.split(' ');
    if(dic.isRFunc(functionLine[0])){
        return rFuncInterpret(line, functionLine);
    } else if(dic.isIFunc(functionLine[0])){
        return iFuncInterpret(line, functionLine);
    }
}

rFuncInterpret = function(original, addFunc){
    if(addFunc.lenght < 4){
        return console.log("ERRO, TRATAR")
    }
    if(addFunc[1].charAt(0) != '$' || addFunc[2].charAt(0) != '$' || addFunc[3].charAt(0) != '$'){
        return console.log("ERRO, TRATAR")
    }
    var set = dic.opShamtFunc(addFunc[0]);
    var funcData = {
        op : set.op,
        shamt : set.shamt,
        func : set.func,
        variable1 : dic.variableValue(addFunc[2]),
        variable2 : dic.variableValue(addFunc[3]),
        returnVar : dic.variableValue(addFunc[1])
    }

    var res = {
        assembly: original,
        binary: rFuncDataToBinary(funcData),
        hexa: rFuncDataToHexa(funcData)
    }

    return res;
}

rFuncDataToBinary = function(d){
    return pad(dec2bin(d.op), 6) +
           pad(dec2bin(d.variable1), 5) +
           pad(dec2bin(d.variable2), 5) +
           pad(dec2bin(d.returnVar), 5) +
           pad(dec2bin(d.shamt), 5) +
           pad(dec2bin(d.func), 6);
}

rFuncDataToHexa = function(d){
    return bin2hex(rFuncDataToBinary(d));
}

iFuncInterpret = function(original, addFunc){
    if(addFunc.lenght < 3){
        return console.log("ERRO, TRATAR")
    }
    if(addFunc[1].charAt(0) != '$'){
        return console.log("ERRO, TRATAR")
    }

    var set = dic.opShamtFunc(addFunc[0]);
    var funcData;
    if(addFunc[0] === "addi"){
        funcData = iFuncInterpretAddi(set, addFunc);
    } else {
        funcData = iFuncInterpretW(set, addFunc);
    }

    var res = {
        assembly: original,
        binary: iFuncDataToBinary(funcData),
        hexa: iFuncDataToHexa(funcData)
    }

    return res;
}

iFuncInterpretAddi = function(set, addFunc){
    var im = parseInt(addFunc[3]);
    if(im >= Math.pow(2,15)){
        return console.log("ERRO, TRAVAR")
    }
    var funcData = {
        op : set.op,
        variable1 : dic.variableValue(addFunc[2]),
        variable2 : im,
        returnVar : dic.variableValue(addFunc[1])
    }

    return funcData;
}

iFuncInterpretW = function(set, addFunc){
    var data = addFunc[2].replace("("," ").replace(")", "").split(" ");

    var funcData = {
        op : set.op,
        variable1 : dic.variableValue(data[1]),
        variable2 : parseInt(data[0]),
        returnVar : dic.variableValue(addFunc[1])
    }

    return funcData;
}

iFuncDataToBinary = function(d){
    var im = dec2bin(d.variable2);
    // Necessary because javascript works with 32bits variables
    if(d.variable2 < 0){
        var strNum = "" + dec2bin(d.variable2);
        im = strNum.substring(15,31);
    }

    return pad(dec2bin(d.op), 6) +
           pad(dec2bin(d.variable1), 5) +
           pad(dec2bin(d.returnVar), 5) +
           pad(im, 16);
}

iFuncDataToHexa = function(d){
    return bin2hex(iFuncDataToBinary(d));
}

dec2bin = function(dec){
    return (dec >>> 0).toString(2);
}

bin2hex = function(dec){
    return parseInt(dec, 2).toString(16).toUpperCase();
}

pad = function(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

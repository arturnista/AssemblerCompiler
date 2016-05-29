var dic = require('./dictionary.js');
var tm = require('./throwMessages.js');

exports.compile = function (data, fnCallback) {
    result = {
        data: []
    }
    var error = [];
    for (var i = 0; i < data.length; i++) {
        try{
            var oriLine = data[i].line;
            if(oriLine == "")
                continue;
            var line = interpretLine(data[i].line);
            result.data.push(line);
        } catch(err){
            error.push({
                mess: err,
                line: i+1
            })
        }
    }
    fnCallback(result, error);
}

interpretLine = function(line){
    var functionLine = line.replace(/\,/g, ' ');
    functionLine = functionLine.replace(/\s+/g,' ').trim();
    functionLine = functionLine.split(' ');

    if(dic.isRFunc(functionLine[0])){
        return rFuncInterpret(line, functionLine);
    } else if(dic.isIFunc(functionLine[0])){
        return iFuncInterpret(line, functionLine);
    } else if(dic.isJFunc(functionLine[0])){
        return jFuncInterpret(line, functionLine);
    } else {
        throw ("Função inválida");
    }
}

rFuncInterpret = function(original, addFunc){
    if(addFunc.length !== 4){
        throw ("Número de variáveis errado. Esperando 3 variáveis.");
    }
    if(addFunc[1].charAt(0) != '$' || addFunc[2].charAt(0) != '$' || addFunc[3].charAt(0) != '$'){
        throw ("Uma das variáveis não inicia com $.");
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
    if(addFunc[1].charAt(0) != '$'){
        throw ("Variável não inicia com $.");
    }

    var set = dic.opShamtFunc(addFunc[0]);
    var funcData;
    if(addFunc[0] === "lw" || addFunc[0] === 'sw'){
        funcData = iFuncInterpretW(set, addFunc);
    } else {
        funcData = iFuncInterpretNormal(set, addFunc);
    }

    var res = {
        assembly: original,
        binary: iFuncDataToBinary(funcData),
        hexa: iFuncDataToHexa(funcData)
    }

    return res;
}

iFuncInterpretW = function(set, addFunc){
    if(addFunc.length > 3){
        throw ("Número de variáveis errado. Esperando 2 variáveis.");
    }


    var lineTest = addFunc[2].match(/\d+\(.*\)/);
    if(lineTest[0] !== addFunc[2]){
        throw ("Sintaxe do posicionamento inválida.");
    }

    var data = addFunc[2].replace("("," ").replace(")", " ").split(" ");
    if(isNaN(data[0])){
        throw ("Immediate informado não é um número");
    }
    var funcData = {
        op : set.op,
        variable1 : dic.variableValue(data[1]),
        variable2 : parseInt(data[0]),
        returnVar : dic.variableValue(addFunc[1])
    }

    return funcData;
}

iFuncInterpretNormal = function(set, addFunc){
    if(addFunc.length > 4){
        throw ("Número de variáveis errado. Esperando 3 variáveis.");
    }
    if(isNaN(addFunc[3])){
        throw ("Immediate informado não é um número");
    }
    var im = parseInt(addFunc[3]);
    if(im >= Math.pow(2,15)){
        throw ("Valor maior que 26 bits.");
    }
    var funcData = {
        op : set.op,
        variable1 : dic.variableValue(addFunc[2]),
        variable2 : im,
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

jFuncInterpret = function(original, addFunc){
    if(addFunc.length !== 2){
        throw ("Esperando somente um valor para immediate");
    }
    if(isNaN(addFunc[1])){
        throw ("Immediate informado não é um número");
    }
    var ind = parseInt(addFunc[1]);
    if(ind > Math.pow(2, 26)){
        throw ("Immediate informado é maior que 26bits.");
    }

    var set = dic.opShamtFunc(addFunc[0]);
    var funcData = {
        op : set.op,
        returnVar : ind
    }

    var res = {
        assembly: original,
        binary: jFuncDataToBinary(funcData),
        hexa: jFuncDataToHexa(funcData)
    }

    return res;
}

jFuncDataToBinary = function(d){
    return pad(dec2bin(d.op), 6) +
           pad(dec2bin(d.returnVar), 26);
}

jFuncDataToHexa = function(d){
    return bin2hex(jFuncDataToBinary(d));
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

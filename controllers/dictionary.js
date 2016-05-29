var tm = require('./throwMessages.js');

exports.variableValue = function(variable){
    var err = tm.fnInvalidVariable(variable);
    if(variable.charAt(0) != '$'){
        throw (err);
    }
    switch(variable){
        case '$0':
            return 0;
            break;
        case '$at':
            return 1;
            break;
        case '$gp':
            return 28;
            break;
        case '$sp':
            return 29;
            break;
        case '$s8':
            return 30;
            break;
        case '$fp':
            return 30;
            break;
        case '$ra':
            return 31;
            break;
    }
    if(isNaN(variable.charAt(2)))
        throw (err);
    var nm = parseInt(variable.charAt(2));
    switch(variable.charAt(1)){
        case 'v':
            if(nm > 1)
                throw (err);
            return 2 + nm;
            break;
        case 'a':
            if(nm > 3)
                throw (err);
            return 4 + nm;
            break;
        case 't':
            if(nm < 8){
                return 8 + nm;
            } else if(nm >= 8 || nm <= 9){
                return 24 + nm;
            } else {
                throw (err);
            }
            break;
        case 'k':
            if(nm > 1)
                throw (err);
            return 26 + nm;
            break;
        case 's':
            if(nm > 7)
                throw (err);
            return 16 + nm;
            break;
        default:
            throw (err);
            break;
    }
}

exports.opShamtFunc = function(val){
    res = {
        op: 0,
        shamt: 0,
        func: 0
    }
    switch(val){
        case "add":
            res.func = 32;
            break;
        case "sub":
            res.func = 34;
            break;
        case "and":
            res.func = 36;
            break;
        case "or":
            res.func = 37;
            break;
        case "slt":
            res.func = 42;
            break;
        case "addi":
            res.op = 8;
            break;
        case "andi":
            res.op = 14;
            break;
        case "ori":
            res.op = 13;
            break;
        case "slti":
            res.op = 10;
        case "lw":
            res.op = 35;
            break;
        case "sw":
            res.op = 43;
            break;
    }
    return res;
}

exports.isRFunc = function(val){
    var rFuncs = ["add", "sub", "and", "or", "slt"];
    return rFuncs.indexOf(val) !== -1;
}

exports.isIFunc = function(val){
    var iFuncs = ["addi", "andi", "ori", "lw", "sw", "slti", "beq"];
    return iFuncs.indexOf(val) !== -1;
}

exports.isJFunc = function(val){
    var jFuncs = ["j"];
    return jFuncs.indexOf(val) !== -1;
}

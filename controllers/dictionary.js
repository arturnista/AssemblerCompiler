exports.variableValue = function(variable){
    if(variable.charAt(0) != '$'){
        return 0;
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
    var nm = parseInt(variable.charAt(2));
    switch(variable.charAt(1)){
        case 'v':
            return 2 + nm;
            break;
        case 'a':
            return 4 + nm;
            break;
        case 't':
            if(nm < 8){
                return 8 + nm;
            } else {
                return 24 + nm;
            }
            break;
        case 'k':
            return 26 + nm;
            break;
        case 's':
            return 16 + nm;
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
        case "addi":
            res.op = 8;
            break;
        case "lw":
            res.op = 35;
            break;
        case "sw":
            res.op = 43;
            break;
    }
    return res;
}

rFuncs = ["add", "sub"];
exports.isRFunc = function(val){
    return rFuncs.indexOf(val) !== -1;
}

iFuncs = ["addi", "lw", "sw"];
exports.isIFunc = function(val){
    return iFuncs.indexOf(val) !== -1;
}

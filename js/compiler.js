function fnCompile() {
    var assemblerCode = $("#iTaxArea").val().split("\n");
    data = {};
    data.code = [];

    for (var i = 0; i < assemblerCode.length; i++) {
        var aux = {line: assemblerCode[i]};
        data.code.push(aux);
    }
    $.ajax({
        type: 'POST',
        data: data,
        url: '/compiler',            
        success: function(result) {
            fnAlert("#errorAlert", result.error, errorInitialText);
            fnAlert("#warningAlert", result.warning, warningInitialText);

            fnAppendResultToTable(result);
        }
    });
}
function fnAlert(id, data, initialText){
    if(data.length !== 0){
        $(id).html(initialText);
        for (var i = 0; i < data.length; i++) {
            var er = data[i];
            $(id).html($(id).html() + "<br/> Linha " + er.line + " : " + er.mess);
        }
        $(id).show();
    } else {
        $(id).hide();
    }
}

function fnAppendResultToTable(result){
    $("#tTable").show();
    // Initialize table
    $("#tTableBody tr").remove();
    var code = result.data;
    for (var i = 0; i < code.length; i++) {
        $("#tTableBody").append(fnBuildTableItem(code[i]));
    }
}
function fnBuildTableItem(item) {
    return "<tr>" + 
            "<td>" + item.assembly + "</td>" + 
            "<td>" + item.binary + "</td>" + 
            "<td>" + item.hexa + "</td>" + 
           "</tr>";
}

function fnCleanCode(){
    $("#iTaxArea").val("");
}

function fnSampleCode(){
    $.ajax({
        type: 'GET',
        url: '/samplecode',            
        success: function(result) {
            $("#iTaxArea").val(result.val);
        }
    });
}

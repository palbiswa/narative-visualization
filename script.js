$(document).ready(function(){

    $(homeClicked).add("#homeClickedButton").click(function(){        
        $("#homeDes").show();
        $("#cases").hide();    
        $("#death").hide();
        $("#vaccine").hide();
        $("#footTote").show();

        $("#caseClicked").css('background-color', '#f1f1f1');
        $("#deathClicked").css('background-color', '#f1f1f1');
        $("#vaccineClicked").css('background-color', '#f1f1f1');
      });    
   
    $("#caseClicked").add("#caseClickedButton").click(function(){
        //console.log("caseClicked");
        $("#homeDes").hide();
        $("#cases").show();    
        $("#death").hide();
        $("#vaccine").hide();
        $("#footTote").hide();
        
        
        $("#caseClicked").css('background-color', 'grey');
        $("#deathClicked").css('background-color', '#f1f1f1');
        $("#vaccineClicked").css('background-color', '#f1f1f1');
        $("#drawCaseBar").empty();
        drawCases();

      });

      $("#deathClicked").add("#deathClickedButton").click(function(){
        //console.log("deathClicked");
        $("#homeDes").hide();
        $("#cases").hide();    
        $("#death").show();
        $("#vaccine").hide();
        $("#footTote").hide();

        $("#caseClicked").css('background-color', '#f1f1f1');
        $("#deathClicked").css('background-color', 'grey');
        $("#vaccineClicked").css('background-color', '#f1f1f1');
        $("#drawDeathBar").empty();
        drawDeath();
    });

    $("#vaccineClicked").add(vaccineClickedButton).click(function(){
        //console.log("vaccineClicked");
        $("#homeDes").hide();
        $("#cases").hide();    
        $("#death").hide();
        $("#vaccine").show();
        $("#footTote").hide();

        $("#caseClicked").css('background-color', '#f1f1f1');
        $("#deathClicked").css('background-color', '#f1f1f1');
        $("#vaccineClicked").css('background-color', 'grey');
        $("input[name=doses][value=" + 'Doses-Administered' + "]").prop('checked', true);
        $("#drawVaccinationBar").empty();
        drawVaccination('Doses-Administered');
    });

    $("input[type='radio']").click(function(){
        var radioValue = $("input[name='doses']:checked").val();
        if(radioValue){            
            $("#drawVaccinationBar").empty();
            drawVaccination(radioValue);
        }
    });
});

function numberWithCommas(param) {    
    return param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function calculateSecondMax(arr,type){    
    const typeArray = [];
    arr.forEach(item => {
        typeArray.push(item[type]);        
    });
    var second_highest = typeArray.sort(function(a, b) { return b - a; })[1];
    return second_highest;

}
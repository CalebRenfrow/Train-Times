$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCunTrnC-QvIoUG7SxSlWe8DwCkeoKfpnM",
        authDomain: "train-station-e5a8d.firebaseapp.com",
        databaseURL: "https://train-station-e5a8d.firebaseio.com",
        projectId: "train-station-e5a8d",
        storageBucket: "train-station-e5a8d.appspot.com",
        messagingSenderId: "627224651566"
      };

      firebase.initializeApp(config);

      var database = firebase.database();

     
    $("#addTrain").on("click", function(){
        event.preventDefault();
    
      var  name = $("#name-input").val().trim();
      var  destination = $("#destination-input").val().trim();
      var  ftt = $("#ftt-input").val().trim();
      var  frequency = $("#frequency-input").val().trim();
    
      console.log(name + " " + destination + " " + ftt + " " + frequency);
    
     if (frequency > 0 && ftt !== "") {     //&&  ftt is in the proper format)
      console.log(ftt);
        database.ref().push({
          name:name,
          destination:destination,
          ftt:ftt,
          frequency:frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        
        });

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#ftt-input").val("");
        $("#frequency-input").val("");
      }
      else{
        alert("There is either an error with the First Train Time input or Frequency is not positve number!");
      }
      });

      database.ref().on("child_added",function(childSnapshot){
        var childSnapRef = childSnapshot.val();
        
        
        var tempFrequency = childSnapRef.frequency;
        var tempFTT = childSnapRef.ftt;
    
        // First Time (pushed back 1 year to make sure it comes before current time)
        var tempFTTConverted = moment(tempFTT, "hh:mm").subtract(1, "years");
    
        // Current Time
        var currentTime = moment();
      
        // Difference between the times
        var diffTime = moment().diff(moment(tempFTTConverted), "minutes");
        
        // Time apart (remainder)
        var tRemainder = diffTime % tempFrequency;
  
        // Minute Until Train
        var tMinutesTillTrain = tempFrequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        


        //append data to table
        var newTRow = $("<tr>");
        
        newTRow.append("<td>"+childSnapRef.name+"</td>");
        newTRow.append("<td>"+childSnapRef.destination+"</td>");
        newTRow.append("<td>"+childSnapRef.frequency+"</td>");
        newTRow.append("<td>"+nextTrain+"</td>");
        newTRow.append("<td>"+tMinutesTillTrain+"</td>");
        
        $(".train-table").append(newTRow);
        
    });


});
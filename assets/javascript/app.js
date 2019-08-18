// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// created a shortcut for firebase.database()
let database = firebase.database()

// declared variables that are empty & will be given values upon the click functions
let name = ""
let destination = ""
let firstTrainTime = ""
let frequency = ""

// will extract the values from the form and check to see if they are valid
$("#submit-train").on("click", function(event) {

        event.preventDefault();
        name = $("#train-name-input").val().trim()
        destination = $("#destination-input").val().trim()
        firstTrainTime = $("#first-train-input").val().trim()
        frequency = $("#frequency-input").val().trim()

        if (name.length < 1 || destination.length < 1 || firstTrainTime.length !== 5 || frequency.length < 1) {
            $(".error").empty()
            $(".error").append("**You Must Insert Valid Fields**")
            return;
        } else {
            // push my created object into the database
            firstTrainTime = moment(firstTrainTime, "HH:mm").format("x");
            database.ref("/New-Train").push({
                name,
                destination,
                firstTrainTime,
                frequency
            })

            $("#train-name-input").val("")
            $("#destination-input").val("")
            $("#first-train-input").val("")
            $("#frequency-input").val("")
            $(".error").empty()
        }

    })
    // whenever page is loaded or another object is added, run the calculations

database.ref("/New-Train").on("child_added", function(snapshot) {

    let name = snapshot.val().name
    let destination = snapshot.val().destination
    let frequency = snapshot.val().frequency
    let firstTrainTime = moment(snapshot.val().firstTrainTime, 'x')

    let arrival, minutes;

    if (moment().isBefore(firstTrainTime)) {
        arrival = firstTrainTime.format("HH:mm a");
        minutes = firstTrainTime.diff(moment(), 'minutes') + 1
    } else {
        let remainder = Math.abs(moment().diff(firstTrainTime, 'minutes')) % frequency;
        minutes = frequency - remainder;
        arrival = moment().add(minutes, "minutes").format("HH:mm a")
    }


    // let remainder = moment().diff(moment(firstTrainTime,"X"), "minutes") % frequency;  
    // let minutes = frequency - remainder;
    // let arrival = moment().add(minutes, "minutes").format("hh:mm A");



    // dynamically generate content based on what is in firebase & after calculations
    let newTr = $("<tr>")
    newTr.html(`<td>${name}</td><td>${destination}</td><td>${frequency}</td><td>${arrival}</td><td>${minutes}</td>`)

    $("#main-holder").append(newTr)

})
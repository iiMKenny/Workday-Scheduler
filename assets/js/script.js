// Jumbotron Date
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do YYYY, h:mmA"));

// Local Storage .description
var tasks = {
    "9am": [],
    "10am": [],
    "11am": [],
    "12pm": [],
    "13pm": [],
    "14pm": [],
    "15pm": [],
    "16pm": [],
    "17pm": []
};

var setTasks = function() {
    // tasks to be added to local storage upon entering text in .description
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var getTasks = function() {
    // retrieves tasks from localStorage

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        // creates a task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    // Executes correct past, present, future task. 
    auditTasks()
}

var createTask = function(taskText, hourDiv) {

    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

var auditTasks = function() {
    // Reflects time according to past, present, future colors.  

    var currentHour = moment().hour();
    $(".time-block").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {

    var timeBlock = textareaElement.closest(".time-block");
    var textArea = timeBlock.find("textarea");

    // Retrieves the time and text. 

    var time = timeBlock.attr("id");
    var text = textArea.val().trim();

    tasks[time] = [text]; 
    setTasks();

    createTask(text, timeBlock);
}

$(".task").click(function() {

    // Saves the tasks if they've been executed.
    
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    // converts the .description to a textarea that's editable as long as the time is present or future. 
    
    var time = $(this).closest(".time-block").attr("id");
    if (parseInt(time) >= moment().hour()) {

        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

timeToHour = 3600000 - today.milliseconds();
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeToHour);

getTasks();
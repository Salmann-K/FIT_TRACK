function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function openPushUpCounter() {
    window.open('./Exercises/pushUp/pushup-counter.html', '_blank');
}
function openLungesCounter() {
    window.open('./Exercises/lunges/lunges-counter.html', '_blank');
}
function openBicepCurlCounter() {
    window.open('./Exercises/bicepCurl/bicepcurl-counter.html', '_blank');
}
function openSquatCounter() {
    window.open('./Exercises/squat/squat-counter.html', '_blank');
}
function openBenchPressCounter() {
    window.open('./Exercises/benchPress/benchPress-counter.html', '_blank');
}
function openFrontRaiseCounter() {
    window.open('./Exercises/frontRaise/frontRaise-counter.html', '_blank');
}
function openInclinePressCounter() {
    window.open('./Exercises/inclinePress/inclinePress-counter.html', '_blank');
}
function openLateralRaiseCounter() {
    window.open('./Exercises/lateralRaise/lateralRaise-counter.html', '_blank');
}
function openOverHeadTricepCounter() {
    window.open('./Exercises/overheadTricep/overheadTricep-counter.html', '_blank');
}
function openShoulderPressCounter() {
    window.open('./Exercises/shoulderPress/shoulderPress-counter.html', '_blank');
}
function openTricepPushDownCounter() {
    window.open('./Exercises/tricepPushDown/tricepPushDown-counter.html', '_blank');
}

window.onload = function() {
    // Push a dummy state into history
    history.pushState(null, null, window.location.href);
    
    // Prevent going back to login page
    window.onpopstate = function(event) {
        history.pushState(null, null, window.location.href);
    };
};
function signInTransitionIn() {
    // Run the exitContent animation and then the enterContent animation
    // Use the recommended offset by leaving the offset argument empty to get the best performance
    WinJS.UI.Animation.exitPage($("#login-container").get(0), null).done(function () {
        $("#login-intro").css('display', 'none');
        $("#login-providers").css('display', 'block');
        return WinJS.UI.Animation.enterPage($("#login-container").get(0), null);
    });
}

function signInGoBack() {
    // Run the exitContent animation and then the enterContent animation
    // Use the recommended offset by leaving the offset argument empty to get the best performance
    WinJS.UI.Animation.exitPage($("#login-container").get(0), null).done(function () {
        $("#login-providers").css('display', 'none');
        $("#login-intro").css('display', 'block');
        return WinJS.UI.Animation.enterPage($("#login-container").get(0), null);
    });
}

function gameTransitionIn() {
    WinJS.UI.Animation.continuumForwardOut($("#cosmos-landing").get(0), null).done(function () {
        $("#cosmos-greeting").css('display', 'block');
        return WinJS.UI.Animation.continuumForwardIn($("#cosmos-greeting").get(0), null).done(function () {
            window.location.href = "/cosmos";
        });
    });
}

$(document).ready(function() {
    if(window.location.hash) {
        var hash = window.location.hash.substring(1);
        if(hash === 'signin') {
            signInTransitionIn();
        }
    }

    $("#option-play").first().click(function() {
        gameTransitionIn();
    });

    $("#option-signin").click(function() {
        signInTransitionIn();
    });

    $("#login-providers .screen-back").first().click(function() {
        signInGoBack();
    });

    WinJS.UI.Animation.enterPage([
        $('#cosmos-header').get(0), 
        $('#cosmos-login .login-options').get(0), 
    ], null);
});
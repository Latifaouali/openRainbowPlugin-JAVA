var accessToken; // Declare accessToken globally

function handleToken(callback) {
    const url = window.location.href;
    const fragmentIndex = url.indexOf('#');
    if (fragmentIndex !== -1) {
        const fragment = url.substring(fragmentIndex + 1);
        const fragmentParams = new URLSearchParams(fragment);
        accessToken = fragmentParams.get('access_token'); // Assign value to global accessToken variable
        if (accessToken) {
            // Call the SetToken.jsp to set the token
            setTokenRainbow(accessToken);
            document.getElementById('accessToken').innerText = accessToken;
            callback(accessToken); // Pass the accessToken to the callback function
        } else {
            console.error('Access token not found in URL fragment');
            callback(null); // Pass null if access token not found
        }
    } else {
        console.error('No fragment found in URL');
        callback(null); // Pass null if fragment not found
    }
}

// Function to call SetToken.jsp to set the token
function setTokenRainbow(accessToken) {
    // Use AJAX to call the JSP file
    var $j = jQuery.noConflict();
    $j.ajax({
        type: 'POST',
        url: '/jcms/plugins/newRainbowPlugin/jsp/app/SetToken.jsp',
        data: { 
            accessToken: accessToken
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error('Error setting token:', error);
        }
    });
}

// Call the handleToken function and pass a callback function to handle the accessToken
handleToken(function(accessToken) {
    // Define the accessToken globally or use it as needed
    window.accessToken = accessToken;
    console.log("accessToken", accessToken);
});

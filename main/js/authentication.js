const token = localStorage.getItem('jwtToken');

function isAuthenticated() {

    if (!token) {
        // No token found, return false
        return Promise.resolve(false);
    }

    return fetch('http://ecaru.xyz/dash_board/api/protected-route', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(function (response) {
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            // return false;
        });
}

function getRoleFromToken() {
    if (!token) {
        return false;
    }

    const parts = token.split('.');

    // Extract the payload from the token
    const encodedPayload = parts[1];

    // Decode the payload from Base64 encoding
    const decodedPayload = atob(encodedPayload);
    const payload = JSON.parse(decodedPayload);

    return payload.role;
}

function getUsernameFromToken() {
    const parts = token.split('.');
    const encodedPayload = parts[1];
    const decodedPayload = atob(encodedPayload);
    const payload = JSON.parse(decodedPayload);
    const username = payload.sub; // Assuming the username is stored in the 'sub' field
    return username;
}

const username = getUsernameFromToken();
const signedUserElement = document.getElementById('signedUser');
signedUserElement.textContent = username;

function signout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html';
}

var signoutButton = document.getElementById('signout');
signoutButton.addEventListener('click', signout);

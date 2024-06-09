document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    var form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the username and password input values
        var username = document.querySelector('input[type="text"]').value;
        var password = document.querySelector('input[type="password"]').value;

        // Perform form validation
        if (username === '' || password === '') {
            alert('Please enter both username and password.');
            return;
        }

        var data = {
            username: username,
            password: password
        };

        fetch('https://ecaru.xyz/dash_board/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(function(response) {
                if (response.ok) {
                    // Successful login
                    return response.text(); // Extract the JWT token from the response
                } else {
                    // Error in login
                    throw new Error('Login failed. Please check your credentials.');
                }
            })
            .then(function(token) {
                // Store the JWT token in localStorage
                localStorage.setItem('jwtToken', token);
                window.location.href = 'index.html'; // Redirect to the index.html page
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert(error.message);
            });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    var form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the username and password input values
        var admin_username = document.querySelector('input[name="ad_u"]').value;
        var admin_password = document.querySelector('input[name="ad_p"]').value;
        var username = document.querySelector('input[name="user"]').value;
        var password = document.querySelector('input[name="pass"]').value;

        // Perform form validation
        if (admin_username === '' || username === '' || admin_password === '' || password === '') {
            alert('Please enter all fields.');
            return;
        }

        var data = {
            username: username,
            password: password
        };

        fetch('https://isdom.online/dash_board/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Admin-Username': admin_username,
                'Admin-Password': admin_password
            },
            body: JSON.stringify(data)
        })
            .then(function(response) {
                if (response.ok) {
                    // Successful login
                    return response.text(); // Extract the JWT token from the response
                } else {
                    // Error in login
                    throw new Error('Signup failed.');
                }
            })
            .then(function(token) {
                localStorage.setItem('jwtToken', token);
                window.location.href = 'index.html'; // Redirect to the index.html page
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert(error.message);
                location.reload();
            });
    });
});

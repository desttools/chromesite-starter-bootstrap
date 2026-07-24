//Send email form input to user's email client

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // EDIT THESE... This is where you want the email to be sent and Subject Line. 
    const recipient = "support@example.com";
    const subject = "Contact from Website";

    // Grab and sanitize the user's inputs
    const name = encodeURIComponent(document.getElementById('name').value);
    const email = encodeURIComponent(document.getElementById('email').value);
    const comments = encodeURIComponent(document.getElementById('comments').value);

    const emailBody = `Hello ${recipientName},

    Name:  ${name}
    Email: ${email}
    Comments:
    ${comments}

    _______________________
    This message sent from the website.`;

    // Construct the mailto link
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${emailBody}`;

    // Trigger the user's native mail client
    window.location.href = mailtoUrl;
});
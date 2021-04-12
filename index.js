const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Validate full fields
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us1.api.mailchimp.com/3.0/lists/8228242ee3', {
    method: 'POST',
    headers: {
      Authorization: 'auth ccc3fb27fe5911f0d212d73f14a8bdf1-us1'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on ${PORT}`));

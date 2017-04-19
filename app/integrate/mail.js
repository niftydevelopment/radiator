'use strict';
const nodemailer = require('nodemailer');
const properties = require('./../properties');
var Promise = require('promise');

var createTransporter = function() {

  return new Promise(function(resolve, reject) {

    var mailproperties = properties.fetch('mail').then(mailproperties => {

      console.log('mailproperties.user', mailproperties.username);
      console.log('mailproperties.password', mailproperties.password);

      var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailproperties.username,
          pass: mailproperties.password
        }
      });

      resolve(transport);

    });


  });

}

var createMail = function(subject, body) {
  return mailOptions = {
    from: 'foobarbyradiator@gmail.com',
    to: 'demassinner@gmail.com ',
    subject: subject,
    text: body,
    html: '<b>' + body + '</b>'
  };
}

exports.sendmail = function(subject, body) {

  createTransporter().then(function(transport) {

    var mail = createMail(subject, body);

    transport.sendMail(mail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });

  })

}

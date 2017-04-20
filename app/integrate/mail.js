'use strict';
const nodemailer = require('nodemailer');
const properties = require('./../properties');
var Promise = require('promise');

var createTransporter = function() {
  return new Promise(function(resolve, reject) {

    var mailproperties = properties.fetch('mail').then(mailproperties => {

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
  var x = {
    from: 'foobarbyradiator@gmail.com',
    to: 'demassinner@gmail.com ',
    subject: subject,
    text: body,
    html: '<b>' + body + '</b>'
  };

  return x;
}

exports.send = function(subject, body) {

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

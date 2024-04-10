'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();
  app.route('/api/translate')
    .post((req, res) => {
      // IF text IS EMPTY:
      if(req.body.text == ""){
        res.send({error: "No text to translate"})
        return;
      }
      // IF ANY FIELD IS MISSING:
      if(!req.body.locale || !req.body.text){
        res.send({error: "Required field(s) missing"});
        return
      }
      // IF LOCALE IS INVALID
      if( req.body.locale != "american-to-british" && req.body.locale != "british-to-american" ){
        res.send({error: "Invalid value for locale field"})
        return
      }
      // IF REQUEST BODY IS VALID, TRANSLATE:
      res.send(translator.translate(req.body.text, req.body.locale))
    });
};

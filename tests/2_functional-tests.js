const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test("Translation with text and locale fields: POST request to /api/translate", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "Mr. Thompson went to the port/harbor at 5:15, bought an off-the-rack chapstick at the store, and he said its flavor was like 'cilantro'. He then had to eat some hard candy but it tasted like zucchini.",
                locale: "american-to-british"
            })
            .end((err, res)=>{
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200");
                assert.isObject(res.body, "Response should be an object");
                assert.property(res.body, "text", "Response object should have a 'text' property");
                assert.equal(res.body.text, "Mr. Thompson went to the port/harbor at 5:15, bought an off-the-rack chapstick at the store, and he said its flavor was like 'cilantro'. He then had to eat some hard candy but it tasted like zucchini.", "'text' property should be the original string");
                assert.equal(res.body.translation, `<span class="highlight">Mr</span> Thompson went to the port/<span class="highlight">harbour</span> at <span class="highlight">5.15</span>, bought an <span class="highlight">off-the-peg</span> <span class="highlight">lip balm</span> at the store, and he said its <span class="highlight">flavour</span> was like '<span class="highlight">coriander</span>'. He then had to eat some <span class="highlight">boiled sweets</span> but it tasted like <span class="highlight">courgette</span>.`, "all translateable terms should be translated and highlighted")
                done();
            })
    })
    test("Translation with text and invalid locale field: POST request to /api/translate", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "I'm agonizing",
                locale: "invalid-locale"
            })
            .end((err, res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200")
                assert.deepEqual(res.body, {error: 'Invalid value for locale field'}, "Response should be an object with 'error' property")
                done();
            })
    })
    test("Translation with missing text field: POST request to /api/translate", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                locale: "british-to-american"
            })
            .end((err, res)=>{
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200")
                assert.deepEqual(res.body, {error: 'Required field(s) missing'}, "Response should be an object with 'error' property")
                done();
            })
    })
    test("Translation with missing locale field: POST request to /api/translate", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "I love me some black pudding"
            })
            .end((err, res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "status should be 200");
                assert.deepEqual(res.body, { error: 'Required field(s) missing'}, "Response should be an object with 'error' property");
                done()
            })
    })
    test("Translation with empty text: POST request to /api/translate", (done)=>{
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "",
                locale: "american-to-british"
            })
            .end((err, res) => {
                if(err){console.log(err)}
                assert.equal(res.status, 200, "Status should be 200");
                assert.deepEqual(res.body, {error: 'No text to translate'}, "Response should be an object with 'error' property")
                done();
            })
    })
    test("Translation with text that needs no translation: POST request to /api/translate", (done) => {
        chai
            .request(server)
            .keepOpen()
            .post("/api/translate")
            .send({
                text: "This text reads the same in American English as in British English.",
                locale: "british-to-american"
            })
            .end((err, res) => {
                if(err){console.log(err)};
                assert.equal(res.status, 200, "Status should be 200");
                assert.deepEqual(res.body, {text: "This text reads the same in American English as in British English.", translation: "Everything looks good to me!"}, "res.body.translation should read 'Everything looks good to me!'")
                done();
            })
    })
});

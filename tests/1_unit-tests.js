const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Translator = require('../components/translator.js');
const translator = new Translator() // MY CODE

suite('Unit Tests', () => {
    let localeUS= "american-to-british";
    let localeUK= "british-to-american";
    let text;
    suite("American to British strings", ()=>{
        test("Mangoes are my favorite fruit", ()=>{
            text = "Mangoes are my favorite fruit.";
            assert.equal(translator.translate(text, localeUS).translation, `Mangoes are my <span class="highlight">favourite</span> fruit.`, "1) Should read 'favourite'") ;
        })
        test("I ate yogurt for breakfast", ()=>{
            text = "I ate yogurt for breakfast.";
            assert.equal(translator.translate(text, localeUS).translation, `I ate <span class="highlight">yoghurt</span> for breakfast.`, "2) Should read 'yoghurt'");
        })
        test("We had a party at my friend's condo", ()=>{
            text = "We had a party at my friend's condo.";
            assert.equal(translator.translate(text, localeUS).translation, `We had a party at my friend's <span class="highlight">flat</span>.`, "3) Should read 'flat'");
        })
        test("Can you toss this in the trashcan for me?", ()=>{
            text = "Can you toss this in the trashcan for me?";
            assert.equal(translator.translate(text, localeUS).translation, `Can you toss this in the <span class="highlight">bin</span> for me?`, "4) Should read 'bin'");
        })
        test("The parking lot was full.", ()=>{
            text = "The parking lot was full.";
            assert.equal(translator.translate(text, localeUS).translation, `The <span class="highlight">car park</span> was full.`, "5) Should read 'car park'");
        })
        test("Like a high tech Rube Goldberg machine.", ()=>{
            text = "Like a high tech Rube Goldberg machine.";
            assert.equal(translator.translate(text, localeUS).translation, `Like a high tech <span class="highlight">Heath Robinson device</span>.`, "6) Should read 'Heath Robinson device'");
        })
        test("To play hooky means to skip class or work.", ()=>{
            text = "To play hooky means to skip class or work.";
            assert.equal(translator.translate(text, localeUS).translation, `To <span class="highlight">bunk off</span> means to skip class or work.`, "7) Should read 'bunk off'");
        })
        test("No Mr. Bond, I expect you to die.", ()=>{
            text = "No Mr. Bond, I expect you to die.";
            assert.equal(translator.translate(text, localeUS).translation, `No <span class="highlight">Mr</span> Bond, I expect you to die.`, "8) Should read 'Mr'");
        })
        test("Dr. Grosh will see you now.", ()=>{
            text = "Dr. Grosh will see you now.";
            assert.equal(translator.translate(text, localeUS).translation, `<span class="highlight">Dr</span> Grosh will see you now.`, "9) Should read 'Dr'");
        })
        test("Lunch is at 12:15 today.", ()=>{
            text = "Lunch is at 12:15 today.";
            assert.equal(translator.translate(text, localeUS).translation, `Lunch is at <span class="highlight">12.15</span> today.`, "10) Should read '12.15'");
        })
    });
    suite("British to American strings", ()=>{
        test("We watched the footie match for a while.", ()=>{
            text = "We watched the footie match for a while.";
            assert.equal(translator.translate(text, localeUK).translation, `We watched the <span class="highlight">soccer</span> match for a while.`, "1) Should read 'soccer'");
        });
        test("Paracetamol takes up to an hour to work.", ()=>{
            text = "Paracetamol takes up to an hour to work.";
            assert.equal(translator.translate(text, localeUK).translation, `<span class="highlight">Tylenol</span> takes up to an hour to work.`, "2) Should read 'Tylenol'");
        });
        test("First, caramelise the onions", ()=>{
            text = "First, caramelise the onions.";
            assert.equal(translator.translate(text, localeUK).translation, `First, <span class="highlight">caramelize</span> the onions.`, "3) Should read 'caramelize'");
        });
        test("I spent the bank holiday at the funfair", ()=>{
            text = "I spent the bank holiday at the funfair.";
            assert.equal(translator.translate(text, localeUK).translation, `I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.`, "4) Should read 'public holiday' and 'carnival'");
        });
        test("I had a bicky then went to the chippy", ()=>{
            text = "I had a bicky then went to the chippy.";
            assert.equal(translator.translate(text, localeUK).translation, `I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.`, "5) Should read 'cookie' and 'fish-and-chip shop'");
        });
        test("I've just got bits and bobs in my bum bag", ()=>{
            text = "I've just got bits and bobs in my bum bag.";
            assert.equal(translator.translate(text, localeUK).translation, `I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.`, "6) Should read 'odds and ends' and 'fanny pack'");
        });
        test("The car boot sale at Boxted Airfield was called off", ()=>{
            text = "The car boot sale at Boxted Airfield was called off.";
            assert.equal(translator.translate(text, localeUK).translation, `The <span class="highlight">swap meet</span> at Boxted Airfield was called off.`, "7) Should read 'swap meet'");
        });
        test("Have you met Mrs Kalyani?", ()=>{
            text = "Have you met Mrs Kalyani?";
            assert.equal(translator.translate(text, localeUK).translation, `Have you met <span class="highlight">Mrs.</span> Kalyani?`, "8) Should read 'Mrs.'");
        });
        test("Prof Joyner of King's College, London", ()=>{
            text = "Prof Joyner of King's College, London.";
            assert.equal(translator.translate(text, localeUK).translation, `<span class="highlight">Prof.</span> Joyner of King's College, London.`, "9) Should read 'Prof.'");
        });
        test("Tea time is usually around 4 or 4.30", ()=>{
            text = "Tea time is usually around 4 or 4.30.";
            assert.equal(translator.translate(text, localeUK).translation, `Tea time is usually around 4 or <span class="highlight">4:30</span>.`, "10) Should read '4:30'");
        });
    })
    suite("Highlighted US → UK strings", ()=>{
        test("Mangoes are my favorite fruit", ()=>{
            text = "Mangoes are my favorite fruit.";
            assert.equal(translator.translate(text, localeUS).translation, `Mangoes are my <span class="highlight">favourite</span> fruit.`, "1) Should read 'favourite'") ;
        })
        test("I ate yogurt for breakfast", ()=>{
            text = "I ate yogurt for breakfast.";
            assert.equal(translator.translate(text, localeUS).translation, `I ate <span class="highlight">yoghurt</span> for breakfast.`, "2) Should read 'yoghurt'");
        })
    })
    suite("Highlighted UK → US strings", ()=>{
        test("We watched the footie match for a while.", ()=>{
            text = "We watched the footie match for a while.";
            assert.equal(translator.translate(text, localeUK).translation, `We watched the <span class="highlight">soccer</span> match for a while.`, "1) Should read 'soccer'");
        });
        test("Paracetamol takes up to an hour to work.", ()=>{
            text = "Paracetamol takes up to an hour to work.";
            assert.equal(translator.translate(text, localeUK).translation, `<span class="highlight">Tylenol</span> takes up to an hour to work.`, "2) Should read 'Tylenol'");
        });
    })
});

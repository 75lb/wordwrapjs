var test = require("tape");
var wrap = require("../");

var bars = "I'm rapping. I'm rapping. I'm rap rap rapping. I'm rap rap rap rap rappity rapping.";

test("simple", function(t){
    t.strictEqual(
        wrap(bars), 
        "I'm rapping. I'm rapping. I'm\nrap rap rapping. I'm rap rap\nrap rap rappity rapping."
    );
    t.end();
});

test("width", function(t){
    t.strictEqual(
        wrap(bars, { width: 3 }), 
        'I\'m\nrapping.\nI\'m\nrapping.\nI\'m\nrap\nrap\nrapping.\nI\'m\nrap\nrap\nrap\nrap\nrappity\nrapping.'
    );
    t.end();
});

test("ignore", function(t){
    t.strictEqual(
        wrap(bars, { ignore: "I'm" }), 
        'I\'m rapping. I\'m rapping. I\'m rap rap\nrapping. I\'m rap rap rap rap\nrappity rapping.'
    );
    t.end();
});


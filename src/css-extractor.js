(function(GLOBAL){

/*
@class CSSExtractor
Utility for running on a live document that will extract the CSS that affects only visible
elements at this time in this browser. Accepts a target selector as an input and will iterate
recursively through all childrens and extract current CSS applyed rules if element is
currently visible. It depends on jquery.

Use:
    var extractor = new CSSExtractor();
    var rules = extractor.extract('#main');
    console.log('all css affecting #main visible content is', rules.join(';'));

*/
var CSSExtractor = GLOBAL.CSSExtractor = function()
{

};

//@method extract public method for extracting CSS rules of visible elements contained in el 
// @param {String|HTMLElement|jQuery} el 
CSSExtractor.prototype.extract = function(el)
{
    var rules = {};
    this.doExtract(rules, el, true);

    var buffer = [];
    for (var i in rules) 
    {
        if (rules.hasOwnProperty(i)) 
        {
            buffer.push(i); 
        }
    }
    return buffer;
};

//@method doExtract the method that do the actual work. Recursive @param {String|HTMLElement|jQuery} el 
CSSExtractor.prototype.doExtract = function(buffer, el, asString)
{
    var self = this;
    if(CSSExtractor.isVisible(el))
    {
        var rules = this.extractElementCSS(el, asString); 
        // console.log(rules)
        for (var i = 0; i < rules.length; i++) 
        {
            var rule = rules[i]
            ,   ruleKey = CSSExtractor.ruleKey(asString, rule);
            buffer[ruleKey] = rule; //always replace rules
        }
    }
    CSSExtractor.visitChildren(el, function(child)
    {
        self.doExtract(buffer, child, asString);
    }); 
}; 

CSSExtractor.ruleKey = function(asString, r) 
{
    if(asString)
    {
        return r;
    }
    else
    {
        throw 'TODO'; 
    }
}; 

//@method extractElementCSS extracts the CSS of a single given element 
//@param a HTMLElement @return {Array<CSSStyleRule>|Array<String>} 
//@param {boolean} asString if true only the rule's css text will be returned
CSSExtractor.prototype.extractElementCSS = function(a, asString)
{
    var sheets = document.styleSheets
    ,   o = [];
    for (var i in sheets)
    {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules)
        {
            // console.log(a, rules[r].selectorText, CSSExtractor.elementMatches(a, rules[r].selectorText)); 
            if (CSSExtractor.elementMatches(a, rules[r].selectorText))
            {
                o.push( asString ? rules[r].cssText : rules[r] );
            }
        }
    }
    return o;
};



//the following are utility methods implemented with jquery and isolated from the rest of the code so jquery can be easily replaced with another library.


CSSExtractor.visitChildren = function(el, visitor)
{
    jQuery(el).children().each(function()
    {
        visitor.apply(this, [this, arguments]); 
    });
}; 

//@method jQueryMatches Element::matches emulation with jquery @static @param HTMLElement el @param {String} selector
CSSExtractor.elementMatches = function(el, selector)
{
    return jQuery(el).is(selector);
};

//@method isVisible @static @param {HTMLElement} el
CSSExtractor.isVisible = function(el)
{
    return jQuery(el).is(':visible');
};

})(window);


// //test
var extractor = new CSSExtractor();
var rules = extractor.extract('#main');
// copy('all css affecting #main visible content is\n\n'+ rules.join('\n'));
// console.log('all css affecting #main visible content is\n\n', rules.join('\n'));
jQuery('<pre></pre>').html(rules.join('\n')).appendTo('body'); 

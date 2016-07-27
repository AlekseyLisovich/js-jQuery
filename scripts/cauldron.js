"use strict";
// (function(){

var elements = [{
    label: "огонь",
    selector: ".fire",
    value: "fire",
}, {
    label: "вода",
    selector: ".water",
    value: "water"
}, {
    label: "земля",
    selector: ".earth",
    value: "earth"
}, {
    label: "воздух",
    selector: ".air",
    value: "air"
}, {
    label: "пыль",
    selector: ".dust",
    value: "dust"
}, {
    label: "болото",
    selector: ".swamp",
    value: "swamp"
}, {
    label: "энергия",
    selector: ".energy",
    value: "energy"
}, {
    label: "камень",
    selector: ".stone",
    value: "stone"
}, {
    label: "жизнь",
    selector: ".life",
    value: "life"
}, {
    label: "молоко",
    selector: ".milk",
    value: "milk"
}, {
    label: "сметанка",
    selector: ".sourcream",
    value: "sourcream"
}];

var TEMPLATE = "<table>";

var selectedElements = [];
var elementTop = 50;
var elementLeft = 50;
var str = "";

$('#choose_element').on('keyup', higlightSearchResult);

function higlightSearchResult(e) {

    var liElements = document.getElementsByTagName("li");
    str = e.target.value;

    for (var i = 0; i < liElements.length; i++) {
        elem = liElements[i];
        var value = elements[i].value;
        if (str !== "")
            elem.innerHTML = window.search(value, str)
        else
            elem.innerHTML = elements[i].value;
    }
}


window.search = function(text, valueToSearch) {
    var foundIndex = 0;
    var prevFoundIndex = 0;
    var resultStr = "";

    while (foundIndex > -1) {
        prevFoundIndex = foundIndex;
        foundIndex = text.substr(foundIndex).indexOf(valueToSearch);

        if (foundIndex !== -1) {
            foundIndex += prevFoundIndex;
            resultStr += text.substr(prevFoundIndex, foundIndex - prevFoundIndex) +
                "<span style='color: red'>" + text.substr(foundIndex, valueToSearch.length) + "</span>";
            foundIndex += valueToSearch.length;
        } else {
            resultStr += text.substr(prevFoundIndex);
        }
    }

    return resultStr;
}

function onElementRemoved(elem) {
    //console.log(selectedElements);
    selectedElements.splice(selectedElements.indexOf(elem), 1);
    var destinationElement = document.getElementById('resultBlock');
    destinationElement.innerHTML = "";
}

function onElementAdded(elem) {
    //console.log(selectedElements);
    selectedElements.push(elem);
    var selectedValues = _.map(selectedElements, "value");
    if (selectedValues.length > 0) {
        var foundFormula = _.find(formulas, function(formula) {
            console.log(formula.elements);
            //console.log(selectedValues);
            return formula.elements.length === selectedValues.length && !_.difference(formula.elements, selectedValues).length;

        });
        if (foundFormula) {
            var result = foundFormula.result;
            var destinationElement = document.getElementById('resultBlock');
            destinationElement.innerHTML = result;
        }
    }
}

elements.forEach(function(elem) {
    $(elem.selector).click(onElementClick.bind(null, elem));
});

function onElementClick(elem) {
    if (elem.wasClicked) {
        elementLeft += 20;
        $(elem.selector).animate({
            opacity: 1,
            marginLeft: "0in",
            marginTop: elementLeft + "px",
            fontSize: "14pt",
            borderWidth: "10px",
        }, 1500);
        elementTop = 50;
        onElementRemoved(elem);
    } else {
        elementTop += 40;
        $(elem.selector).animate({
            opacity: 0.7,
            marginLeft: "40%",
            marginTop: elementTop + "px",
            fontSize: "3em",
            borderWidth: "15px",
        }, 1500);
        elementLeft = 50;
        onElementAdded(elem);
    }
    elem.wasClicked = !elem.wasClicked;
}

// window.cauldron = {
//   render: function(elementId){
//     //1. Render DOM from TEMPLATE
//     //2. Render Elements and filter
//     //3. Assign Event Handlers
//
//   },
//   renderElements: function(elementId){
//
//   },
//   renderFilterInput: function(elementId){
//
//   }
// };
// })();

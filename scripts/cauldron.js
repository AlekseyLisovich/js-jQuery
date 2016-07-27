"use strict";

    var elements = [{
        label: "огонь",
        selector: ".fire",
        value: "fire"
    }, {
        label: "вода",
        selector: ".water",
        value: "water"
    }, {
        label: "земля",
        selector: ".earth",
        value: "earth"
    },{
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
    },{
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

    function CheckElements(str){
      for(var i = 0; i < formulas.length; i++)
      {
        if(formulas[i].elements == str)
          {
            return formulas[i].result;
            break;
          }
      }
    }

    var selectedElements = [];
    var elementTop = 100;
    var elementLeft = 50;

    function onElementRemoved(elem) {
        //console.log(selectedElements);
        selectedElements.splice(selectedElements.indexOf(elem), 1);
    }

    function onElementAdded(elem) {
        //console.log(selectedElements);
        selectedElements.push(elem);
        var selectedValues = _.map(selectedElements, "value");
        if (selectedValues.length > 0) {
            var formula = _.find(formulas, function(formula) {
               if(formula.elements.length === selectedValues.length)
                  if(_.difference(formula.elements, selectedValues).length === 0){
                var result = CheckElements(formula.elements);
                var destinationElement = document.getElementById('resultBlock');
                  destinationElement.innerHTML = result;
              }
            });
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
            elementTop = 100;
            onElementRemoved(elem);
        } else {
            elementTop += 40;
            $(elem.selector).animate({
                opacity: 0.7,
                marginLeft: "10in",
                marginTop: elementTop + "px",
                fontSize: "3em",
                borderWidth: "15px",
            }, 1500);
            elementLeft = 50;
            onElementAdded(elem);
        }
        elem.wasClicked = !elem.wasClicked;
    }

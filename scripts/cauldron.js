(function() {
    "use strict";

    var elements;
    var formulas;
    var DEFAULT_ELEMENT_HEIGTH = 60;
    var INCREMENT_HEIGTH = 20;
    var selectedElements = [];

    function higlightSearchResult(e) {

        var liElements = $("li");
        var result = e.target.value;
        for (var i = 0; i < elements.length; i++) {
            var elem = liElements[i];
            var value = elements[i].value;
            if (result !== "")
                $( elem ).html(window.search(value, result));
            else
                $( elem ).text(value);
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
        selectedElements.splice(selectedElements.indexOf(elem), 1);
        var destinationElement = document.getElementById('resultBlock');
        destinationElement.innerHTML = "";
    }

    function onElementAdded(elem) {
        selectedElements.push(elem);
        var selectedValues = _.map(selectedElements, "value");
        if (selectedValues.length > 0) {
            var foundFormula = _.find(formulas, function(formula) {
                return formula.elements.length === selectedValues.length && !_.difference(formula.elements, selectedValues).length;
            });
            if (foundFormula) {
                var result = foundFormula.result;
                var destinationElement = document.getElementById('resultBlock');
                destinationElement.innerHTML = result;
            }
            else {
              var destinationElement = document.getElementById('resultBlock');
              destinationElement.innerHTML = "";
            }
        }
    }

    function onElementClick(elem) {
        var elementOutsideCauldron;
        var elementInCauldron;
        var height;

        if (elem.wasClicked) {
            elementInCauldron = elements.indexOf(_.find(elements, 'wasClicked'));

            var tmp = elements[elementInCauldron];
            elements[elements.indexOf(elem)] = tmp;
            elements[elementInCauldron] = elem;

            height = DEFAULT_ELEMENT_HEIGTH + (elementInCauldron + 1) * INCREMENT_HEIGTH;
            $(elem.selector).animate({
                opacity: 1,
                marginLeft: "0%",
                marginTop: height + "px",
                fontSize: "18pt",
                borderWidth: "10px",
            }, 1500);
            onElementRemoved(elem);
        } else {
            elementOutsideCauldron = _.filter(elements, 'wasClicked').length;

            height = DEFAULT_ELEMENT_HEIGTH + (elementOutsideCauldron + 1) * INCREMENT_HEIGTH * 2;
            $(elem.selector).animate({
                opacity: 0.7,
                marginLeft: "40%",
                marginTop: height + "px",
                fontSize: "38pt",
                borderWidth: "15px",
            }, 1500);
            onElementAdded(elem);
        }
        elem.wasClicked = !elem.wasClicked;
    }

    function renderChauldron(container, el, fr) {
        elements = el;
        formulas = fr;

        var newList = $("<ul id='elements-list'></ul>");
        var liTop = DEFAULT_ELEMENT_HEIGTH;
        var elementIndex = 1;
        for (var i = 0; i < elements.length; i++) {
            var value = elements[i].value;
            var liElement = $("<li>" + value + "</li>");
            liTop += INCREMENT_HEIGTH;

            $(liElement).addClass("element");
            $(liElement).addClass("elem" + elementIndex++);
            $(liElement).css({
                'marginTop': liTop + 'px'
            });
            newList.append(liElement);
        }
        container.append("<div class='boiler'></div><div class='title'><label>Выберете ингредиент:</label></div><input type='text' id='choose_element' />");
        container.append(newList);
        container.append("<div id='resultBlock'></div>");

        $('#choose_element').on('keyup', higlightSearchResult);

        elements.forEach(function(elem) {
            $(elem.selector).click(onElementClick.bind(null, elem));
        });
    };

    window.cauldron = {
        render: renderChauldron
    }
})();

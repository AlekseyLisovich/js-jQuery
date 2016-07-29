(function() {
    "use strict";

    var elements;
    var formulas;

    var selectedElements = [];

    function higlightSearchResult(e) {

        var liElements = document.getElementsByTagName("li");
        var result = e.target.value;

        for (var i = 0; i < liElements.length; i++) {
            var elem = liElements[i];
            var value = elements[i].value;
            if (result !== "")
                elem.innerHTML = search(value, result)
            else
                elem.innerHTML = elements[i].value;
        }
    }

    function search(text, valueToSearch) {
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

    function clearResult() {
        document.getElementById('resultBlock').innerHTML = "";
    }

    function onElementRemoved(elem) {
        selectedElements.splice(selectedElements.indexOf(elem), 1);
        clearResult();
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
            } else {
                clearResult();
            }
        }
    }

    var clickedRight;
    var clickedLeft;

    function onElementClick(elem) {
        var elementTopLeft;
        var elementTopRigth;

        if (elem.wasClicked) {
            onElementRemoved(elem);

            clickedLeft = elements.indexOf(_.find(elements, 'wasClicked'));

            var tmp = elements[clickedLeft];
            elements[elements.indexOf(elem)] = tmp;
            elements[clickedLeft] = elem;

            elementTopLeft = 60 + (clickedLeft + 1) * 20;
            var animateProps = {

            }
            $(elem.selector).animate({
                opacity: 1,
                marginLeft: "0in",
                marginTop: elementTopLeft + "px",
                fontSize: "18pt",
                borderWidth: "10px",
            }, 1500);
        } else {
            onElementAdded(elem);
            clickedRight = _.filter(elements, 'wasClicked').length;

            elementTopRigth = 50 + (clickedRight + 1) * 40;
            $(elem.selector).animate({
                opacity: 0.7,
                marginLeft: "40%",
                marginTop: elementTopRigth + "px",
                fontSize: "3em",
                borderWidth: "15px",
            }, 1500);
        }

        elem.wasClicked = !elem.wasClicked;
    }

    function renderChauldron(container, el, fr) {
        elements = el;
        formulas = fr;

        var newList = $("<ul id='elements-list'></ul>");
        var liTop = 60;
        var elementIndex = 1;
        var value;
        var liElement;

        for (var i = 0; i < elements.length; i++) {
            value = elements[i].value;
            liElement = $("<li>" + value + "</li>");
            liTop += 20;

            $(liElement).addClass("element elem" + elementIndex++);
            $(liElement).css({
                'marginTop': liTop + 'px'
            });
            newList.append(liElement);
        }
        container.append("<div class='boiler'></div><div class='title'><label>Выберете ингредиент:</label></div><input type='text' id='choose_element' />");
        container.append(newList);
        container.append("<div id='resultBlock'></div>");

        $('#choose_element').on('keydown', _.debounce(higlightSearchResult, 200));

        elements.forEach(function(elem) {
            $(elem.selector).click(onElementClick.bind(null, elem));
        });
    };

    // 1. Исправить ошибку с позиционированием элементов
    // 2. Оформить как jQuery plugin
    // 3. Использовать везде jQuery или DOM API
    // 4. Вынести переменные в константы
    // 5. Переименовать некоторые переменные
    // 6. Изменить дизайн тестовой страницы
    // 7. Исправить рендер в меньшем блоке

    window.cauldron = {
        render: renderChauldron
    }
})();

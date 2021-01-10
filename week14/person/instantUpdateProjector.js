import { EDITABLE, LABEL, VALID, VALUE } from "../presentationModel/presentationModel.js";
import { HistogramView } from './person.js';
export { listItemProjector, selectListItemForModel, removeListItemForModel, formProjector, pageCss }

const masterClassName = 'instant-update-master'; // should be unique for this projector
const detailClassName = 'instant-update-detail';

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);


//update histogram
    textAttr.getObs(VALUE).onChange(text => {
        inputElement.value = text;
        updateHistogramView();
    });

    textAttr.getObs(VALID, true).onChange(
        valid => valid ?
        inputElement.classList.remove("invalid") :
        inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable ?
        inputElement.removeAttribute("readonly") :
        inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

const textInputProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 10;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const elementId = (attributeName, model) =>
    masterClassName + "." + model[attributeName].getQualifier();

const deleteButtonId = (attributeNames, model) => {
    const representativeAttributeName = attributeNames[0];
    return masterClassName + ".delete." + model[representativeAttributeName].getQualifier()
};

const selectListItemForModel = attributeNames => (newModel, oldModel) => {
    const oldDeleteButton = document.getElementById(deleteButtonId(attributeNames, oldModel));
    if (oldDeleteButton) {
        oldDeleteButton.classList.remove("selected");
    }
    const newDeleteButton = document.getElementById(deleteButtonId(attributeNames, newModel));
    if (newDeleteButton) {
        newDeleteButton.classList.add("selected");
    }
};

//update histogram
const removeListItemForModel = attributeNames => model => {
    const deleteButton = document.getElementById(deleteButtonId(attributeNames, model));
    if (deleteButton) {
        deleteButton.parentElement.removeChild(deleteButton);
    }
    attributeNames.forEach(attributeName => {
        const element = document.getElementById(elementId(attributeName, model));
        if (!element) { return; }
        element.parentElement.removeChild(element);
    });
    updateHistogramView();
};


//update histogram
const listItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {

    if (rootElement.style['grid-template-columns'] === '') {
        rootElement.classList.add(masterClassName);
        const columnStyle = '1.7em ' + attributeNames.map(x => 'auto').join(' ');
        rootElement.style['grid-template-columns'] = columnStyle;
    }

    const deleteButton = document.createElement("Button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = "&times;";
    deleteButton.onclick = _ => masterController.removeModel(model);
    deleteButton.id = deleteButtonId(attributeNames, model);

    const inputElements = [];

    attributeNames.forEach(attributeName => {
        const inputElement = textInputProjector(model[attributeName]);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        inputElement.id = elementId(attributeName, model);
        inputElements.push(inputElement);
    });

    rootElement.appendChild(deleteButton);
    inputElements.forEach(inputElement => rootElement.appendChild(inputElement));
    selectionController.setSelectedModel(model);
    updateHistogramView();

};

const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="${detailClassName}">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector("." + detailClassName);

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");
        inputElement.setAttribute("ID", attributeName);
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });
    if (undefined != model.detailed) {
        model.detailed.getObs(VALUE).onChange(newValue => {
            const parent = rootElement.parentElement
            if (newValue) {
                parent.classList.remove("no-detail");
            } else {
                parent.classList.add("no-detail");
            }
        })
    }

    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
};


//update the histogram
const updateHistogramView = () => {

    var ageInputList = document.querySelectorAll('[title="Age"]');
    var personAgeList = [];
    var totalAgeOfPerons = 0;
    var dataSet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var histogramLabelArray = ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90+"];
    var personAgeListData = [];
    if (ageInputList && ageInputList.length > 0) {
        ageInputList.forEach(inputElement => {
            if (inputElement.id != "age") {
                personAgeList.push(parseInt(inputElement.value ? inputElement.value : 0));
                totalAgeOfPerons = totalAgeOfPerons + parseInt(inputElement.value ? inputElement.value : 0);
            }


        });
    }
    if (personAgeList.length > 0) {
        personAgeList.forEach(age => {
            if (age >= 0 && age < 10) {
                var i = histogramLabelArray.indexOf("0-10");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 10 && age < 20) {
                var i = histogramLabelArray.indexOf("10-20");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 20 && age < 30) {
                var i = histogramLabelArray.indexOf("20-30");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 30 && age < 40) {
                var i = histogramLabelArray.indexOf("30-40");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 40 && age < 50) {
                var i = histogramLabelArray.indexOf("40-50");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 50 && age < 60) {
                var i = histogramLabelArray.indexOf("50-60");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 60 && age < 70) {
                var i = histogramLabelArray.indexOf("60-70");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 70 && age < 80) {
                var i = histogramLabelArray.indexOf("70-80");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 80 && age <= 10) {
                var i = histogramLabelArray.indexOf("80-90");
                dataSet[i] = dataSet[i] + 1;
            } else if (age >= 90) {
                var i = histogramLabelArray.indexOf("90+");
                dataSet[i] = dataSet[i] + 1;
            }
        });
        HistogramView(dataSet, document.getElementById('histogramContainer'));
    }
}


const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1.7em auto auto; /* default: to be overridden dynamically */
        margin-bottom:  0.5em ;
    }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
    .no-detail {
        opacity:        0.2;
        transition:     transform ease-both 0.5s;
        transition-delay: 200ms;
        transform:      rotateX(-60deg);
        transform-origin: top center;
    }
`;
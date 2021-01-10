import { Attribute, LABEL, VALUE } from "../presentationModel/presentationModel.js";
import { formProjector, listItemProjector, selectListItemForModel, removeListItemForModel, pageCss } from "./instantUpdateProjector.js";

export { MasterView, DetailView, HistogramView, Person, selectionMold, reset, ALL_ATTRIBUTE_NAMES }

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname', 'age'];

let idCounter = 0;
const nextId = () => idCounter++;


//added age
const Person = () => { // facade
    const id = nextId();
    const firstnameAttr = Attribute("Monika", `Person.${id}.firstname`);
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr = Attribute("Mustermann", `Person.${id}.lastname`);
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    const ageAttr = Attribute("34", `Person.${id}.age`);
    ageAttr.getObs(LABEL).setValue("Age");

    const detailedAttr = Attribute(true, `Person.${id}.detailed`);


    lastnameAttr.setConverter(input => input.toUpperCase()); // enable for playing around
    lastnameAttr.setValidator(input => input.length >= 3);

    ageAttr.setValidator(input => input.length <= 3);

    return {
        firstname: firstnameAttr,
        lastname: lastnameAttr,
        age: ageAttr,
        detailed: detailedAttr,
        toString: () => firstnameAttr.getObs(VALUE).getValue() + " " + lastnameAttr.getObs(VALUE).getValue() + " " + ageAttr.getObs(VALUE).getValue(),
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {

    const render = person =>
        listItemProjector(listController, selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    console.log(render)

    // binding
    listController.onModelAdd(render);
    listController.onModelRemove((removedModel, removeMe) => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES)(removedModel);
        removedModel.firstname.setQualifier(undefined); // remove model attributes from model world
        removedModel.lastname.setQualifier(undefined);
        removedModel.age.setQualifier(undefined); // this could become more convenient
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES));
};

const reset = person => {
    person.firstname.setQualifier(undefined); // todo: make generic, unset all qualifiers
    person.lastname.setQualifier(undefined);
    person.age.setQualifier(undefined);
    person.firstname.setConvertedValue("");
    person.lastname.setConvertedValue("");
    person.age.setConvertedValue("");
    return person;
};

const selectionMold = reset(Person());

const DetailView = (selectionController, rootElement) => {

    formProjector(selectionController, rootElement, selectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected(selectedPersonModel => { // todo: make this generic
        // set the qualifiers to connect detailModel with current selection
        // todo: set the values for _all_ observables

        selectionMold.firstname.setQualifier(selectedPersonModel.firstname.getQualifier());
        selectionMold.lastname.setQualifier(selectedPersonModel.lastname.getQualifier());
        selectionMold.age.setQualifier(selectedPersonModel.age.getQualifier());
        selectionMold.detailed.setQualifier(selectedPersonModel.detailed.getQualifier());
    });

    selectionController.clearSelection();
};

//view for histogram
const HistogramView = (data, rootElement) => {
    const ctx = document.getElementById('histogram').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90+"],
            datasets: [{
                label: "No. of persons per Age Group",
                data: data,
                backgroundColor: 'green',
            }]
        },
    });

}
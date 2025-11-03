const PEOPLE_CONTAINER = document.getElementById('people');
const RESULT_CONTAINER = document.getElementById('result');
const AMOUNT_INPUT = document.getElementById('amount');
const DAYS_INPUT = document.getElementById('days');
const PERSON_TEMPLATE = document.getElementById('person-template');

const DEFAULT_AMOUNT = 1_000;
const DEFAULT_DAYS = 7;

class Person {
  constructor(name, days, recalculateFn) {
    this._name = name;
    this._days = Number(days) || 0;
    this.element = null;
    this.recalculateFn = recalculateFn;
    this.render();
  }

  get name() {
    return this._name;
  }

  get days() {
    return this._days;
  }

  set name(name) {
    this._name = name;
    if (this.element) {
      const nameInput = this.element.querySelector('.person-name');
      if (nameInput) {
        nameInput.value = name;
      }
    }
    if (this.recalculateFn) {
      this.recalculateFn();
    }
  }

  set days(days) {
    this._days = Number(days) || 0;
    if (this.element) {
      const daysInput = this.element.querySelector('.person-days');
      if (daysInput) {
        daysInput.value = this._days;
      }
    }
    if (this.recalculateFn) {
      this.recalculateFn();
    }
  }

  render() {
    // Remove existing element if it exists
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }

    // Create new element from template
    const personElement = PERSON_TEMPLATE.content.cloneNode(true);
    this.element = personElement.querySelector('.person');
    
    // Set initial values
    const nameInput = this.element.querySelector('.person-name');
    const daysInput = this.element.querySelector('.person-days');
    
    if (nameInput) {
      nameInput.value = this._name;
      nameInput.addEventListener('input', (e) => {
        e.preventDefault();
        this.name = nameInput.value;
      });
    }
    if (daysInput) {
      daysInput.value = this._days;
      daysInput.addEventListener('input', (e) => {
        const value = Number(e.target.value) || 0;
        this.days = value;
      });
    }

    // Append to container
    PEOPLE_CONTAINER.appendChild(this.element);
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
    this.element = null;
  }
}

class Prorator {
  constructor() {
    this.people = [new Person('Juan', 7, this.render.bind(this))];
    this._amount = DEFAULT_AMOUNT;
    this._days = DEFAULT_DAYS;
    this.render();
  }

  set amount(amount) {
    this._amount = Number(amount) || 0;
    this.render();
  }

  set days(days) {
    this._days = Number(days) || 0;
    this.render();
  }

  get amount() {
    return this._amount;
  }

  get days() {
    return this._days;
  }

  addPerson(name) {
    // Check if name is already taken
    if (this.people.some(p => p.name === name)) {
      window.alert('Name already taken');
      return;
    }

    this.people.push(new Person(name, this.days, this.render.bind(this)));
    this.render();
  }

  removePerson(name) {
    const person = this.people.find(p => p.name === name);
    if (person) {
      person.remove();
    }
    this.people = this.people.filter(person => person.name !== name);
    this.render();
  }

  getPeople() {
    return this.people;
  }

  calculate() {
    // Validate inputs
    if (this.days <= 0 || this.amount < 0) {
      return {};
    }

    const daysPerPerson = this.people.reduce((acc, person) => {
      acc[person.name] = Math.max(0, Number(person.days) || 0);
      return acc;
    }, {});

    const amountPerDay = this.amount / this.days;

    const totalPerPerson = this.people.reduce((acc, person) => {
      acc[person.name] = 0;
      return acc;
    }, {});
    
    for (let i = 0; i < this.days; i++) {
      const presentPeople = [];
      for (const person of this.people) {
        if (daysPerPerson[person.name] > 0) {
          presentPeople.push(person.name);
        }
      }

      // If no one is present, skip this day
      if (presentPeople.length === 0) {
        continue;
      }

      const amountPerPerson = amountPerDay / presentPeople.length;

      for (const personName of presentPeople) {
        totalPerPerson[personName] += amountPerPerson;
        daysPerPerson[personName]--;
      }
    }

    // Calculate actual total charged and fix any floating-point discrepancies
    const actualTotal = Object.values(totalPerPerson).reduce((sum, amount) => sum + amount, 0);
    const discrepancy = this.amount - actualTotal;
    
    // Distribute any discrepancy (due to floating-point precision) to the person charged least
    // This ensures the total always equals exactly this.amount
    if (Math.abs(discrepancy) > Number.EPSILON && Object.keys(totalPerPerson).length > 0) {
      const person = Object.entries(totalPerPerson).sort((a, b) => a[1] - b[1])[0];
      totalPerPerson[person[0]] += discrepancy;
    }
    
    return totalPerPerson;
  }

  render() {
    const result = this.calculate();
    RESULT_CONTAINER.innerHTML = Object.entries(result).map(([name, amount]) => `${name}: ${amount.toFixed(2)}`).join('<br>');
  }
}

AMOUNT_INPUT.addEventListener('input', (e) => {
  prorator.amount = e.target.value;
});

DAYS_INPUT.addEventListener('input', (e) => {
  prorator.days = e.target.value;
});

let prorator = null;

document.addEventListener('DOMContentLoaded', () => {
  prorator = new Prorator();

  AMOUNT_INPUT.value = DEFAULT_AMOUNT;
  DAYS_INPUT.value = DEFAULT_DAYS;

  document.getElementById('add-person').addEventListener('click', () => {
    const name = window.prompt('Enter name');
    if (name) {
      prorator.addPerson(name);
    }
  });
});

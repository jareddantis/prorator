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
    this._days = days;
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
    this._days = days;
    if (this.element) {
      const daysInput = this.element.querySelector('.person-days');
      if (daysInput) {
        daysInput.value = days;
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
        e.preventDefault();
        this.days = daysInput.value;
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
    this._amount = amount;
    this.render();
  }

  set days(days) {
    this._days = days;
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
    let maxDays = 0;
    const daysPerPerson = this.people.reduce((acc, person) => {
      acc[person.name] = person.days;
      if (person.days > maxDays) {
        maxDays = person.days;
      }
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

      // Should not happen given we check for maxDays above,
      // but just in case
      if (presentPeople.length === 0) {
        continue;
      }

      const amountPerPerson = amountPerDay / presentPeople.length;

      for (const personName of presentPeople) {
        totalPerPerson[personName] += amountPerPerson;
        daysPerPerson[personName]--;
      }
    }

    // Put any discrepancy to the person charged least
    const discrepancy = this.amount - (amountPerDay * this.days);
    if (discrepancy > 0) {
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

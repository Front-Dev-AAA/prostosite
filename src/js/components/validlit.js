import {
  validateForms
} from '../functions/validate-forms';


const rules = [{
    ruleSelector: '.input-name',
    rules: [{
        rule: 'minLength',
        value: 3,
        errorMessage: 'Минимум три символа'
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните имя!'
      }
    ]
  },
  {
    ruleSelector: '.input-system',
    rules: [{
      rule: 'required',
      value: true,
      errorMessage: 'Не выбрали систему!'
    }]
  },
  {
    // слектор для почты
    ruleSelector: '.input-email',
    rules: [{
        rule: 'required',
        value: true,
        errorMessage: 'Заполните почту!'
      },
      {
        rule: 'email',
        value: true,
        errorMessage: 'Введите корректную почту!'
      }

    ]
  }
];

const afterForm = () => {};

validateForms('.price__form', rules, afterForm);

const elements = {
  button: document.querySelector('[role="combobox"]'),
  dropdown: document.querySelector('[role="listbox"]'),
  options: document.querySelectorAll('[role="option"]'),
  announcement: document.getElementById('announcement'),
};

let isDropdownOpen = false;
let currentOptionIndex = 0;
let lastTypedChar = '';
let lastMatchingIndex = 0;

const toggleDropdown = () => {
  elements.dropdown.classList.toggle('active');
  elements.button.classList.toggle('bg');
  isDropdownOpen = !isDropdownOpen;
  elements.button.setAttribute('aria-expanded', isDropdownOpen.toString());

  if (isDropdownOpen) {
    focusCurrentOption();
  } else {
    elements.button.focus();
  }
};

const handleKeyPress = (event) => {
  event.preventDefault();
  const {
    key
  } = event;
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

  if (!isDropdownOpen && openKeys.includes(key)) {
    toggleDropdown();
  } else if (isDropdownOpen) {
    switch (key) {
      case 'Escape':
        toggleDropdown();
        break;
      case 'ArrowDown':
        moveFocusDown();
        break;
      case 'ArrowUp':
        moveFocusUp();
        break;
      case 'Enter':
      case ' ':
        selectCurrentOption();
        break;
      default:
        // Handle alphanumeric key presses for mini-search
        handleAlphanumericKeyPress(key);
        break;
    }
  }
};

const handleDocumentInteraction = (event) => {
  const isClickInsideButton = elements.button.contains(event.target);
  const isClickInsideDropdown = elements.dropdown.contains(event.target);

  if (isClickInsideButton || (!isClickInsideDropdown && isDropdownOpen)) {
    toggleDropdown();
  }

  // Check if the click is on an option
  const clickedOption = event.target.closest('[role="option"]');
  if (clickedOption) {
    selectOptionByElement(clickedOption);
  }
};

const moveFocusDown = () => {
  if (currentOptionIndex < elements.options.length - 1) {
    currentOptionIndex++;
  } else {
    currentOptionIndex = 0;
  }
  focusCurrentOption();
};

const moveFocusUp = () => {
  if (currentOptionIndex > 0) {
    currentOptionIndex--;
  } else {
    currentOptionIndex = elements.options.length - 1;
  }
  focusCurrentOption();
};

const focusCurrentOption = () => {
  const currentOption = elements.options[currentOptionIndex];
  const optionLabel = currentOption.textContent;

  currentOption.classList.add('current');
  currentOption.focus();

  // Scroll the current option into view
  currentOption.scrollIntoView({
    block: 'nearest',
  });

  elements.options.forEach((option, index) => {
    if (option !== currentOption) {
      option.classList.remove('current');
    }
  });
  announceOption(`You're currently focused on ${optionLabel}`); // Announce the selected option within a delayed period
};

const selectCurrentOption = () => {
  const selectedOption = elements.options[currentOptionIndex];
  selectOptionByElement(selectedOption);
};

const selectOptionByElement = (optionElement) => {
  const optionValue = optionElement.textContent;

  elements.button.textContent = optionValue;
  elements.options.forEach(option => {
    option.classList.remove('active');
    option.setAttribute('aria-selected', 'false');
  });

  optionElement.classList.add('active');
  optionElement.setAttribute('aria-selected', 'true');

  toggleDropdown();
  announceOption(optionValue); // Announce the selected option
};

const handleAlphanumericKeyPress = (key) => {
  const typedChar = key.toLowerCase();

  if (lastTypedChar !== typedChar) {
    lastMatchingIndex = 0;
  }

  const matchingOptions = Array.from(elements.options).filter((option) =>
    option.textContent.toLowerCase().startsWith(typedChar)
  );

  if (matchingOptions.length) {
    if (lastMatchingIndex === matchingOptions.length) {
      lastMatchingIndex = 0;
    }
    let value = matchingOptions[lastMatchingIndex]
    const index = Array.from(elements.options).indexOf(value);
    currentOptionIndex = index;
    focusCurrentOption();
    lastMatchingIndex += 1;
  }
  lastTypedChar = typedChar;
};

const announceOption = (text) => {
  elements.announcement.textContent = text;
  elements.announcement.setAttribute('aria-live', 'assertive');
  setTimeout(() => {
    elements.announcement.textContent = '';
    elements.announcement.setAttribute('aria-live', 'off');
  }, 1000); // Announce and clear after 1 second (adjust as needed)
};

elements.button.addEventListener('keydown', handleKeyPress);
document.addEventListener('click', handleDocumentInteraction);


// извлекаем данные из инпута - селекта
const inputSystem = document.querySelector('#input-system');
const liItem = document.querySelectorAll('.form__item');

for (let i = 0; i < liItem.length; i = i + 1) {
  liItem[i].addEventListener('click', (e) => {
    inputSystem.value = e.currentTarget.dataset.value;
  }, false)
}

// значение для слайдера
const slider = document.getElementById("myRange");
const output = document.getElementById("sliderVar");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}



// для прикрепления файла
document.getElementById('file').addEventListener('change', function() {
  const filename = this.files[0].name;
  document.getElementById('file-label').innerText = filename;
});

'use-strict';

// задаем переменные
let version;
let dateKey;
let editorValue = [];

let btnGroup = document.querySelector('.btn-group');
let editor = document.querySelector('.editor__container');
let saveBtn = document.querySelector('.save__btn');
let cancelBtn = document.querySelector('.cancel__btn');

// проверяем на наличие данных в localStorage
getAllkeys();

if (editorValue.length > 0) {
  setEditor();
  setSelect();
} else if (editorValue.length == 0) {
  saveVersion();
  getAllkeys();
  setSelect();
}

//слушаем события

btnGroup.addEventListener('click', function (event) {
  let target = event.target;

  if (target.classList.contains('edit__btn')) {
    editor.setAttribute('disabled', 'true');
    editor.setAttribute('contenteditable', 'true');
    saveBtn.removeAttribute('disabled');
    cancelBtn.removeAttribute('disabled');
  }

  if (target.classList.contains('save__btn')) {
    editor.removeAttribute('disabled');
    editor.setAttribute('contenteditable', 'false');
    saveBtn.setAttribute('disabled', 'true');
    cancelBtn.setAttribute('disabled', 'true');

    removeOldVersion();
    saveVersion();
    getAllkeys();
    setEditor();
    setSelect();
    showMessage();
  }

  if (target.classList.contains('clean__btn')) {
    editorValue.slice(1).forEach((item) => {
      localStorage.removeItem(item)
    });

    getAllkeys();
    setEditor();
    setSelect();
  }

  if (target.classList.contains('cancel__btn')) {
    editor.removeAttribute('disabled');
    editor.setAttribute('contenteditable', 'false');
    saveBtn.setAttribute('disabled', 'true');
    cancelBtn.setAttribute('disabled', 'true');

    getAllkeys();
    setEditor();
    setSelect();
  }

  if (target.classList.contains('choice__btn')) {
    choiceVariant();
  }
})

// сохранение версии
function saveVersion() {
  getNumberVersion();
  localStorage.setItem(dataKey, editor.innerHTML);
};

// создание номера версии
function getNumberVersion() {
  let d = new Date();
  dataKey = d.toISOString();
  version = d.toLocaleString();
  return version, dataKey;
}

// выбор наших ключей из массива с сортировкой по дате
function getAllkeys() {
  editorValue = [];
  for (let key in localStorage) {
    if (!key.match(/\d{4}\-\d{2}\-\d{2}\T\d{2}\:\d{2}\:\d{2}\.\d{3}\Z/g)) {
      continue;
    }
    editorValue.push(key);

    editorValue.sort(function (a, b) {
      return new Date(a) - new Date(b)
    });
  }
  return editorValue;
}

// заполнение поля ввода последними данными из архива
function setEditor() {
  editor.innerHTML = localStorage.getItem(editorValue[editorValue.length - 1]);
}

// заполнение селекта
function setSelect() {
  let options = document.querySelectorAll('option');
  for (option of [...options]) {
    option.remove();
  }

  editorValue.forEach((item) => {
    let select = document.querySelector('.save-select__main');
    let newOptions = document.createElement('option');
    newOptions.innerText = new Date(item).toLocaleString();
    newOptions.setAttribute('value', item);
    select.append(newOptions);
  })
}

//Удаление лишних данных из памяти - переполнение 10шт
function removeOldVersion() {
  getAllkeys();
  if (editorValue.length == 10) {
    localStorage.removeItem(editorValue[1]);
  }
}

//Показ всплывашки
function showMessage() {
  let message = document.querySelector('.message');
  message.removeAttribute('hidden');
  message.classList.add('message_on');
  message.classList.remove('message_off');

  setTimeout(function () {}, 4500);
  setTimeout(function () {
    message.classList.remove('message_on');
    message.classList.add('message_off');
    setTimeout(function () {
      message.setAttribute('hidden', 'true');
    }, 600);
  }, 4500);
}

//Выбрать и загрузить данные из селекта
function choiceVariant() {
  let select = document.querySelector('.save-select__main');
  editor.innerHTML = localStorage.getItem(select.value);
}
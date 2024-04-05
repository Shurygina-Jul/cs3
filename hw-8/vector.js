// Универсальный класс вектора для всех типизированных массивов
class Vector {
  // Конструктор принимает тип массива и объект с настройками
  constructor(arrayType, options) {
    // Сохраняем тип массива
    this.arrayType = arrayType;
    // Инициализируем емкость массива
    this.capacity = options.capacity || 0;
    // Инициализируем длину массива (количество активных элементов)
    this.length = 0;
    // Создаем новый ArrayBuffer с размером,
    //рассчитанным на основе емкости и размера одного элемента
    this.buffer = new ArrayBuffer(
      this.capacity * this.arrayType.BYTES_PER_ELEMENT
    );
    // Создаем типизированный массив с ссылкой на buffer
    this.array = new this.arrayType(this.buffer);
  }

  // Метод добавления элемента в конец массива
  push(element) {
    // Проверяем, нужно ли расширить массив (если длина равна емкости)
    if (this.length === this.capacity) {
      this._grow();
    }
    // Присваиваем элемент следующей позиции и увеличиваем длину на 1
    this.array[this.length] = element;
    return ++this.length;
  }

  // Метод удаления и возвращения элемента с конца массива
  pop() {
    //если элементов нет, то и возвращать нечего
    if (this.length === 0) {
      return undefined;
    }
    // Сохраняем последний элемент массива
    const element = this.array[this.length - 1];
    this.length--;
    return element;
  }

  // Внутренний метод для увеличения размера массива
  _grow() {
    // Удваиваем емкость массива, если она не нулевая, иначе устанавливаем емкость в 1
    this.capacity = this.capacity ? this.capacity * 2 : 1;
    // Создаем новый ArrayBuffer на основе новой емкости
    const newBuffer = new ArrayBuffer(
      this.capacity * this.arrayType.BYTES_PER_ELEMENT
    );
    // Создаем новый типизированный массив на основе нового buffer
    const newArray = new this.arrayType(newBuffer);
    // Копируем данные из старого массива в новый
    newArray.set(this.array);
    // Обновляем buffer и array данными из нового массива
    this.buffer = newBuffer;
    this.array = newArray;
  }

  // Метод для уменьшения размера буфера до текущего количество элементов
  shrinkToFit() {
    // Если текущая емкость соответствует фактической длине, ничего не делаем
    if (this.capacity === this.length) {
      return;
    }
    // Устанавливаем новую емкость равной количеству элементов
    this.capacity = this.length;
    // Создаем новый ArrayBuffer подходящего размера
    const newBuffer = new ArrayBuffer(
      this.capacity * this.arrayType.BYTES_PER_ELEMENT
    );
    // Создаем новый типизированный массив на основе newBuffer
    const newArray = new this.arrayType(newBuffer);
    // Копируем текущие элементы в новый массив
    newArray.set(this.array.subarray(0, this.length));
    // Обновляем buffer и array данными из нового массива
    this.buffer = newBuffer;
    this.array = newArray;
  }
}

// Тестируем вектор
const vec = new Vector(Int32Array, { capacity: 4 });

vec.push(1); // Возвращает длину - 1
vec.push(2); // 2
vec.push(3); // 3
vec.push(4); // 4
vec.push(5); // 5 Увеличение буфера

console.log("vec.capacity ->", vec.capacity); // 8
console.log("vec.length ->", vec.length); // 5

vec.pop(); // Удаляет с конца, возвращает удаленный элемент - 5

console.log("vec.capacity после удаления ->", vec.capacity); // 8

vec.shrinkToFit(); // Новая емкость 4
console.log("новая емкость ->", vec.capacity); // 4

console.log("Ссылка на ArrayBuffer ->", vec.buffer); // Ссылка на ArrayBuffer

//итератор values для вектора с учетом того, что буфер может вырасти
function* values(vector) {
  let previousLength = vector.length; // Запоминаем начальную длину массива

  for (let index = 0; index < previousLength; index++) {
    yield vector.array[index]; // Возвращаем значение текущего элемента

    // Если длина массива изменилась во время итерации
    // (то есть был добавлен новый элемент в vector),
    // то мы обновляем previousLength.
    if (vector.length !== previousLength) {
      previousLength = vector.length;
    }
  }
  // При завершении цикла for итерация считается завершенной.
  // Генератор автоматически возвращает { done: true, value: undefined }
}

// Потестим
const vecIt = new Vector(Int32Array, { capacity: 1 });

// Создание итератора значений вектора
const valIterator = values(vecIt);

// Добавление элементов в вектор
vecIt.push(1);
vecIt.push(2);
vecIt.push(3);

// Перебор элементов вектора через итератор
console.log(valIterator.next()); // { value: 1, done: false }
console.log(valIterator.next()); // { value: 2, done: false }
console.log(valIterator.next()); // { value: 3, done: false }
console.log(valIterator.next()); // { value: undefined, done: true }
console.log(valIterator.next());

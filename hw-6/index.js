class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
  }

  //TODO: можно написать универсальный метод (value, toFront = false)

  // Метод для добавления узлов в список
  add(value) {
    const newNode = new ListNode(value);

    //Если есть первый узел,к нему можно присоединить новый
    if (this.first) {
      this.last.next = newNode; // Устанавливаем  next текущего последнего узла,чтобы оно указывало на новый узел (связываем новый узел с последним узлом в списке)
      newNode.prev = this.last; // Устанавливаем prev нового узла, чтобы оно указывало на текущий последний узел (установим двойную связь между новым узлом и текущим последним узлом)
      this.last = newNode; //Назначаем новый узел как последним.
    } else {
      // Если в списке еще нет узлов, новый узел это и первый и последний
      this.first = newNode;
      this.last = newNode;
    }
  }
  // Метод для добавления узлов в начало
  addToFront(value) {
    const newNode = new ListNode(value);

    if (this.first) {
      this.first.prev = newNode;
      newNode.next = this.first;
      this.first = newNode;
    } else {
      this.first = newNode;
      this.last = newNode;
    }
  }

  // Сделаем список итерируемым
  [Symbol.iterator]() {
    let current = this.first;

    return {
      // вызывается при каждой итерации
      next() {
        // Если текущий все еще есть, то мы не дошли до конца
        if (current) {
          const value = current.value; // сохраним его значение
          current = current.next; // перейдем к следующему

          return { value, done: false }; // вернем объект со значением и флагом завершения итерации
        }
        return { done: true }; //если мы дошли до конца, то вернем в true
      },
    };
  }
}

// Узел: данные и ссылка на следующий узел и предыдущий
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

// Пример использования LinkedList
const list = new LinkedList();

list.add(1);
list.add(2);
list.add(3);

console.log(list.first.value); // 1
console.log(list.last.value); // 3
console.log(list.first.next.value); //  2
console.log(list.first.next.prev.value); //  1
console.log("---------------------"); //  1

for (const value of list) {
  console.log(value); //  1, 2, 3
}

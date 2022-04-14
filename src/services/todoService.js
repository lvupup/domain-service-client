const Decimal = require('decimal.js')
const { CommonError } = require('@app/utils/errors')

let _id = Decimal(1)

const _todos = [
  {
    id: _id.toString(),
    title: 'Todo1',
    description: 'First todo',
    isCompleted: true,
    items: [{ title: 'TodoItem1', isCompleted: true }],
    order: Decimal(1).toString(),
    dateCreated: new Date('2022/01/01 00:00:00 +08:00'),
    dateUpdated: new Date('2022/02/01 00:00:00 +08:00')
  }
]

async function* getTodosAsync() {
  for (const todo of _todos) yield todo
}

async function getTodoAsync(id) {
  const todo = _todos.find(record => record.id === id)
  if (todo == null) throw new CommonError('COMM0103')
  return todo
}

async function createTodoAsync({ title, description, isCompleted, items, order }) {
  const id = (_id = _id.add(1)).toString()
  const now = new Date()
  _todos.push({
    id,
    title,
    description,
    isCompleted,
    items: items.map(({ title, description }) => ({ title, description })),
    order,
    dateCreated: now,
    dateUpdated: now
  })
  return id
}

async function updateTodoAsync({
  id,
  title,
  description,
  isCompleted,
  items,
  order
}) {
  const index = _todos.findIndex(record => record.id === id)
  if (index === -1) throw new CommonError('COMM0103')
  _todos[index] = {
    ..._todos[index],
    title,
    description,
    isCompleted,
    items: items.map(({ title, description }) => ({ title, description })),
    order,
    dateUpdated: new Date()
  }
}

async function deleteTodoAsync(id) {
  const index = _todos.findIndex(record => record.id === id)
  if (index === -1) throw new CommonError('COMM0103')
  _todos.splice(index, 1)
}

module.exports = {
  getTodosAsync,
  getTodoAsync,
  createTodoAsync,
  updateTodoAsync,
  deleteTodoAsync
}

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
    dateCreated: new Date('2022/01/01 00:00:00 +08:00'),
    dateUpdated: new Date('2022/02/01 00:00:00 +08:00')
  }
]

function* getTodos() {
  for (const todo of _todos) yield todo
}

async function getTodo(id) {
  const todo = _todos.find(record => record.id === id)
  if (todo == null) throw new CommonError('COMM0103')
  return todo
}

async function createTodo({ title, description, isCompleted, items }) {
  const id = (_id = _id.add(1)).toString()
  const now = new Date()
  _todos.push({
    id,
    title,
    description,
    isCompleted,
    items: items.map(({ title, description }) => ({ title, description })),
    dateCreated: now,
    dateUpdated: now
  })
  return id
}

async function updateTodo({ id, title, description, isCompleted, items }) {
  const index = _todos.findIndex(record => record.id === id)
  if (index === -1) throw new CommonError('COMM0103')
  _todos[index] = {
    ..._todos[index],
    title,
    description,
    isCompleted,
    items: items.map(({ title, description }) => ({ title, description })),
    dateUpdated: new Date()
  }
}

async function deleteTodo(id) {
  const index = _todos.findIndex(record => record.id === id)
  if (index === -1) throw new CommonError('COMM0103')
  _todos.splice(index, 1)
}

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
}

const todoRepository = require('@app/repositories/todoRepository')
const { CommonError } = require('@app/utils/errors')

function getTodosAsync() {
  return todoRepository.getTodosAsync()
}

async function getTodoAsync(id) {
  const todo = await todoRepository.getTodoAsync(id)
  if (todo == null) throw new CommonError('COMM0103')
  return todo
}

function createTodoAsync(todo) {
  return todoRepository.createTodoAsync(todo)
}

function updateTodoAsync(todo) {
  return todoRepository.updateTodoAsync(todo)
}

function deleteTodoAsync(id) {
  return todoRepository.deleteTodoAsync(id)
}

module.exports = {
  getTodosAsync,
  getTodoAsync,
  createTodoAsync,
  updateTodoAsync,
  deleteTodoAsync
}

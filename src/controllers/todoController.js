const todoService = require('@app/services/todoService')
const { CommonResponse } = require('@app/utils/responses')

async function* getTodos() {
  for await (const todo of todoService.getTodosAsync()) yield todo
}

async function getTodo(request) {
  const todo = await todoService.getTodoAsync(request.value)
  return CommonResponse.success(todo)
}

async function createTodo(request) {
  const todoId = await todoService.createTodoAsync(request)
  return CommonResponse.success(todoId)
}

async function updateTodo(request) {
  await todoService.updateTodoAsync(request)
  return CommonResponse.success()
}

async function deleteTodo(request) {
  await todoService.deleteTodoAsync(request.value)
  return CommonResponse.success()
}

async function* batchCreateTodo(stream) {
  for await (const request of stream) {
    const todoId = await todoService.createTodoAsync(request)
    yield { value: todoId }
  }
}

async function batchDeleteTodo(stream) {
  for await (const request of stream) {
    await todoService.deleteTodoAsync(request.value)
  }
  return { code: 'COMM0000' }
}

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  batchCreateTodo,
  batchDeleteTodo
}

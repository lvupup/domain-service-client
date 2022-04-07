const todoService = require('@app/services/todoService')
const { CommonResponse } = require('@app/utils/responses')

async function* getTodos() {
  for await (const todo of todoService.getTodos()) yield todo
}

async function getTodo(request) {
  const todo = await todoService.getTodo(request.value)
  return CommonResponse.success(todo)
}

async function createTodo(request) {
  const todoId = await todoService.createTodo(request)
  return CommonResponse.success(todoId)
}

async function updateTodo(request) {
  await todoService.updateTodo(request)
  return CommonResponse.success()
}

async function deleteTodo(request) {
  await todoService.deleteTodo(request.value)
  return CommonResponse.success()
}

async function* batchCreateTodo(stream) {
  for await (const request of stream) {
    const todoId = await todoService.createTodo(request)
    yield { value: todoId }
  }
}

async function batchDeleteTodo(stream) {
  for await (const request of stream) {
    await todoService.deleteTodo(request.value)
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

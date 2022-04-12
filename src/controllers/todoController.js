const validator = require('@app/services/validator')
const todoService = require('@app/services/todoService')
const { CommonResponse } = require('@app/utils/responses')
const commonSchema = require('./validations/common')
const todoSchema = require('./validations/todo')

async function* getTodos() {
  for await (const todo of todoService.getTodosAsync()) yield todo
}

async function getTodo(request) {
  await validator.validateAsync(commonSchema.pKeyString, request)
  const todo = await todoService.getTodoAsync(request.value)
  return CommonResponse.success(todo)
}

async function createTodo(request) {
  await validator.validateAsync(todoSchema.createTodoRequest, request)
  const todoId = await todoService.createTodoAsync(request)
  return CommonResponse.success(todoId)
}

async function updateTodo(request) {
  await validator.validateAsync(todoSchema.updateTodoRequest, request)
  await todoService.updateTodoAsync(request)
  return CommonResponse.success()
}

async function deleteTodo(request) {
  await validator.validateAsync(commonSchema.pKeyString, request)
  await todoService.deleteTodoAsync(request.value)
  return CommonResponse.success()
}

async function* batchCreateTodo(stream) {
  for await (const request of stream) {
    await validator.validateAsync(todoSchema.createTodoRequest, request)
    const todoId = await todoService.createTodoAsync(request)
    yield { value: todoId }
  }
}

async function batchDeleteTodo(stream) {
  for await (const request of stream) {
    await validator.validateAsync(commonSchema.pKeyString, request)
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

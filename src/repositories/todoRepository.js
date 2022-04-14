const mongoDb = require('@app/mongodb')

function getTodosAsync() {
  return mongoDb.model('todo').find()
}

function getTodoAsync(id) {
  return mongoDb.model('todo').findById(id)
}

async function createTodoAsync(todo) {
  const todoDoc = await mongoDb.model('todo').create(todo)
  return todoDoc.id
}

async function updateTodoAsync(todo) {
  const result = await mongoDb.model('todo').updateOne({ _id: todo.id }, todo)
  console.log(result)
  return result
}

async function deleteTodoAsync(id) {
  const result = await mongoDb.model('todo').deleteOne({ _id: id })
  return result.deletedCount > 0
}

module.exports = {
  getTodosAsync,
  getTodoAsync,
  createTodoAsync,
  updateTodoAsync,
  deleteTodoAsync
}

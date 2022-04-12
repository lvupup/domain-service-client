const j = require('joi')

const createTodoRequest = j.object({
  id: j.string().allow(''),
  title: j.string().max(20).required(),
  description: j.string().allow('').max(200).required(),
  isCompleted: j.boolean().required(),
  items: j
    .array()
    .items(
      j.object({
        title: j.string().max(20).required(),
        isCompleted: j.boolean().required()
      })
    )
    .required(),
  order: j.number().positive().required()
})

const updateTodoRequest = createTodoRequest.concat(
  j.object({ id: j.string().required() })
)

module.exports = {
  createTodoRequest,
  updateTodoRequest
}

const { v4: uuidv4 } = require('uuid');
const headers = require('../corsHeaders.js');
const errorHandle = require('../errorHandle');

const todos = [
  {
    title: '今天要刷牙',
    id: uuidv4(),
  },
];

module.exports = {
  getTodos:  function (req, res) {
  res.writeHead(200, headers);
  res.write(JSON.stringify(todos));
  res.end();
},

createTodo: function (req, res, data) {
  try {
    const { title } = data;
    if (title !== undefined) {
      const newTodo = {
        title,
        id: uuidv4(),
      };
      todos.push(newTodo);
      res.writeHead(201, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
    } else {
      errorHandle(res);
    }
    res.end();
  } catch (error) {
    errorHandle(res, error);
  }
},

deleteTodos: function(req, res) {
  todos.length = 0;
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data: todos,
    })
  );
  res.end();
},

deleteTodoById: function (req, res, data, params) { 
  const { id } = params;  
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos.splice(index, 1);
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else {
    errorHandle(res);
  }
  
},

updateTodoById: function (req, res, data, params) {
  try {
    const { id } = params;
    const { title } = data;
    const index = todos.findIndex((todo) => todo.id === id);

    if (title !== undefined && index !== -1) {
      todos[index].title = title;
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } catch (error) {
    errorHandle(res);
  }
},
};
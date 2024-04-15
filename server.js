const http = require('http');
const todosRouteHandlers = require('./routes/todos');
const headers = require('./corsHeaders.js');
const errorHandle = require('./errorHandle');

const {
  getTodos,
  createTodo,
  deleteTodos,
  deleteTodoById,
  updateTodoById
} = todosRouteHandlers;


const routes = {
  '/todos': {
    GET: getTodos,
    POST: createTodo,
    DELETE: deleteTodos,
  },
  '/todos/:id': {
    DELETE: deleteTodoById,
    PATCH: updateTodoById,
  }
};

function matchRoute(req) {
  const urlSegments = req.url.split('?')[0].split('/');

  for (let pattern in routes) {

    const patternSegments = pattern.split('/');

    if (patternSegments.length !== urlSegments.length) {
      continue;
    }

    const params = {};
    const isMatch = patternSegments.every((seg, i) => {
      if (seg.startsWith(':')) {
        params[seg.slice(1)] = urlSegments[i]; // 提取參數
        return true;
      }
      return seg === urlSegments[i];
    });

    if (isMatch) {
      return { handler: routes[pattern][req.method], params };
    }
  }

  return null;  // 沒有匹配的路由
}


const requestListener = (req, res) => {
  const { url, method } = req;
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {

    let data = {}; 
    try {
        data = JSON.parse(body); 
    } catch (error) {
        if (body !== '') {
            errorHandle(res, error);
            return;
        }
    }

    const route = matchRoute(req);

    if (route && route.handler) {
      return route.handler(req, res, data, route.params);
    }

    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  });
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 3005);

import Fastify from "fastify";

import fastifyMySQL from "@fastify/mysql"

import  type { FastifyRequest, FastifyReply } from "fastify";



const fastify = Fastify({
    logger:true
});

interface UserBody {
  name: string;
  age: number;
}

interface UserId{
  id:number;
}




fastify.register(fastifyMySQL, {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

//read
fastify.get<{ Body: UserBody;Params: UserId}>('/user/:id', function(req,reply) {
  fastify.mysql.query(
    'SELECT id, name, age FROM user WHERE id=?', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

//create

fastify.post<{ Body: UserBody;Params: UserId}>('/user', (req,reply) => {
  const { name, age } = req.body;
  
  fastify.mysql.query(
    'INSERT INTO user (name, age) VALUES (?, ?)',
    [name, age],
    (err, result) => {
      if (err) {
        reply.code(500).send(err);
      } else {
        reply.send({ id: result.insertId, name, age });
      }
    }
  );
});

//update


// interface UpdateUserBody {
//   name: string;
//   age: number;
// }

// interface UpdateUserId{
//   id:number;
// }

fastify.patch<{ Body: UserBody;Params: UserId}>('/user/:id', (req,reply) => {
  const { name, age } = req.body;
  const { id } = req.params;     

  fastify.mysql.query(
    'UPDATE user SET name = ?, age = ? WHERE id = ?',
    [name, age, id],
    (err, result) => {
      if (err) {
        reply.code(500).send(err);
      } else if (result.affectedRows === 0) {
        reply.code(404).send({ message: 'User not found' });
      } else {
        reply.send({ id, name, age });
      }
    }
  );
});

//delete
fastify.delete<{ Body: UserBody;Params: UserId}>('/user/:id', (req,reply) => {
  const { id } = req.params;

  fastify.mysql.query(
    'DELETE from user WHERE id = ?',
    [id],
    (err,result) => {
      if (err){
        reply.code(500).send(err);
      }else{
        reply.send({deletedId: id});
      }
    }
  );
})









fastify.get(`/health_check`,async(request: FastifyRequest,reply: FastifyReply) => {
    return `OK`;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000,host: "0.0.0.0" });
    console.log('サーバーがポート 3000 で起動しました。');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();




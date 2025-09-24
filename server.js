import Fastify from "fastify";

import fastifyMySQL from "@fastify/mysql"


const fastify = Fastify({
    logger:true
})


fastify.register( fastifyMySQL,
   {
// connectionStringで、接続先のDBを指定する。パスワード、ユーザー名、ポート番号、DB名を指定する。
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
   })

//read
fastify.get('/user/:id', function(req, reply) {
  fastify.mysql.query(
    'SELECT id, name, age FROM user WHERE id=?', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
})

//create
fastify.post('/user', (req, reply) => {
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
fastify.patch('/user/:id', (req, reply) => {
  const { name, age } = req.body; // 更新する内容
  const { id } = req.params;      // 更新対象のID

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
fastify.delete('/user/:id', (req,reply) => {
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









fastify.get(`/health_check`,async(request,reply) => {
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

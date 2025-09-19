import Fastify from "fastify";

import fastifyMySQL from "@fastify/mysql"


const fastify = Fastify({
    logger:true
})


fastify.register( fastifyMySQL,
   {
// connectionStringで、接続先のDBを指定する。パスワード、ユーザー名、ポート番号、DB名を指定する。
  connectionString: 'mysql://root:rootpass@db:3306/sampledb'
})


fastify.get('/user/:id', function(req, reply) {
  fastify.mysql.query(
    'SELECT id, name, age FROM user WHERE id=?', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }
  )
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

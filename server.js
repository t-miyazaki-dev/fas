import Fastify from "fastify";
import fastifyMySQL from "@fastify/mysql";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const fastify = Fastify({
    logger: true
});
fastify.register(fastifyMySQL, {
    connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});
//read
fastify.get('/user/:id', async function (req, reply) {
    const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
    });
    reply.send(user);
    // fastify.mysql.query(
    //   'SELECT id, name, age FROM user WHERE id=?', [req.params.id],
    //   function onResult (err, result) {
    //     reply.send(err || result)
    //   }
    // )
});
//create
fastify.post('/user', async (req, reply) => {
    const { name, age } = req.body;
    const user = await prisma.user.create({
        data: { name, age }
    });
    reply.send(user);
    // fastify.mysql.query(
    //   'INSERT INTO user (name, age) VALUES (?, ?)',
    //   [name, age],
    //   (err, result) => {
    //     if (err) {
    //       reply.code(500).send(err);
    //     } else {
    //       reply.send({ id: result.insertId, name, age });
    //     }
    //   }
    // );
});
//update
// interface UpdateUserBody {
//   name: string;
//   age: number;
// }
// interface UpdateUserId{
//   id:number;
// }
fastify.patch('/user/:id', async (req, reply) => {
    const { name, age } = req.body;
    const { id } = req.params;
    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, age }
    });
    reply.send(user);
    // fastify.mysql.query(
    //   'UPDATE user SET name = ?, age = ? WHERE id = ?',
    //   [name, age, id],
    //   (err, result) => {
    //     if (err) {
    //       reply.code(500).send(err);
    //     } else if (result.affectedRows === 0) {
    //       reply.code(404).send({ message: 'User not found' });
    //     } else {
    //       reply.send({ id, name, age });
    //     }
    //   }
    // );
});
//delete
fastify.delete('/user/:id', async (req, reply) => {
    const { id } = req.params;
    const user = await prisma.user.delete({
        where: { id: Number(id) }
    });
    reply.send(user);
    // fastify.mysql.query(
    //   'DELETE from user WHERE id = ?',
    //   [id],
    //   (err,result) => {
    //     if (err){
    //       reply.code(500).send(err);
    //     }else{
    //       reply.send({deletedId: id});
    //     }
    //   }
    // );
});
fastify.get(`/health_check`, async (request, reply) => {
    return `OK`;
});
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log('サーバーがポート 3000 で起動しました。');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map
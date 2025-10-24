import 'dotenv/config';

import Fastify from "fastify";

import fastifyMySQL from "@fastify/mysql"

import type { FastifyRequest, FastifyReply } from "fastify";

import { PrismaClient } from "@prisma/client";

import cors from '@fastify/cors';

import bcrypt from "bcryptjs";

import jwt from "@fastify/jwt";

import cookie from "@fastify/cookie"

import type { preValidationHookHandler } from 'fastify';



const prisma = new PrismaClient();



const fastify = Fastify({
  logger: true
});

await fastify.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:['Content-Type',
    //'Authorization'
    ],
  credentials: true, 
});

await fastify.register(cookie); 

await fastify.register(jwt,{
  secret: process.env.JWT_SECRET as string, 
  cookie: { cookieName: 'access_token' ,signed: false},  //むずいから後でこの辺確認
})





// fastify.decorate('authenticate',async (req: any,reply: FastifyReply) => {
//   try{
//     await req.jwtVerify();
//   }catch{
//     reply.code(401).send({message: 'unauthorized'})
//   }
// }
// )

const authenticate: preValidationHookHandler = async (req, reply) => {
  try { await req.jwtVerify(); }
  catch { reply.code(401).send({ message: 'unauthorized' }); }
};




interface UserBody {
  name: string;
  age: number;
}

interface UserId {
  id: number;
}






fastify.register(fastifyMySQL, {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

//read
fastify.get<{ Body: UserBody; Params: UserId }>('/user/:id', { preValidation: [authenticate] }, async function (req, reply) {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: {
        id: true,
        name: true,
        email: true,   // ★ 追加：メールを返す
        age: true,
        // password: false ← selectでは指定不要（返さない）
      },
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

fastify.post<{ Body: UserBody; Params: UserId }>('/user', { preValidation: [authenticate] },async (req, reply) => {
  const { name, age } = req.body;

  const user = await prisma.user.create({
    data: {
      name, email: "dummy@example.com", // 仮のメール
      password: "temporary", age
    }
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

fastify.patch<{ Body: UserBody; Params: UserId }>('/user/:id',{ preValidation: [authenticate] }, async (req, reply) => {
  const { name, age } = req.body;
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, age }

  })

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
fastify.delete<{ Body: UserBody; Params: UserId }>('/user/:id', { preValidation: [authenticate] },async (req, reply) => {
  const { id } = req.params;

  const user = await prisma.user.delete({
    where: { id: Number(id) }
  })
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
})




//ユーザー登録

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  age: number;
}

fastify.post<{ Body: RegisterBody }>(`/register`, async (req, reply) => {
  const { name, email, password, age } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      age,
    }
  })
  reply.send(user)
  //passwordも返すかも
}


)

//login機能

interface LoginBody {
  email: string;
  password: string;
}

fastify.post<{ Body: LoginBody }>('/login', async (req, reply) => {
  const { email, password } = req.body;
  //userの情報をメールで取得
  const user = await prisma.user.findUnique({ where: { email } })

 
  if (!user) {
  return reply.send({ success: false, message: 'failure' });    //以降user有り
}


  let ok;

  if (user) {
    ok = await bcrypt.compare(password, user.password);      //(打ち込まれたパス,本物のパスを比較)
  } else {
    ok = false;
  }

  if (!ok) {
    return reply.send({ success: false, message: 'failure' })
  }


  // JWT を発行
    const token = fastify.jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    { expiresIn: '1h' }
  );

  //cookieを送る
  reply.setCookie("access_token",token,{
    httpOnly: true,
    secure: false,
    sameSite: "lax", // これでread以外もいけるようになった
    path: '/',
    maxAge: 60 * 60
  })

  // パスワードは返さない
  const { password: _pw, ...safeUser } = user;

  return reply.send({
    success: true,
    message: `success`,
    //token,
    user: safeUser,
  })

})







fastify.get(`/health_check`, async (request: FastifyRequest, reply: FastifyReply) => {
  return `OK`;
});

const start = async () => {
  try {

    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log('サーバーがポート 3000 で起動しました。');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();




import { Hono } from 'hono';
import {PrismaClient} from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import {sign, verify} from 'hono/jwt';
import { signupInput, signinInput } from '@kaivan_shah/medium-common';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: 'Invalid input',
        });
    }
    console.log(body);

    try {
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            }
        });

        const token = await sign({id: newUser.id}, 'secret');
        console.log(token);
        return c.json({jwt : token});
    } catch (error) {
        console.error('Error creating user:', error);
        return c.json({ error: 'Failed to create user' }, 500);
    } finally {
        await prisma.$disconnect();
    }
})

userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: 'Invalid input',
        });
    }

    const {email, password} = body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    
    if(!user){
        return c.json({
            message: 'Invalid email or password',
        })
    }

    const token = sign({id: user.id}, 'secret');
    return c.json({jwt: token});
}); 
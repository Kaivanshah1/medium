import { Hono } from 'hono';
import {PrismaClient} from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import {sign, verify} from 'hono/jwt';
import { createBlogInput, updateBlogInput } from '@kaivan_shah/medium-common';
import z from 'zod';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const token = c.req.header('Authorization') || "";
    const user = await verify(token, "secret");
    if (user) { 
        c.set("userId", user.id);
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "you are not logged in"
        });
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: 'Invalid input',
        });
    }
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const {title, content} = body;
    const blog = await prisma.post.create({
        data: {
            title,
            content,
            authorId: authorId as string,
        }
    });
    return c.json({
        message: 'Blog created',
        id: blog.id,
    });
});

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: 'Invalid input',
        });
    }
    
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const {id, title, content} = body;
    const blog = await prisma.post.update({
        where: {
            id,
            authorId: userId as string,
        },
        data: {
            title,
            content,
        }
    });

    return c.json({
        message: 'Blog updated',
        id: blog.id,
    });
});

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json({
        blogs
    });
})

blogRouter.get('/:id', async (c) => {
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findFirst(
        {
            where: {
                id: id,
            }
        }
    );
    return c.json({
       blogs
    });
})


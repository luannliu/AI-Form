import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";

export const JsonForms = pgTable("jsonforms", {
    //serial是自增的整数 primaryKey是主键
    id: serial("id").primaryKey(),
    // 定义jsonform字段 类型为text 
    jsonform: text('jsonform').notNull(),
    // 类型为varchar 长度为256 不能为空
    theme: varchar("theme"),
    background: varchar("background"),
    style: varchar('style'),
    createBy: varchar("createBy").notNull(),
    createdAt: varchar("createdAt").notNull(),
});

export const userResponse = pgTable("userResponse", {
    id: serial("id").primaryKey(),
    jsonResponse: varchar("jsonResponse").notNull(),
    createBy: varchar("createBy").default('anonymus'),
    createdAt: varchar("createdAt").notNull(),
    formRef:integer('formRef').references(()=>JsonForms.id)
});
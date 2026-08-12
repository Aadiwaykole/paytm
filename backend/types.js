const z = require("zod");


const signupSchema = z.object({
    username : z.string().min(3).max(30),
    password : z.string().min(6).max(100),
    firstname : z.string    ().min(1).max(50),
    lastname : z.string().min(1).max(50)
});

const signinSchema = z.object({
    username: z.string(),
    password: z.string()
});

module.exports = {
    signupSchema,
    signinSchema
}
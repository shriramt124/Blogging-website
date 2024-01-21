require("dotenv").config()
require("./config/dbConnect")
const express = require("express")
const app = express();
const UserRoutes = require("./routes/UserRoutes")
const PostRoutes = require("./routes/PostRoutes")
const commentRoutes = require("./routes/CommentRoutes")
const cookieParser = require("cookie-parser")
const methodOverride = require("method-override");
const appError = require("./utils/appError");
app.use(methodOverride("_method"))
//set the view engine
app.set("view engine","ejs");//ab to html mat use kar // ab tu mera view engine ejs use kar //par me style nahi jayegi 


app.use(express.static(__dirname + "/public"));//ab se jo bhi mera public me hai wo sab use kar lo 

//parsing data to body in form of json 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))//passing form data to user





  

app.get("/",async (req,res) => {
    try{
     res.render("home.ejs");
    }catch(error){
     console.log(error.message);
    }
  })

app.use("/api/v1/users",UserRoutes)
app.use("/api/v1/posts",PostRoutes),
app.use("/api/v1/comments",commentRoutes)
//global error handler
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const status = err.status ? err.status :"fail";
    const message = err.message;
    const stack = err.stack;
    res.status(statusCode).json({
        status,
       message,
       stack
    })
})

const PORT = process.env.PORT || 5001
app.listen(PORT,() => console.log(`server started at the post ${PORT}`))








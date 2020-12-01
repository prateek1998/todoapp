const express = require("express");
const dotenv = require('dotenv');
const { PORT, DB } = require('./config');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('./models/todos');
let Todo = mongoose.model('Todos')

app.use(express.static("public"));
app.use(morgan('tiny',{}));
app.use(express.urlencoded({ extended: false }));
dotenv.config();

mongoose.connect(DB.uri, DB.options, function (err) {
  // Log Error
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(err);
  } else {
    console.error(chalk.green('Server successfully connected with MongoDB Database'));
  }
})

app.get("/", (req, res) => {
  res.render("top.ejs");
});

app.get("/index", (req, res) => {
  Todo.find({}).sort({_id:-1}).exec(function(err,todos){
    if(err) console.log("error in getting todo ",err)
    else{
      // console.log(todos)
      updateKeyIndex(function (err,result) {
        if(err) console.log("error in Updating todoList key ",err)
        if(result){
          console.log("List Key value updated");
          res.render("index.ejs", { items: todos });
        }
      });
      
    }    
  })
})
  
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/create", (req, res) => {
  let task = req.body.itemName; 
  let todo =new Todo();
  todo.title = task;
  todo.save(function(err) {
    if(err) console.log(err);
    res.redirect("/index");
  })
});

// app.get('/key',(req,res) => {
  const updateKeyIndex = (done) => {
  Todo.find().sort({_id:-1}).exec(function(err,todo){
    if(err) {
      console.log("error in Updating todo ",err)
      done(null,err);
    }
    else{
      for(let i = 0; i<todo.length; i++){
        todo[i].keyIndex = i+1 ; 
        todo[i].save(function(err) {
          if(err) console.log(err);
        })
      }
      done(null,'true');
    }
    // res.json("Successfully Updated");    
  })
};

app.post("/delete/:id", (req, res) => {
  Todo.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)},function(err){
    if(err){
        console.log("todo ::delete::err ",err);
    }else{
      console.log("res wine delete done");
    }
  })     
  res.redirect("/index");
});

app.get("/edit/:id", (req, res) => {
  Todo.findOne({_id: mongoose.Types.ObjectId(req.params.id)},function(err,todo){
    res.render("edit.ejs", { item: todo });
  });
});

app.post("/update/:id", (req, res) => {
  Todo.findOne({_id: mongoose.Types.ObjectId(req.params.id)},function(err,todo){
    todo.title = req.body.itemName;
    todo.save(function(err) {
      if(err) console.log(err);
    })
    res.redirect("/index");
  })
})

app.listen(PORT || 3000, function(){
  console.log(chalk.green(`server is working at port ${PORT}`))
});

const express = require('express'),
app = express(),
dataBase = require('./Config/dbConnection'),
userRoutes = require('./Routes/user'),
saleRoutes = require('./Routes/sale'),
inputRoutes = require('./Routes/input'),
productRoutes = require('./Routes/product'),
cors = require('cors'),
port= 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/sale", saleRoutes);
app.use("/input", inputRoutes);
app.use("/product", productRoutes);

dataBase.connect()
    .then(()=>{
      console.log("db ok")
    });

app.listen(3000,()=>{

  console.log("It's Works")

});
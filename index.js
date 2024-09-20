const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const app=express()
app.use(bodyParser.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/shopping-cart",{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log("mongodb connected"))
.catch(err=>console.log("mongodb connection error",err))

// Schema
const productSchema=new mongoose.Schema({
    name:String,
    price:Number,
    quantity:Number,
})

const orderSchema=new mongoose.Schema({
    productid:mongoose.Schema.Types.ObjectId,
    quantity:Number,
})

// Model

const Product=mongoose.model("Product",productSchema)
const Order=mongoose.model("Order",orderSchema)

app.get("/product",async(req,res)=>{
    const product = await Product.find()
    res.send(product)
})

app.post("/product",async(req,res)=>{
    const {name,price,quantity}=req.body
    const product = new Product({name,price,quantity})
    await product.save()
    res.status(201).send(product)
})

app.get("/order",async(req,res)=>{
    const order = await Order.find()
    res.send(order)
})

app.post("/order",async(req,res)=>{
    const {productid,quantity}=req.body
    const product = await Product.findById(productid)
    if(product && product.quantity >= quantity){
        product.quantity -=quantity
        await product.save()
        const order = new Order({productid,quantity})
        await order.save()
    }
    else{
        res.status(404).send({message:"product not found"})
    }
})

app.listen(4500,()=>{
    console.log("server run")
})
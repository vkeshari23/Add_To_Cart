import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../Layout/Layout"


export default function Cart() {
    const [product,setProduct]=useState([])
    const [order,setOrders]=useState([])
    const [newProduct,setNewProduct]=useState({
        name:"",
        price:"",
        quantity:""
    })
    const [newOrder,setNewOrder]=useState({
        productid:"",
        quantity:""
    })
    useEffect(()=>{
        fetchProducts()
        fetchOrders()
    },[])

    const fetchProducts = async()=>{
        const res = await axios.get(`http://localhost:4500/product`)
        setProduct(res.data)
    }
    const fetchOrders = async()=>{
        const res = await axios.get(`http://localhost:4500/order`)
        setOrders(res.data)
    }

    const addProduct=async ()=>{
        const res=await axios.post(`http://localhost:4500/product`,newProduct)
        setProduct([...product,res.data])
        setNewProduct({name:"",price:"",quantity:""})
    }

    const placeOrder = async()=>{
        try{
            const res = await axios.post(`http://localhost:4500/order`,newOrder)
            setOrders([...order,res.data])
            fetchProducts()
            setNewOrder({productid:"",quantity:""})
        }
        catch(err){
            alert(err.response.data.message)
        }
    }
    const handlesubmit=(e)=>{
        e.preventdefault()
    }
  return (
    <Layout>
    <form onSubmit={handlesubmit} className="bg-body-tertiary ">
    <h2>Add Product</h2>
    <input type="text" placeholder="Name" value={newProduct.name} onChange={(e)=>{setNewProduct({...newProduct,name:e.target.value})}}/><br/><br/>
    <input type="number" placeholder="Price" value={newProduct.price} onChange={(e)=>{setNewProduct({...newProduct,price:e.target.value})}}/><br/><br/>
    <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e)=>{setNewProduct({...newProduct,quantity:e.target.value})}}/><br/>

    <button onClick={addProduct} className="btn btn-success">Add Product</button>

    <div className="mt-4 bg-danger-subtle">

    <h2>Products</h2>


    <ul>
        {
            product.map(product=>(<li key={product._id}>{product.name} {product.price} (Quantity:{product.quantity})</li>))
        }
    </ul>
    </div>

<div className="mt-4">
    <h2>Place Order</h2>

    <select value={newOrder.productid} onChange={(e)=>{setNewOrder({...newOrder,productid:e.target.value})}}>

        <option value="">Select Product </option>
           {product.map(product=>(<option key={product._id} value={product._id}>
           {product.name}
        </option>
    ))}
    </select>
    <br/><br/>

    <input type="number" placeholder="Quantity" value={newOrder.quantity} onChange={(e)=>setNewOrder({...newOrder,quantity:e.target.value})} /><br/>
    <button onClick={placeOrder} className="btn btn-info">Place Order</button>

   <div className="card">
  <div className="card-body">
  <ul>
        {order.map(order=>(
            <li key={order._id}>Order: {order._id} -  Product Id: {order._id} , Quantity: {order.quantity}</li>
        ))}
    </ul>
  </div>
</div>
    </div>
    </form>

    </Layout>
  )
}

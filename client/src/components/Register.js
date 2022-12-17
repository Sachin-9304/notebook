import React,{useState} from 'react'
import axios from "axios"

const Register = () => {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const register=async (e)=>{
    e.preventDefault()
    const userdata={
      "name":name,
      "email":email,
      "password":password
    }
    try{
      const res = await axios.post('http://localhost:5000/addUser',userdata)
      console.log(res.data)
    }
    catch(err){
      console.log(err)
    }
    try{
      const res = await axios.post('http://localhost:5000/login',userdata)
      const token=res.data
      localStorage.setItem("jwtToken",token)
    }
    catch(err){
      console.log(err)
    }
    windows.location="/home"
  }
  return (
    <>
    <h1>register</h1>
    <form onSubmit={register}>
      <input type="text" value={name} placeholder="name" onChange={(e)=>{setName(e.target.value)}}/>
      <input type="email" value={email} placeholder="email" onChange={(e)=>{setEmail(e.target.value)}}/>
      <input type="password" value={password} placeholder="password" onChange={(e)=>{setPassword(e.target.value)}}/>
      <input type="submit"/>
    </form>
    </>
  )
}

export default Register

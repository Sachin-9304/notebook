import React,{useState} from 'react'
import axios from 'axios'


const Login = () => {
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
   const login=async (e)=>{
    e.preventDefault()
    const userdata={
      "email":email,
      "password":password
    }
    try{
      const res = await axios.post('http://localhost:5000/login',userdata)
      const token=res.data
      localStorage.setItem("jwtToken",token)
      
    }
    catch(err){
      console.log(err)
    }
    try{
      const token=localStorage.getItem("jwtToken")
      const res2=await axios.get('http://localhost:5000/current',{
        headers:{
          "Authorization":"Bearer "+ token
        }
      })

      console.log(res2)

    }
    catch(err){
      console.log(err)
    }
    window.location="/home"
   }
   
  return (
    <div>
      <form onSubmit={login}>
        <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default Login

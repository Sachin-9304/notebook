import axios from 'axios'
import React, { useState } from 'react'

const AddNote = () => {
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [tag,setTag]=useState("")
    const add=async (e)=>{
        e.preventdefault()
        const userdata={
            "title":title,
            "description":description,
            "tag":tag,
            "user":localStorage.getItem("jwtToken")
        }
        try{
            const res=await axios.post("http://localhost:5000/addNotes",userdata)
            console.log(res)

        }
        catch(err){
            console.log(err)
        }
    }
    
  return (
    <div>
      <h1>add note</h1>
      <form onSubmit={add}>
        <input type="text" placeholder="title" onChange={(e)=>{setTitle(e.target.value)}}/>
        <input type="text" placeholder="description" onChange={(e)=>{setDescription(e.target.value)}}/>
        <input type="text" placeholder="tag" onChange={(e)=>{setTag(e.target.value)}}/>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default AddNote

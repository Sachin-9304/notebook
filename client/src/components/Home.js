import axios from 'axios'
import React, { useEffect, useState,useCallback } from 'react'
import AddNote from './AddNote'
import Card from './Card'

const Home = () => {
    const [notes,setNotes]=useState([])
    const [loading,setLoading]=useState(false)
    const foo = useCallback(
        async () => {
            try {
                const token = localStorage.getItem("jwtToken")
                const res = await axios.get('http://localhost:5000/current/notes', {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
                
                setNotes(res.data)
            }
            catch(err){
                console.log(err.response.data)
            }
        },
        []
    )
    useEffect(() => {
        
        setLoading(true)
        foo()
        setLoading(false)
    },[foo])

    if (loading==false && notes.length==0 ){
        return (
            <div>
                <h3>user don't have any notes</h3>
            </div>
        )
    }
    return(
        <div>
            
            {
                loading==true?
                <h1>loading</h1>:
                    <div>
                        <AddNote/>
                        <h2>display user notes {notes.length}</h2>
                        <ul>{notes.map((i)=>{
                            return <Card key={i._id} note={i}>{i.title}</Card>
                        })}</ul>
            
                    </div>
                
            }
        </div>
    )
}

export default Home

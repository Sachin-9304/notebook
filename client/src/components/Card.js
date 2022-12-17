import React from 'react'

const Card = (props) => {
  return (
    <div>
      <h2>{props.note.title}</h2>
      <p>{props.note.description}</p>
    </div>
  )
}

export default Card

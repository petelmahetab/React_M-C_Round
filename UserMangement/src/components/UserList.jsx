import React from 'react'

const UserList = ({users,onDelete,onEdit}) => {
    if(users.length === 0) return <p>No user Yet.</p>
  return (
    <div>
        <ul>
            {users.map((u)=>{
                return <li key={u.id}>
                    <span>{u.name} - {u.email}</span>
                    <button onClick={()=>onDelete(u.id)}>Delete</button>
                    <button onClick={()=>onEdit(u)}>Edit</button>
                </li>
            })}
        </ul>
    </div>
  )
}

export default UserList
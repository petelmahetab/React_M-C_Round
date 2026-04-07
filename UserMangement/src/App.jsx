import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FormInput from './components/FormInput'
import UserList from './components/UserList'

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe123@gmail.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe345@gmail.com' }
  ])
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const addUser = (user) => {
    if (editedUser && isEditing) {
      setUsers(prevUsers => prevUsers.map(u =>
        u.id === editedUser.id ? { ...u, ...user } : u
      ));
      setEditedUser(null);
      setIsEditing(false);
    } else {

      setUsers([...users, { id: Date.now(), ...user }]);
    }
  }

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id))
  const editUser = (user) => {
    setEditedUser(user);
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditedUser(null);
    setIsEditing(false);
  }
  return (
    <>
      <h1>User Management</h1>
      <FormInput onSubmit={addUser} isEditing={isEditing} editUser={editedUser} onCancel={cancelEdit} />
      <UserList users={users} onDelete={deleteUser} onEdit={editUser} />
    </>
  )
}

export default App

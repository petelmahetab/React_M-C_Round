import React from 'react'
import { useState, useEffect } from 'react'

const FormInput = ({ onSubmit, isEditing, editUser, onCancel }) => {
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')

    //UseEffect for 
    useEffect(() => {
        if (isEditing && editUser) {
            setUserName(editUser.name || '')
            setUserEmail(editUser.email || '')
        } else {
            setUserName('')
            setUserEmail('')
        }
    }, [isEditing, editUser])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userName.trim() || !userEmail.trim()) {
            alert('All fields are required.')
            return;
        }

        onSubmit({ name: userName.trim(), email: userEmail.trim() });
        if (!isEditing) {
            setUserEmail('')
            setUserName('')
        }
    }

    return (
        <>
            <h2 >User Form</h2>
            <form onSubmit={handleSubmit}>
                <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='UserName' required />
                <input type='email' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder='UserEmail' required />

                <button type='submit'>{isEditing ? 'Update' : 'Add'} User</button>
                {isEditing && <button type='button' onClick={onCancel}>Cancel</button>}
            </form>
        </>
    )
}

export default FormInput
import React from 'react'
import {Link} from 'react-router-dom'

function Create() {
    return (
        <div>
            <Link to='/create/family'>Создать карту семьи</Link>
            <Link to='/create/parents'>Создать карту родителя</Link>
            <Link to='/create/children'>Создать карту ребенка</Link>
            <Link to='/create/specialists'>Создать карту специалиста</Link>
            <Link to='/create/institution'>Создать карту учреждения</Link>
        </div>
    )
}

export default Create

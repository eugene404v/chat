import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

function Create() {
    const userData = useSelector(state => state.userReducer)
    const [access, setAccess] = React.useState(false)

    React.useEffect(() => {
        if (userData.lvl==='admin' || userData.lvl === 'region') {
            setAccess(true)
          }
    }, [userData.lvl])

    return (
        <div>
            <Link to='/create/family'>Создать карту семьи</Link> <br/> <br/>
            <Link to='/create/parents'>Создать карту родителя</Link> <br/> <br/>
            <Link to='/create/children'>Создать карту ребенка</Link> <br/> <br/>
            <Link to='/create/specialists'>Создать карту специалиста</Link> <br/> <br/>
            {access && <Link to='/create/institution'>Создать карту учреждения</Link>}
        </div>
    )
}

export default Create

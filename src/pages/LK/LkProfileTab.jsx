import React from 'react'
import {PairLink, Pair} from 'components'

function LkProfileTab(props) {
    return (
        <div className='lk__item'>
            <h2>Мой профиль</h2>
            <PairLink descr="ФИО:" link={`/users/view/${props.userId}`} text={props.fio} />
            <PairLink descr='Место работы:' link={`/institution/view/${props.instId}`} text={props.inst} />
            <Pair descr='Уровень:'>{props.level}</Pair>
        </div>
    )
}

export default LkProfileTab

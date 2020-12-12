import { Button } from 'antd'
import { Pair } from 'components'
import React from 'react'

function LkReports() {
    return (
        <div>
            <h2>Сводный отчет активности пользователей за последние 3 месяца</h2>
            <Pair descr='Отчет активности операторов ОО'><a href={`/`} download><Button>Скачать</Button></a></Pair>
            <Pair descr='Отчет активности муниципальных операторов'><a href={`/`} download><Button>Скачать</Button></a></Pair> 
            <Pair descr='Отчет активности мастеров'><a href={`/`} download><Button>Скачать</Button></a></Pair>
            <Pair descr='Отчет активности региональных операторов'><a href={`/`} download><Button>Скачать</Button></a></Pair>
        </div>
    )
}

export default LkReports

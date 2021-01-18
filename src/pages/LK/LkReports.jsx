import { Button } from 'antd'
import axios from 'axios'
import { Pair } from 'components'
import React from 'react'


function LkReports() {

    return ( 
        <div className='lk__item'>
            <h2>Сводный отчет активности пользователей за последние 3 месяца</h2>
            <Pair descr='Отчет активности операторов ОО'><a href="/history/actionReport/organization/excel" download><Button>Скачать</Button></a></Pair> <br/>
            <Pair descr='Отчет активности муниципальных операторов'><a href="/history/actionReport/municipal/excel" download><Button>Скачать</Button></a></Pair> <br/>
            <Pair descr='Отчет активности мастеров'><a href="/history/actionReport/master/excel" download><Button>Скачать</Button></a></Pair> <br/>
            <Pair descr='Отчет активности региональных операторов'><a href="/history/actionReport/region/excel" download><Button>Скачать</Button></a></Pair>
        </div>
    )
}

export default LkReports

import { Button } from 'antd'
import React from 'react'

function CommonReports(props) {
    return (
        <div>
            <h1>Сводный отчет по сведениям из карт детей</h1>
            <Button>excel</Button>
            <table>
                <thead>
                    <tr>
                        <th>ФИО ребенка</th>
                        <th>Дата рождения</th>
                        <th>Вид проф. учета</th>
                        <th>ОО</th>
                    </tr>
                </thead>
                <tbody>
                    {children && Array.isArray(children.data) && children.data.map(el => {
                        return (
                            <tr>
                                <td>{el.fio}</td>
                                <td>{el.birthDate}</td>
                                <td>{el.childProf && el.childProf.name}</td>
                                <td>{el.institution && el.institution.name}</td> 
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default CommonReports

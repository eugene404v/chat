import {UserOutlined, SoundOutlined, IdcardOutlined, FolderOutlined, FileOutlined, FileTextOutlined, FolderAddOutlined, GoldOutlined  } from '@ant-design/icons'

export  const sideData = [
    {
        text: 'Личный кабинет',
        link: '/cabinet',
        icon: <UserOutlined/>,
        access: true
    },
    {
        text: 'Новости',
        link: '/',
        icon: <SoundOutlined/>,
        access: true
    },
    {
        text: 'Карты семей',
        link: '/familyreport',
        icon: <IdcardOutlined />,
        access: true
    },
    {
        text: 'Карты родителей',
        link: '/parentsreport',
        icon: <IdcardOutlined />,
        access: true
    },
    {
        text: 'Карты детей',
        link: '/childrenreports',
        icon: <IdcardOutlined />,
        access: true
    },
    {
        text: 'Карты учреждений',
        link: '/instreport',
        icon: <IdcardOutlined />,
        access: true
    },
    {
        text: 'Карты специалистов',
        link: '/specsreport',
        icon: <IdcardOutlined />,
        access: true
    },
    {
        text: 'Архивы карт',
        link: '/archives',
        icon: <FolderOutlined />,
        access: false
    },
    {
        text: 'Документы',
        link: '/documents',
        icon: <FileOutlined />,
        access: true
    },
    {
        text: 'Сводные отчеты',
        link: '/commonreports',
        icon: <FileTextOutlined />,
        access: true
    },
    {
        text: 'Создать карту',
        link: '/create',
        icon: <FolderAddOutlined />,
        access: true
    },
    {
        text: 'Автосверка',
        link: '/autocheck',
        icon: <GoldOutlined />,
        access: true
    },
]
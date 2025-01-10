import { useEffect, useState } from 'react';
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconUser,
} from '@tabler/icons-react';
import { Title, Tooltip, UnstyledButton } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../assets/css/DoubleNavbar.module.css';
import { Link } from 'react-router-dom';

const mainLinksMockdata = [
  { icon: IconHome2, label: 'Home', path:'/home', loggedIn: false },
  { icon: IconGauge, label: 'Dashboard', path:'/dashboard', loggedIn: true },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics', path: '/analytics', loggedIn: true },
  { icon: IconCalendarStats, label: 'Releases', path:'/releases', loggedIn: false },
  { icon: IconUser, label: 'Account', path: '/account', loggedIn: false },
  { icon: IconFingerprint, label: 'AddTodo', path: '/add-todo', loggedIn: true }, // Tương ứng với AddTodo
];

export function DoubleNavbar() {
  const [active, setActive] = useState('AddTodo');

  const taiKhoan = sessionStorage.getItem("taiKhoan") || null

  const loggedIn = mainLinksMockdata.filter(link => link.loggedIn )
  const notLogged = mainLinksMockdata.filter(link => !link.loggedIn )

  const mainLinks = taiKhoan != null ? (
    loggedIn.map((link)=>(
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <Link to={link.path} className={classes.mainLink}>
          <UnstyledButton>
            <link.icon size={22} stroke={1.5} />
          </UnstyledButton>
        </Link>
      </Tooltip>
    ))
  ):(
    notLogged.map((link)=>(
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <Link to={link.path} className={classes.mainLink}>
          <UnstyledButton>
            <link.icon size={22} stroke={1.5} />
          </UnstyledButton>
        </Link>
      </Tooltip>
    ))
  )
  
  // const mainLinks = mainLinksMockdata.map((link) => (
  //   <Tooltip
  //     label={link.label}
  //     position="right"
  //     withArrow
  //     transitionProps={{ duration: 0 }}
  //     key={link.label}
  //   >
  //     <Link to={link.path} className={classes.mainLink}>
  //       <UnstyledButton>
  //         <link.icon size={22} stroke={1.5} />
  //       </UnstyledButton>
  //     </Link>
  //   </Tooltip>
  // ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <MantineLogo type="mark" size={30} />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            Double Navbar
          </Title>
        </div>
      </div>
    </nav>
  );
}

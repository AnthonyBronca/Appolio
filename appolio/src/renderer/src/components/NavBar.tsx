import React from 'react';
import "../styles/home.css";
import userIcon from '../components/Home/assets/user-solid-light.svg'
import pencilIcon from '../components/Home/assets/pencil-solid.svg';
import fileIcon from '../components/Home/assets/file-regular.svg';
import projectIcon from '../components/Home/assets/diagram-project-solid.svg'
import supportIcon from '../components/Home/assets/envelope-regular.svg';

const menuItems = [
    {
        name: "Applications",
        icon: pencilIcon,
        active: true
    },
    {
        name: "Resumes",
        icon: fileIcon,
        active: false
    },
    {
        name: "Projects",
        icon: projectIcon,
        active: false
    },
    {
        name: "Profile",
        icon: userIcon,
        active: false
    },
    {
        name: "Support",
        icon: supportIcon,
        active: false
    },
]

interface INavBarProps {
    activeIcon: string;
    setActiveIcon: Function;
    setCurrentPage: Function;
}

const NavBar:React.FC<INavBarProps> = ({activeIcon, setActiveIcon, setCurrentPage}) => {

    const changePage = (updatedPage:string) => {
        setActiveIcon(updatedPage);
        setCurrentPage(updatedPage[0])
    }

  return (
      <ul className='nav-menu-container'>
          {menuItems.map((menuItem, idx) => (
              <div
                  key={`${idx}-${menuItem}`}
                  className='nav-menu-div'
              >
                  <li
                      className={activeIcon === `${idx}-${menuItem.name}` ? 'active-menu-list-item' : 'menu-list-item'}
                      onClick={() => changePage(`${idx}-${menuItem.name}`)}
                  >
                      <img src={menuItem.icon} alt='menu-item-icon' className='menu-icon' />
                      <div>
                          <span>
                              {menuItem.name}
                          </span>
                      </div>
                  </li>
              </div>
          ))}
      </ul>
  );
}

export default NavBar;

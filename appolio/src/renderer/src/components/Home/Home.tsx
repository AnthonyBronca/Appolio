import { useState } from 'react';
import '../../styles/home.css';
import userIcon from './assets/user-solid-light.svg';
import pencilIcon from './assets/pencil-solid.svg';
import fileIcon from './assets/file-regular.svg';
import projectIcon from './assets/diagram-project-solid.svg'
import supportIcon from './assets/envelope-regular.svg';
import Divider from '../Divider';
import NavBar from '../NavBar';



const Home = () => {
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

    const [activeIcon, setActiveIcon] = useState("0-Applications");
    const [currentPage, setCurrentPage] = useState(activeIcon[0]);

    return (
        <div id='home'>
            <div className='body-container'>
                <h1>Home</h1>
                <Divider />
                <div id='body-item'>
                    <NavBar
                        activeIcon={activeIcon}
                        setActiveIcon={setActiveIcon}
                        setCurrentPage={setCurrentPage}
                        />
                    <div className='right-panel'>
                        <h1>{menuItems[currentPage].name}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

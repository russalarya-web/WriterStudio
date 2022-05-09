import React, {useEffect, useState} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faEllipsisV as dotsIcon} from '@fortawesome/free-solid-svg-icons';

import {useTitle, getClassCode} from '../App';

import Files from './Files';

import { setTitleForBrowser } from '../resources/title';
import { db, getDoc } from "../firebase/config";

import { Navigate, useParams } from 'react-router-dom';
import { Project } from '../Recents/popups/NewProject';
import TitleBar from '../objects/TitleBar';
import { MainView, MainViewTop, sidebarIcon, Title } from '../Recents/Home';
import Sidebar from './Sidebar';
import Menu from '../objects/Menu';
import ButtonObject from '../objects/ButtonObject';
import { DropdownGen } from '../objects/Dropdown';
import { projectDotDropdown } from '../resources/dropdowns';
import Button from '../objects/Button';

type Props = { 
    isDarkTheme: boolean; 
    mode: string;
    setMode: (e: string) => void; 
    switchTheme: (arg0: boolean) => void;
    showMenu: boolean;
    toggleMenu: (e: boolean) => void;
    hideSidebar: boolean;
    setHideSidebar: (e: boolean) => void;
}

const getDetails = async (uid: string) => {
    return await db.collection("users").doc(uid).get()
    .then(snapshot => snapshot.data())
}

const Home = (props: Props) => {
    const [current, setCurrent] = useState('cards');
    const [showDropdown, setShowDropdown] = useState(false);

    let { projectId } = useParams<string>();

    projectId = projectId ? projectId : "";

    // initialise file data
    const [projectData, setData] = useState<Project>();

    async function getProjectData() {
        const docRef = db.collection('projects').doc(projectId);

        // @ts-ignore
        const tempDoc: Project = (await getDoc(docRef)).data();
        
        if (tempDoc) {
            setData(tempDoc);
        }
    }

    // call function
    useEffect(() => {
        getProjectData();
    }, [])

    var color = getClassCode(props.mode, props.isDarkTheme)
    const darkTheme = getClassCode("", props.isDarkTheme)

    const leftMenu: ButtonObject[] = [
        {
            id: "sidebar",
            onClick: (e: Event) => {
                e.preventDefault();
                props.setHideSidebar(!props.hideSidebar);
            },
            text: <FontAwesomeIcon icon={sidebarIcon((!props.hideSidebar))} />
        },
        {
            id: "back",
            type: "link",
            onClick: "/",
            text: <FontAwesomeIcon icon={faHome} />
        }
    ]

    const rightMenu: ButtonObject[] = [{
        id: "dots",
        onClick: (e: Event) => {
            e.preventDefault();
            setShowDropdown(!showDropdown);
        },
        text: <FontAwesomeIcon icon={dotsIcon} />
    }];

    let title = projectData ? projectData.name : "";

    useTitle(setTitleForBrowser(title));

    let authToken = sessionStorage.getItem('Auth Token');

    if (!authToken) {
        return (<Navigate to="/" />)
    }

    const sidebarElements = ["cards", "story-map"];

    return (
        <div className={"full-screen"}>
            <TitleBar 
                mode={props.mode}
                setMode={props.setMode}
                title={title}
                isDarkTheme={props.isDarkTheme}
                switchTheme={props.switchTheme}
                showMenu={props.showMenu}
                toggleMenu={props.toggleMenu}
            />
            <Sidebar 
                elements={sidebarElements} 
                current={current} 
                setCurrent={setCurrent}
                isDarkTheme={props.isDarkTheme}
                mode={props.mode}
                setMode={props.setMode}
                color={color} 
                hide={props.hideSidebar} 
                projectId={projectId} 
                projectFiles={projectData ? projectData.files : []}
            />
            <MainView 
                className="no-select grow"
                onClick={(e) => {
                    setShowDropdown(false)
                }}
            >
                <MainViewTop>
                    <Menu 
                        className="top-layer"
                        isDarkTheme={props.isDarkTheme} 
                        color={color} 
                        border={false}
                        data={leftMenu}
                    />
                    <Title className={color + "-color"}>{title}</Title>
                    <div className="grow"></div>
                    <Button 
                        id="" 
                        text={<FontAwesomeIcon icon={dotsIcon} />} 
                        color={color} 
                        border="no" 
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowDropdown(!showDropdown)
                        }}
                    />
                    <div className="absolute semi-push-right semi-push-up">{
                        showDropdown 
                        ? DropdownGen(
                            color, 
                            props.isDarkTheme, 
                            projectDotDropdown()
                        ) : null
                    }</div>
                </MainViewTop>
                <Files 
                    color={color} 
                    isDarkTheme={props.isDarkTheme} 
                    list={projectData ? projectData.files : []}
                    current={current} 
                />
            </MainView>
        </div>
    )
}

export default Home;
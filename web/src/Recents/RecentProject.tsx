import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV as dotsIcon } from '@fortawesome/free-solid-svg-icons';

import Button from "../objects/Button";
import { WSProjectWithId } from "./popups/NewProject";
import { FileContainer, Heading } from "./RecentFile";

type Props = {
    file: WSProjectWithId,
    classCode: string
}

const RecentProject = (props: Props) => {
    var classCode = props.classCode;

    const file = props.file;

    const timeStamp = file.time ? file.time.seconds * 1000 : Date.now();
    const time = new Intl.DateTimeFormat('en-US', {year: 'numeric', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}).format(timeStamp);
    
    return (
        <FileContainer className={"no-select white " + classCode + "-color"}>
            <div className="row">
                <Link className={classCode + "-color grow"} to={"/project/" + file.id}>
                    <Heading>{file.name}</Heading>
                </Link>
                <Button 
                    id="" 
                    text={<FontAwesomeIcon icon={dotsIcon} />} 
                    color={classCode} 
                    border="no" 
                    onClick={(e) => {e.stopPropagation()}}
                />
            </div>
            <p className={"heading left " + classCode + "-color"}>Last opened: {time}</p>
        </FileContainer>
    );
}

export default RecentProject;
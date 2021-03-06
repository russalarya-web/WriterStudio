import { collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';
import styled from "styled-components";
import { DocumentWithId } from "../dataTypes/Document";
import { ProjectWithId } from "../dataTypes/Project";
import { db, getDocs, query, where } from "../firebase/config";
import RecentFile from "./RecentFile";

type Props = { 
	color: string; 
	isDarkTheme: boolean;
	project: ProjectWithId;
};

export const Heading = styled.h1`
	font-weight: 400;
	margin: 5px 0;
	font-size: 26px;
	margin: 0 10px;
	text-align: left;
`;

const ProjectFiles = (props: Props) => {
	const userId = sessionStorage.getItem("userId");
    const [files, setFiles] = useState<DocumentWithId[]>([]);

	const [timedOut, toggleTimedout] = useState(false);

    async function getFiles() {
		const filesRef = collection(db, 'files');
		const q = query(filesRef, where("project", "==", props.project.id));

		await getDocs(q).then((querySnapshot) => {
            let filesFromDB = querySnapshot.docs.map((doc) => {
				// @ts-ignore
				const file: DocumentWithId = {id: doc.id, ...doc.data()};				
				return file;
            })
			
			setFiles(filesFromDB);
        })
    }

    useEffect(() => {
		setTimeout(() => {
			toggleTimedout(!timedOut);
		}, 4000);
		getFiles();
    }, [props.project])

	if (userId) {
		if (files.length === 0) {
			if (timedOut) {
				return (<h1 className={"heading " + props.color + "-color"}>No documents found...</h1>)
			}
			return (<div style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				<ClipLoader color="#6166B3" />
			</div>)
		}
	}

	return (
		<div className="row wrap">
			{files.map((file) => {
				return <RecentFile file={file} isDarkTheme={props.isDarkTheme} />
			})}
		</div>
	);
}

export default ProjectFiles;
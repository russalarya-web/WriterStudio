import Home from './views/Home';
import WriterView from './views/WriterView';

import { HashRouter, Route, Routes, Outlet, Link } from "react-router-dom";
import {useEffect} from 'react';

import './App.css';

// import firebase from 'firebase/compat/app';

// set class code
export function getClassCode(text) {
    switch (text.toLowerCase()) {
        case 'screenplay':
            return "green";
        
        case 'teleplay':
            return "brown";
        
        case 'series':
            return "purple";
    }
}

// set page title
export function useTitle(title) {
	useEffect(() => {
		const prevTitle = document.title;

		document.title = title;
		
		return () => {
			document.title = prevTitle
		}
	})
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function App() {

	return (
		<HashRouter>
			<div className="app">
				<Routes>
				<Route exact path="/" element={<Outlet />}>
					<Route index element={<Home />}/>
					<Route path="document/:documentType/:documentId/:documentName" element={<WriterView />}/>
					<Route path="*" element={<NoMatch />} />
				</Route>

				</Routes>
				<Outlet />
			</div>
		</HashRouter>
	);
}

export default App;
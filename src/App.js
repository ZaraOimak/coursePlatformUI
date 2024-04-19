import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Course from './components/Course';
import CourseList from './components/CourseList';
import './styles/App.css';
import LessonDetail from "./components/LessonDetail";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<CourseList/>}/>
                <Route path="/course/:uuid" element={<Course/>}/>
                <Route path="/course/:courseUuid/topic/:topicUuid" element={<LessonDetail/>}/>
            </Routes>
        </>
    );
};

export default App;

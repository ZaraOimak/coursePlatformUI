import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import './styles/App.css';
import CoursePage from "./pages/CoursePage";
import CourseGallery from "./pages/CourseGallery";
import TopicPage from "./pages/TopicPage";
import Sandbox from "./pages/Sandbox";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<CourseGallery/>}/>
                <Route path="/sandbox" element={<Sandbox/>}/>
                <Route path="/course/new" element={<CoursePage />} />
                <Route path="/course/edit/:uuid" element={<CoursePage />} />
                <Route path="/course/:uuid" element={<CoursePage/>}/>

                <Route path="/course/:courseUuid/topic/new" element={<TopicPage/>}/>
                <Route path="/course/:courseUuid/topic/edit/:topicUuid" element={<TopicPage/>}/>
                <Route path="/course/:courseUuid/topic/:topicUuid" element={<TopicPage/>}/>

            </Routes>
        </>
    );
};

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Course from './components/Course';
import CourseList from './components/CourseList';
import './styles/App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/course/:uuid" element={<Course />} />
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourse } from "../api/coursesApi";
import Header from "../components/Header";
import Course from "../components/Course";
import Footer from "../components/Footer";
import CourseService from "../services/CourseService";

const courseService = new CourseService();

const CoursePage = () => {
    const { uuid } = useParams();
    const [course, setCourse] = useState();

    useEffect(() => {
        if (!uuid) {
            // Если uuid не передан, создаем новый курс
            const authorUUID = localStorage.getItem('authorUUID');
            if (authorUUID) {
                const emptyCourse = courseService.createEmptyCourse(authorUUID);
                setCourse(emptyCourse);
            }
        } else {
            // Если uuid передан, загружаем курс
            fetchCourse(uuid).then((courseData) => {
                setCourse(courseData);
            });
        }
    }, [uuid]);

    return (
        <>
            <Header />
            {course ? <Course course={course} /> : <div>Loading....</div>}
            <Footer />
        </>
    );
};

export default CoursePage;

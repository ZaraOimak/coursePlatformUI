import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchCourse} from "../api/coursesApi";
import Header from "../components/Header";
import Course from "../components/Course";
import Footer from "../components/Footer";

const CoursePage = () => {
    const {uuid} = useParams();
    const [course, setCourse] = useState();

    useEffect(() => {
        let mounted = true;
        fetchCourse(uuid).then(courseData => {
            if (mounted) {
                setCourse(courseData);
            }
        });
        return () => {
            mounted = false;
        };
    }, [uuid]);

    return (<>
        <Header/>
        {
            course !== undefined ? <Course course={course}/> : <div> Loading....</div>
        }
        <Footer/>
    </>);
}

export default CoursePage;
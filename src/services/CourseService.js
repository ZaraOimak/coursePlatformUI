

class CourseService {
    createEmptyCourse = (authorUuid) => {
        return {
            name: '',
            description: '',
            authorUuid: authorUuid,
            sections: []
        };
    };

}

export default CourseService;

class TopicService {
    createEmptyTopic = (sectionUuid) => {
        return {
            sectionUuid: sectionUuid,
            name: '',
            description: '',
            previousTopicUuid: null,
            nextTopicUuid: null,
            blocks: [],
            position: null
        };
    };
}

export default TopicService;

class TopicService {
    createEmptyTopic = (sectionUuid) => {
        return {
            uuid: '',
            sectionUuid: sectionUuid,
            name: 'новый урок',
            description: '',
            previousTopicUuid: null,
            nextTopicUuid: null,
            blocks: [],
            position: null
        };
    };
}

export default TopicService;

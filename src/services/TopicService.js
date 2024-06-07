export const createEmptyTopic = (sectionUuid) => {
        return {
            sectionUuid: sectionUuid,
            name: 'новый урок',
            description: 'описание урока',
            previousTopicUuid: null,
            nextTopicUuid: null,
            blocks: [],
            position: null
        };
};

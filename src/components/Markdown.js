import React, { useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';


const mdParser = new MarkdownIt();


const MarkdownEditorComponent = () => {
    const [content, setContent] = useState('');

    return (
        <MdEditor
            value={content}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) => setContent(text)}
        />
    );
};

export default MarkdownEditorComponent;
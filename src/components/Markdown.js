import React, { useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';


const mdParser = new MarkdownIt();

function handleEditorChange({ html, text }) {
    // Здесь вы можете работать с полученным markdown текстом
}

const MarkdownEditorComponent = () => {
    const [content, setContent] = useState('');

    return (
        <MdEditor
            value={content}
            style={{ height: '500px' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) => setContent(text)}
        />
    );
};

export default MarkdownEditorComponent;
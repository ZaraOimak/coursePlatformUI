import React, {useState} from 'react';
import {SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider} from '@codesandbox/sandpack-react';
import {Button} from "react-bootstrap";

const SandboxTr = () => {
    const [showEditor, setShowEditor] = useState(true);

    const toggleEditor = () => {
        setShowEditor(prevShowEditor => !prevShowEditor);
    };

    return (
        <>
            <div className="container my-1">
                <h1>Учебный редактор</h1>
                <Button
                    variant="outline-info"
                    className="btn btn-primary mb-3"
                    style={{
                        height: '60px',
                        maxWidth: '153px',
                        minWidth: '153px',
                        backgroundColor: '#50F1BE',
                        borderColor: '#50F1BE',
                        borderRadius: '15px',
                        color: 'black',
                        marginRight: '20px'
                    }}
                    onClick={toggleEditor}
                >
                    {showEditor ? 'Скрыть редактор' : 'Показать редактор'}
                </Button>
                <SandpackProvider
                    template="static"
                    theme="light"
                    files={{
                        "/index.html": {
                            code: `
<!DOCTYPE html>
<html>
  <head>
    <title>Учебный редактор</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <h2>Текст с примененными стилями из файла style.css</h2>
    <div>
      <p> обычный текст</p>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </div>
  </body>
</html>
`,
                        },
                        "/index.js": {
                            code: `console.log("Hello World");`,
                        },
                        "/style.css": {
                            code: `
body { background-color: gray; } 
h2 { color: pink; }`,
                        },
                    }}
                >
                    <SandpackLayout>
                        {showEditor && (
                            <SandpackCodeEditor
                                showLineNumbers={true}
                                style={{height: '65vh', width: '50%', border: '2px solid #50F1BE'}}
                                showTabs={true}
                                resizablePanels={true}
                            />
                        )}
                        <SandpackPreview
                            showOpenInCodeSandbox={true}
                            style={{height: '65vh', width: showEditor ? '50%' : '100%', border: '2px solid #50F1BE'}}
                        />
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </>
    );
};

export default SandboxTr;

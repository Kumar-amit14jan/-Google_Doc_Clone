import Box from '@mui/material/Box';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import "./editor.css";
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']
];
export function Editor() {
    let [socket, setSocket] = useState();
    let [quill, setQuill] = useState();
    let { id } = useParams();
    let [selection, setSelection] = useState(null);
    let [showInput, setShowInput] = useState(false);
    let [position, setPosition] = useState({ top: 0, left: 0 });
    let [inputValue, setInputValue] = useState('');

    // work once component initialize
    useEffect(() => {
        if (!document.querySelector('#container .ql-editor')) {
            const quillServer = new Quill('#container', {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions
                },
            },
            );
            quillServer.disable();
            quillServer.setText('Loading a document!')
            setQuill(quillServer);
            quillServer.on('selection-change', (range) => {
                if (range && range.length > 0) {
                    const bounds = quillServer.getBounds(range.index, range.length);
                    setPosition({ top: bounds.top, left: bounds.left });
                    setSelection(range);
                    setShowInput(true);
                } else {
                    setShowInput(false);
                }
            });
        }
    }, []);
    // to establish connection in ui side
    useEffect(() => {
        const socket = io('https://cuddly-waddle-4w4v75xgg7x2j564-9000.app.github.dev/', { transports: ['websocket'] });
        setSocket(socket)
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!quill || !socket) return;
        const handleChange = (delta, oldDelta, source) => {
            if (source == 'user') {
                socket.emit('send-changes', delta);
            } else {
                return;
            }
        }
        quill.on('text-change', handleChange);
        return () => {
            quill.off('text-change', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (!quill || !socket) return;
        const handleChange = (delta) => {
            quill.updateContents(delta)
        }
        console.log("check the receive changes");
        socket.on('receive-changes', handleChange);
        return () => {
            quill.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (!quill || !socket) return;
        socket.once('load-document', document => {
            quill.setContents(document);
            quill.enable();
        })
        socket.emit('get-document', id)
    }, [quill, socket, id]);
    useEffect(() => {
        if (!quill || !socket) return;
        setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, 2000)
    }, [quill, socket])
    const handleGenerate = () => {
        if (quill && selection) {
            quill.deleteText(selection.index, selection.length);
            quill.insertText(selection.index, '✨ AI-generated content ✨');
            setShowInput(false);
        }
    };


    return (

        <Box id="containerSection" style={{ position: 'relative' }}>
            <Box className="container" id="container" />
            {showInput && (
                <Box
                    style={{
                        position: 'absolute',
                        top: position.top + 30,
                        left: position.left,
                        background: 'white',
                        border: '1px solid #ccc',
                        padding: '8px',
                        borderRadius: '4px',
                        zIndex: 10,
                    }}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowInput(true);
                        }}
                        placeholder="Ask AI to do something..."
                        style={{ padding: '4px', width: '200px', margin: '5px' }}
                    />
                    <button onClick={handleGenerate}>Generate</button>
                </Box>
            )}
        </Box>
    )
}
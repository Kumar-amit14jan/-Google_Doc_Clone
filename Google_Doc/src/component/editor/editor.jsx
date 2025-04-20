import Box from '@mui/material/Box';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect } from 'react';
import "./editor.css"
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],       
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],           
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],    
    [{ 'indent': '-1'}, { 'indent': '+1' }],        
    [{ 'direction': 'rtl' }],                    
  
    [{ 'size': ['small', false, 'large', 'huge'] }], 
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],         
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                        
  ];
export function Editor(){
    // work once component initialize
    useEffect(()=>{
        if (!document.querySelector('#container .ql-editor')) {
            const quillServer = new Quill('#container', {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions
                  },
              },
              );
        }
    },[])
    return (
        <Box id="containerSection">
            <Box className="container" id="container"></Box>
        </Box>
    )
}
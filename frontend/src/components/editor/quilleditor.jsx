import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export const QuillEditor = ({ dataEditor, onChange }) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        [{ align: [] }],
                        ['clean']
                    ]
                },
                placeholder: 'Nhập nội dung!'
            });
            quillInstance.current.on('text-change', () => {
                const content = quillInstance.current.root.innerHTML;
                if (onChange) onChange(content);
            });
        }
    }, [onChange]);
    useEffect(() => {
        if (quillInstance.current && dataEditor) {
            quillInstance.current.clipboard.dangerouslyPasteHTML(dataEditor);
        }
    }, [dataEditor]);

    return <div ref={editorRef} style={{ height: '350px' }} />;
};
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Thêm màu sắc cho chữ và nền chữ
const COLORS = [
    '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
    '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
    '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
    '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
    '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
];

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
                        [{ color: COLORS }, { background: COLORS }],
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
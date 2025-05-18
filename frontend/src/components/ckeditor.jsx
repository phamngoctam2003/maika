import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import '../App.css';

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjQ4MDYzOTksImp0aSI6IjlkYWY2NjA2LTRlOTUtNGUzNi05OGJiLTA4OTY5NTY4OGM2YSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkJPWCJdLCJ2YyI6IjFjM2UxNTU3In0.PE8F54iTOGEXBd0843fjJq-93XhEOpASNppI3curVa4gx9xMyfKGF_QDY_iDRM2nD9_PrfRfSZYF-1ko7Wnvbw';

export default function Ckeditor5Component() {
    const [contentData, setContentData] = useState('');
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const cloud = useCKEditorCloud({ version: '44.1.0', translations: ['vi'] });

    useEffect(() => {
        axios.get('../src/datatest.json')
            .then((response) =>
                setContentData(response.data.data)
            )
    }, []);


    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const { ClassicEditor, editorConfig } = useMemo(() => {
        if (cloud.status !== 'success' || !isLayoutReady) {
            return {};
        }

        const {
            ClassicEditor,
            Alignment,
            AutoImage,
            Autosave,
            BalloonToolbar,
            BlockQuote,
            Bold,
            CloudServices,
            Code,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            Heading,
            Highlight,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Paragraph,
            RemoveFormat,
            SpecialCharacters,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TodoList,
            Underline
        } = cloud.CKEditor;

        return {
            ClassicEditor,
            editorConfig: {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'insertTable',
                        'highlight',
                        'blockQuote',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent'
                    ],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Alignment,
                    AutoImage,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    Bold,
                    CloudServices,
                    Code,
                    Essentials,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    Heading,
                    Highlight,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    Paragraph,
                    RemoveFormat,
                    SpecialCharacters,
                    Strikethrough,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TodoList,
                    Underline
                ],
                balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
                fontFamily: {
                    supportAllValues: true
                },
                fontSize: {
                    options: [10, 12, 14, 'default', 18, 20, 22],
                    supportAllValues: true
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage'
                    ]
                },
                initialData:
                    contentData,
                language: 'vi',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                menuBar: {
                    isVisible: true
                },
                placeholder: 'Type or paste your content here!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                }
            }
        };
    }, [cloud, isLayoutReady]);

    return (
        <div className="main-container">
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} />}</div>
                </div>
            </div>
        </div>
    );
}

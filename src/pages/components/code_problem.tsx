import Editor from "@monaco-editor/react";

const CodeProblem: React.FC = () => {
    return (
        <div className="flex flex-col p-8 gap-4">
            <p className="text-lg">Q. Implement a function to reverse a string in Python.</p>

            <Editor
                height="70vh"
                language="c"
                theme="vs-dark"
                value={""}
            />

            <div className="flex justify-end gap-2 mt-8">
                <button className="px-4 py-2 mr-auto border border-gray-300 rounded-md hover:bg-gray-100 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Problem List
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Clear Response</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save & Next</button>
            </div>
        </div>
    );
};

export default CodeProblem;
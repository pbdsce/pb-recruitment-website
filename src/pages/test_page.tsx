import { useEffect, useState } from "react";
import CodeProblem from "./components/code_problem";
import MCQProblem from "./components/mcq_problem";
import ProblemList from "./components/problem_list";

const TestPage = () => {

    const [hasFocus, setHasFocus] = useState(document.hasFocus());

    useEffect(() => {
        const handleFocus = () => {
            setHasFocus(true);
            console.log('Window has focus');
        };

        const handleBlur = () => {
            setHasFocus(false);
            console.log('Window lost focus');
        };

        // Check focus state periodically as a fallback
        const interval = setInterval(() => {
            const focused = document.hasFocus();
            setHasFocus(focused);
        }, 300);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            clearInterval(interval);
        };
    }, []);


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="min-w-screen h-16 flex flex-col">
                <div className="h-14 flex items-center justify-between px-4 text-xl">
                    <span>Point Blank Recruitment Test 2025</span>
                    <span>Begins in 1d 3h 5m</span>
                </div>
                <div className="h-2 bg-blue-600"></div>
            </div>

            {/* <ProblemList/> */}

            {/* <MCQProblem /> */}

            <CodeProblem />
        </div>
    );
};

export default TestPage;
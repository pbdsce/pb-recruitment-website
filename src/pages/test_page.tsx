import CodeProblem from "./components/code_problem";

const TestPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="min-w-screen h-16 flex flex-col">
                <div className="h-14 flex items-center justify-between px-4 text-xl">
                    <span>Point Blank Recruitment Test 2025</span>
                    <span>Begins in 1d 3h 5m</span>
                </div>
                <div className="h-2 bg-blue-600"></div>
            </div>

            <CodeProblem />
        </div>
    );
};

export default TestPage;
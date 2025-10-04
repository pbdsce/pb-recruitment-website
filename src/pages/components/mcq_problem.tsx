import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MoveLeft } from "lucide-react";

const MCQProblem: React.FC = () => {
    return (
        <div className="flex flex-col p-8 gap-4">
            <p className="text-lg">Q. Does RGB increase performance?</p>
            <RadioGroup className="gap-0">
                <div className="flex items-center gap-3 bg-gray-100 p-4">
                    <RadioGroupItem value="a" id="a" />
                    <Label htmlFor="a">Yes</Label>
                </div>
                <div className="flex items-center gap-3 bg-gray-200 p-4">
                    <RadioGroupItem value="b" id="b" />
                    <Label htmlFor="b">Definitely</Label>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 p-4">
                    <RadioGroupItem value="c" id="c" />
                    <Label htmlFor="c">Positively</Label>
                </div>
                <div className="flex items-center gap-3 bg-gray-200 p-4">
                    <RadioGroupItem value="d" id="d" />
                    <Label htmlFor="d">Absolutely</Label>
                </div>
            </RadioGroup>

            <div className="flex justify-end gap-2 mt-8">
                <Button className="px-4 py-2 mr-auto" variant={"outline"}>
                    <MoveLeft />
                    Back to Problem List
                </Button>
                <Button className="px-4 py-2" variant={"outline"}>Clear Response</Button>
                <Button className="px-4 py-2" variant={"default"}>Save & Next</Button>
            </div>
        </div>
    )
}

export default MCQProblem;
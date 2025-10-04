import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ProblemList: React.FC = () => {
    return (

        <div className="flex flex-col p-4">
            <Accordion
                type="multiple"
            >

                <AccordionItem value="coding">
                    <AccordionTrigger className="bg-gray-200 px-4">Coding (6)</AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] text-right">#</TableHead>
                                    <TableHead className="w-[150px] text-right">Status</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[50px] text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    (Array.from({ length: 6 }, (_, i) => i + 1)).map((num) => (
                                        <TableRow
                                            className={cn(
                                                num % 2 === 0 ? "bg-gray-100" : "bg-gray-200",
                                                "hover:cursor-pointer hover:bg-gray-300"
                                            )}
                                            onClick={() => alert(`You clicked on Coding ${num}`)}
                                        >
                                            <TableCell className="font-medium text-right">{num}</TableCell>
                                            <TableCell className="text-right">Not Attempted</TableCell>
                                            <TableCell>{num == 1 ? "Melon and Harshad Numbers" : `Coding ${num}`}</TableCell>
                                            <TableCell className="text-right">5</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mcq" className="mt-4">
                    <AccordionTrigger className="bg-gray-200 px-4">Multiple Choice (60)</AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] text-right">#</TableHead>
                                    <TableHead className="w-[150px] text-right">Status</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="w-[50px] text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    (Array.from({ length: 60 }, (_, i) => i + 1)).map((num) => (
                                        <TableRow className={cn(
                                            num % 2 === 0 ? "bg-gray-100" : "bg-gray-200",
                                            "hover:cursor-pointer hover:bg-gray-300"
                                        )}>
                                            <TableCell className="font-medium text-right">{num}</TableCell>
                                            <TableCell className="text-right">Not Attempted</TableCell>
                                            <TableCell>MCQ {num}</TableCell>
                                            <TableCell className="text-right">5</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}

export default ProblemList;
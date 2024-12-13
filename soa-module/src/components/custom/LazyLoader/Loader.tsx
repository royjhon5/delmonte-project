import { Progress } from "@/components/ui/progress";

export default function Loader() {
    return (
        <div className="fixed top-0 left-0 z-[1000] w-full">
            <Progress />
        </div>
    )
}
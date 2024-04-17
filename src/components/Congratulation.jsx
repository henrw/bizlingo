import treasure from "../assets/treasure.svg"

export default function Congratulations({ stage, increStage, decreStage }) {

    return (
        <>
            {
                stage === 5 && (
                    <div className="flex flex-col items-center">
                        <img src={treasure} width={300} alt="treasure" />
                        <div className="text-lg font-bold">You’ve reached your daily goal</div>
                        <div className="flex flex-row space-x-2">
                            <div>Lesson Complete!</div>
                            <div className="text-yellow-text font-bold">+10 XP</div>
                        </div>
                        <div className="flex flex-row space-x-2">
                            <div>Combo Bonus!</div>
                            <div className="text-yellow-text font-bold">+4 XP</div>
                        </div>

                        <div className="mt-4 flex flex-row justify-between w-full">
                            <button className="rounded-xl py-2 px-10 outline-2 outline outline-gray-200"
                                onClick={increStage}>
                                REVIEW LESSON
                            </button>

                            <button className={`rounded-xl py-2 px-10 bg-green-button text-white`}
                                onClick={()=>{}}>
                                CONTINUE
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
}
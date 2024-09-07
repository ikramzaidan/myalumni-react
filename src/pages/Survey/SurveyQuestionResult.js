import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PieChart from "../../components/PieChart";

const SurveyQuestionResult = () => {
    let { qid } = useParams();
    const { jwtToken } = useOutletContext();
    const { isAdmin } = useOutletContext();
    const [question, setQuestion] = useState({});
    const [labelData, setLabelData] = useState([]);
    const [datasetData, setDatasetData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isAdmin) {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        const requestOptions = {
            method: "GET",
            headers: headers,
        }

        fetch(`https://alumnihub.site/questions/${qid}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setQuestion(data);
                if (data.answers && data.answers_group) {
                    setLabelData(data.answers_group.map(item => item.answer_text));
                    setDatasetData(data.answers_group.map(item => item.answer_count));
                }
            })
            .catch(err => {
                console.log(err);
            })

    }, [qid, jwtToken]);

    return (
        <>
            
            <div className={`flex border rounded-xl shadow-md`}>
                <div className="flex flex-col w-full text-left p-5">
                    <div className="flex w-full mb-5">
                        <p className="text-sm">{question.question_text}</p>
                    </div>
                    <div className="flex flex-col lg:grid lg:grid-cols-2">
                        <div className="p-5">
                            <PieChart title="Jawaban" labels={labelData} data={datasetData} />
                        </div>
                        <div className="flex flex-col mt-3">
                            {question.answers && question.answers_group.map((answer) => (
                                <div className="flex justify-between mb-2 py-2 px-3 text-sm bg-gray-200 rounded" key={answer.id}>
                                    <div className="font-bold">{answer.answer_text}</div>
                                    <div className="font-light">{answer.answer_count} Jawaban</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`flex border rounded-xl shadow-md`}>
                <div className="flex flex-col w-full text-left p-5">
                    <div className="flex justify-between">
                        <div className="text-sm font-semibold">Seluruh Jawaban</div>
                        <div className="text-sm font-semibold text-gray-400">{question.answers ? question.answers.length : "0"} Jawaban</div>
                    </div>
                    <div className="flex flex-col mt-3">
                        {question.answers && question.answers.map((answer) => (
                            <div className="flex mb-2 py-2 px-3 text-sm bg-gray-200 rounded" key={answer.id}>
                                {answer.answer_text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SurveyQuestionResult;
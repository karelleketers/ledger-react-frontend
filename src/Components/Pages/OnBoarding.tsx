import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LOAD_REFRESHTOKEN, SET_QUESTIONNAIRE, SKIP_QUESTIONNAIRE } from "../../GraphQL/Mutations";

interface Questionnaire {
    id?: null | number,
    ageGroup: number | null ,
    improve: string | null, 
    savedLastMonth: boolean | null,
    goal: boolean,
    savings: null | number,
    balance: null | number
}

export const OnBoarding = () => {
    const navigate = useNavigate();
    const [addQuestionnaire, {data: onBoardingData}] = useMutation(SET_QUESTIONNAIRE);
    const [skipQuestionnaire, {data: questionnaireSkipped}] = useMutation(SKIP_QUESTIONNAIRE);
    const [getRefreshToken, {data: refreshToken}] = useMutation(LOAD_REFRESHTOKEN);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
        ageGroup: null,
        improve: null,
        savedLastMonth: null,
        goal: false,
        savings: null,
        balance: null
    });
    const [skipped, setSkipped] = useState(false);
    const [question, setQuestion] = useState(0);
    const [questionSkip, setQuestionSkip] = useState(0);

    const addNewQuestionnaire = (e: any) => {
        e.preventDefault();
        addQuestionnaire({
            variables: {
                ageGroup: questionnaire.ageGroup,
                improve: questionnaire.improve,
                savedLastMonth: questionnaire.savedLastMonth,
                goal: questionnaire.goal,
                savings: questionnaire.savings,
                balance: questionnaire.balance,
            }
        });
    }

    useEffect(() => {
        if (onBoardingData || questionnaireSkipped) {
            getRefreshToken();
        }
    }, [onBoardingData, questionnaireSkipped])

    useEffect(() => {
        if(refreshToken) {
            localStorage.setItem('token', refreshToken.refreshToken.token);
            navigate('/account', { replace: true})
        }
    }, [refreshToken])

    useEffect(() => {
        if(skipped) {
            skipQuestionnaire()
        }
    }, [skipped])

    return (
        <>
            {question === 0 && <div>
                <h2>Welcome!</h2>
                <p>Before exploring Ledger, we'd like to get to know you a bit better</p>
                <p>Don't worry, you can skip the questions and come back to it later</p>
                <button onClick={() => {setSkipped(true)}}>SKIP</button>
                <button onClick={() => {setQuestion(question => question + 1)}}>PROCEED</button>
            </div>}
            <form>
                {question === 1 && <div>
                    <div><h3>What's your age-group?</h3>
                    <label>
                        <input type="radio" value="1" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            ageGroup: 1
                        });
                    }}/>
                        18-25
                    </label>
                    <label>
                        <input type="radio" value="2" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            ageGroup: 2
                        });
                    }}/>
                        26-40
                    </label>
                    <label>
                        <input type="radio" value="3" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            ageGroup: 3
                        });
                    }}/>
                        41-64
                    </label>
                    <label>
                        <input type="radio" value="4" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            ageGroup: 4
                        });
                    }}/>
                        65+
                    </label></div>
                    <button onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>NEXT</button>
                </div>}
                {question === 2 && <div>
                    <div><h3>What would you like to improve?</h3>
                    <label>
                        <input type="radio" value="budgeting" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            improve: e.target.value
                        });
                    }}/>
                        budgeting
                    </label>
                    <label>
                        <input type="radio" value="saving" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            improve: e.target.value
                        });
                    }}/>
                    saving
                    </label>
                    <label>
                        <input type="radio" value="investing" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            improve: e.target.value
                        });
                    }}/>
                        investing
                    </label>
                    <label>
                        <input type="radio" value="profiting" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            improve: e.target.value
                        });
                    }}/>
                        profiting
                    </label></div>
                    <button onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>NEXT</button>
                </div>}
                {question === 3 && <div>
                    <div><h3>Did you save last month?</h3>
                    <label>
                        <input type="radio" value="false" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            savedLastMonth: (e.target.value === "true")
                        });
                        setQuestionSkip(1)
                    }}/>
                        no
                    </label>
                    <label>
                        <input type="radio" value="true" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            savedLastMonth: (e.target.value === "true")
                        });
                    }}/>
                    yes
                    </label></div>
                    <button onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1 + questionSkip); setQuestionSkip(0)}}>NEXT</button>
                </div>}
                {question === 4 && <div>
                    <div><h3>Did you save enough last month?</h3>
                    <label>
                        <input type="radio" value="false" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            goal: (e.target.value === "true")
                        });
                    }}/>
                        no
                    </label>
                    <label>
                        <input type="radio" value="true" onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            goal: (e.target.value === "true")
                        });
                    }}/>
                    yes
                    </label></div>
                    <button onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>NEXT</button>
                </div>}
                {question === 5 && <div>
                    <div><label>How much money is currently in your balance?</label>
                    <input type="text" 
                        placeholder="current money in balance"
                        onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            balance: parseInt(e.target.value)
                        });
                    }}/></div>
                    <button onClick={(e) => {e.preventDefault(); setQuestion(question => question + 1)}}>NEXT</button>
                </div>}
                {question === 6 && <div>
                    <div><label>How much money is currently in your savings?</label>
                    <input type="text" 
                        placeholder="current money in savings"
                        onChange={(e) => {
                        setQuestionnaire({
                            ...questionnaire,
                            savings: parseInt(e.target.value)
                        });
                    }}/></div>
                    <button onClick={addNewQuestionnaire}>Finish</button>
                </div>}
            </form>
        </>
    )
}

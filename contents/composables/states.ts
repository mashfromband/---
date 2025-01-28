export type UseMissionAnswerOneChoiceOptionsType = {
    value: string,
    label: string,
};

export const useMissionAnswerOneChoice = () => useState<{
    select: string,
    options: UseMissionAnswerOneChoiceOptionsType[],
}>(
    "mission_answer_one_choice",
    () => {
        return {
            select: "",
            options: [],
        };
    }
);

export const useMissionCommentary = () => useState<{
    commentary: string,
}>(
    "mission_display_commentaty",
    () => {
        return {
            commentary: "",
        };
    }
);

export const useQuestionBodyHtml = () => useState<{
    body: string,
}>(
    "mission_question_body_html",
    () => {
        return {
            body: "",
        };
    }
);

export const useMissionNextButton = () => useState<{
    isDisplay: boolean,
}>(
    "mission_next_button",
    () => {
        return {
            isDisplay: false,
        };
    }
);

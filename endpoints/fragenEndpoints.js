const { returnHTML } = require("../utils/utils");
const { dbFragenFromPool, dbGetCurrentQuiz, dbGetCurrentQuizOptions } = require("../db/fragenQueries");
const { errorLog, log } = require("../utils/logger");

async function getQuizes(req, res) {
  let items = await dbFragenFromPool(req.params.id);
  return returnHTML(res, 200, { data: items });
}

async function getCurrentQuiz(req, res) {
  var type = parseInt(req.params.type, 10);
  switch (type) {
    case QuestionType.Radio:
      return returnHTML(res, 200, {
        data: {
          runId: 2,
          lenth: 5,
          question: {
            title: "Was ist 1+1?",
            type: QuestionType.Radio,
            options: [
              { id: 1, text: "1" },
              { id: 2, text: "2" },
              { id: 3, text: "3" },
              { id: 4, text: "4" },
            ],
          },
        },
      });
    case QuestionType.Checkbox:
      return returnHTML(res, 200, {
        data: {
          runId: 2,
          lenth: 5,
          question: {
            title: "Was ist 1±1?",
            type: QuestionType.Checkbox,
            options: [
              { id: 1, text: "1" },
              { id: 2, text: "2" },
              { id: 3, text: "3" },
              { id: 4, text: "0" },
            ],
          },
        },
      });
    case QuestionType.Number:
      return returnHTML(res, 200, {
        data: {
          runId: 2,
          lenth: 5,
          question: {
            title: "Was ist 1+1?",
            type: QuestionType.Number,
          },
        },
      });
    case QuestionType.Boolean:
      return returnHTML(res, 200, {
        data: {
          runId: 2,
          lenth: 5,
          question: {
            title: "Stimmt folgende Gleichung: 1+1=3?",
            type: QuestionType.Boolean,
          },
        },
      });
    case QuestionType.Text:
      return returnHTML(res, 200, {
        data: {
          runId: 2,
          lenth: 5,
          question: {
            title: "Was versteht man unter KlamPuStri?",
            type: QuestionType.Text,
          },
        },
      });
    default:
      return returnHTML(res, 400, { error: "Invalid question type" });
  }
}

async function getCurrentQuiz1(req, res) {
  const user = req.user.id;
  const runId = req.params.id;
  log(user);
  try {
    log("try started");
    dbGetCurrentQuiz(user, (error, results) => {
      /**
       * [
        {
            "input": null,
            "questDbId": 1,
            "questionType": "radio",
            "questionTitle": "Was ist 1+1?"
        },
        {
            "input": null,
            "questDbId": 2,
            "questionType": "checkbox",
            "questionTitle": "Was ist 1±1?"
        },
        {
            "input": null,
            "questDbId": 3,
            "questionType": "number",
            "questionTitle": "Was ist 1+1?"
        },
        {
            "input": null,
            "questDbId": 4,
            "questionType": "boolean",
            "questionTitle": "Stimmt folgende Gleichung: 1+1=3?"
        },
        {
            "input": null,
            "questDbId": 5,
            "questionType": "text",
            "questionTitle": "Was versteht man unter KlamPuStri?"
        }
    ]
       */
      if (error) {
        errorLog(error);
        return returnHTML(res, 500, { error: error });
      }

      if (0 <= runId < results.lenth) {
        return returnHTML(res, 404, { error: "RunId out of scope" });
      }

      dbGetCurrentQuizOptions(results[runId].questDbId, (error, options) => {
        if (error) {
          errorLog(error);
          return returnHTML(res, 500, { error: error });
        }
        if (options.length === 0) {
          return returnHTML(res, 404, { error: "No options found" });
        }
        results[runId].options = options;

        /**
         * Example response:
         * {
         *  "success": true,
         *  "data": [
         *    {
         *      "input": null,
         *      "questDbId": 1,
         *      "questionType": "radio",
         *      "questionTitle": "Was ist 1+1?"
         *    },
         *    {
         *      "input": null,
         *      "questDbId": 2,
         *      "questionType": "checkbox",
         *      "questionTitle": "Was ist 1±1?",
         *      "options": [
         *        {
         *          "id": 5,
         *          "questionId": 2,
         *          "key": "1",
         *          "isTrue": 0
         *        },
         *        {
         *          "id": 6,
         *          "questionId": 2,
         *          "key": "2",
         *          "isTrue": 1
         *        },
         *        {
         *          "id": 7,
         *          "questionId": 2,
         *          "key": "3",
         *          "isTrue": 0
         *        },
         *        {
         *          "id": 8,
         *          "questionId": 2,
         *          "key": "0",
         *          "isTrue": 1
         *        }
         *      ]
         *    },
         *    {
         *    "input": null,
         *    "questDbId": 3,
         *    "questionType": "number",
         *    "questionTitle": "Was ist 1+1?"
         *    },
         *    {
         *      "input": null,
         *      "questDbId": 4,
         *      "questionType": "boolean",
         *      "questionTitle": "Stimmt folgende Gleichung: 1+1=3?"
         *    },
         *    {
         *      "input": null,
         *      "questDbId": 5,
         *      "questionType": "text",
         *      "questionTitle": "Was versteht man unter KlamPuStri?"
         *    }
         *  ]
         * }
         * 
         * 
         * * ----------------------------
         * ! Bring the data in the following format
         * 
         * ? {
         * ?  success: true,
         * ?  data: {
         * ?    runId: *,
         * ?    length: *,
         * ?    question: {
         * ?      title: "*******",
         * ?      type: QuestionType.****,
         * ?      options: [
         * ?        { id: *, text: "*" },
         * ?        { id: *, text: "*" },
         * ?        { id: *, text: "*" },
         * ?        { id: *, text: "*" }
         * ?      ]
         * ?    }
         * ?  }
         * ? };
         */
        const craftResponse = {
          runId: runId,
          length: results.length,
          question: {
            title: results[runId].questionTitle,
            type: QuestionType[results[runId].questionType],
            //options: questionType === QuestionType.Checkbox || questionType === QuestionType.Radio ? options : undefined,
          },
        }







        return returnHTML(res, 200, { data: craftResponse });
      });
    });
  } catch (error) {
    errorLog(error);
    return returnHTML(res, 500, { error: error });
  }
}

async function setCurrentQuestionStat(req, res) {
  let user = req.user.id;
  let runId = req.params.questionid;
}

module.exports = {
  getQuizes,
  getCurrentQuiz,
  getCurrentQuiz1,
  setCurrentQuestionStat,
};

// ? QuestionType is an enum that is used to define the type of a question.
// ? It is used in the frontend to determine the correct input field for the question.
const QuestionType = {
  Radio: 0,
  Checkbox: 1,
  Number: 2,
  Boolean: 3,
  Text: 4,
  Ratio: "radio",
  Checkbox: "checkbox",
  Number: "number",
  Boolean: "boolean",
  Text: "text",
};

/*
 ? Format für Radio Input
{
    success: true,
    data: {
        runId: 200,
        question: {
            title: "Was ist 1+1?",
            type: QuestionType.Radio,
            options: [
                { id: 1, text: "1" },
                { id: 2, text: "2" },
                { id: 3, text: "3" },
                { id: 4, text: "4" }
            ]
        }
    }
};

 ? Format für Checkbox Input
{
    success: true,
    data: {
        runId: 200,
        question: {
            title: "Was ist 1+1?",
            type: QuestionType.Checkbox,
            options: [
                { id: 1, text: "1" },
                { id: 2, text: "2" },
                { id: 3, text: "3" },
                { id: 4, text: "4" }
            ]
        }
    }
};

 ? Format für Number Input
{
    success: true,
    data: {
        runId: 200,
        question: {
            title: "Was ist 1+1?",
            type: QuestionType.Number,
            
        }
    }
};

 ? Format für Boolean Input
{
    success: true,
    data: {
        runId: 200,
        question: {
            title: "Stimmt folgende Gleichung: 1+1=3?",
            type: QuestionType.Boolean,
        }
    }
};

 ? Format für Text Input (optional)
{
    success: true,
    data: {
        runId: 200,
        question: {
            title: "Was versteht man unter KlamPuStri?",
            type: QuestionType.Text,
        }
    }
};
*/

const { returnHTML } = require("../utils/utils");
const { dbFragenFromPool, dbGetCurrentQuiz } = require("../db/fragenQueries");
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
  log(user);
  //const runId = req.params.id;
  try {
    log("try started");
    dbGetCurrentQuiz(user, (error, results) => {
      log("callback started");
      if (error) {
        return returnHTML(res, 500, { error: error });
      }
      return returnHTML(res, 200, { data: results });
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
};

/*
// Format für Radio Input
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

// Format für Checkbox Input
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

// Format für Number Input
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

// Format für Boolean Input
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

// Format für Text Input (optional)
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

const express = require('express');
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

router.get("/:id", (req, res) => {
    taskData.getTaskById(req.params.id).then((task) => {
        res.status(200).json(task);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.get("/", (req, res) => {
    taskData.getAllTasks(parseInt(req.query.skip), parseInt(req.query.take)).then((taskList) => {
        res.status(200).json(taskList);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.post("/", (req, res) => {
    let taskDataObtained = req.body;

    taskData.addTask(taskDataObtained.title, taskDataObtained.description, taskDataObtained.hoursEstimated, taskDataObtained.completed)
        .then((newTask) => {
            res.status(200).json(newTask);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;

        return taskData.updateTask(req.params.id, updatedData)
            .then((updatedTask) => {
                res.status(200).json(updatedTask);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    });
  

router.patch("/:id", (req, res) => {
    let updatedData = req.body;

        return taskData.patchTask(req.params.id, updatedData)
            .then((updatedTask) => {
                res.status(200).json(updatedTask);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    });

router.delete("/:taskId/:commentId", (req, res) => {
        return taskData.removeComment(req.params.commentId, req.params.taskId)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    });

router.post("/:id/comments", (req, res) => {
    let commentDataObtained = req.body;

    taskData.addComment(req.params.id, commentDataObtained.name, commentDataObtained.comment)
        .then(() => {
        res.sendStatus(200);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

module.exports = router;
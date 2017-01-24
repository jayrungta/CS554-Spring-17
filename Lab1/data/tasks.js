const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllTasks(skip, take) {
         if (skip && take)
            return Promise.reject("Please provide either skip or take, not both.");
         if (skip && !take){
             if(typeof skip!== "number")
                return Promise.reject("Skip should be a number");
         }
         if (!skip && take){
             if(typeof take!== "number")
                return Promise.reject("Take should be a number");
         }

        return tasks().then((tasksCollection) => {
            if (skip) {
                return tasksCollection
                    .find()
                    .skip(skip)
                    .limit(100)
                    .toArray();
            }
            if (take) {
                return tasksCollection
                    .find()
                    .maxScan(take)
                    .limit(100)
                    .toArray();
            }
            if (!take && !skip) {
                return tasksCollection
                    .find()
                    .limit(20)
                    .toArray();
            }
        });
    },
    getTaskById(id) {
        if (typeof id !== "string" || !id)
            return Promise.reject("Please provide ID for the task.");
        return tasks().then((tasksCollection) => {
            return tasksCollection
                .findOne({ _id: id })
                .then((task) => {
                    if (!task)
                        return Promise.reject("No task found");
                    return task;
                });
        });
    },
    addTask(title, description, hoursEstimated, completed) {
        if (typeof title !== "string" || !title)
            return Promise.reject("Please provide title for the task.");
        if (typeof description !== "string" || !description)
            return Promise.reject("Please provide description for the task.");
        if (typeof hoursEstimated !== "number" || !hoursEstimated)
            return Promise.reject("Please provide estimated hours for the task.");
        if (typeof completed !== "boolean" || completed === undefined)
            return Promise.reject("Please provide completed status for the task.");

        return tasks().then((tasksCollection) => {
            let newTask = {
                _id: uuid.v4(),
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: []
            }
            return tasksCollection.insertOne(newTask).then((newInsertInformation) => {
                if (newInsertInformation.result.ok !== 1) {
                    return Promise.reject("Could not execute the command");
                }
                else
                    return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getTaskById(newId);
            });
        });
    },
    removeTask(id) {
        if (typeof id !== "string" || !id)
            return Promise.reject("Please provide ID for the task to be deleted");
        return tasks().then((tasksCollection) => {
            return tasksCollection
                .removeOne({ _id: id })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject("Could not delete the task");
                    } else { }
                });
        });
    },
    patchTask(id, updatedTask) {
        if (typeof id !== "string" || !id)
            return Promise.reject("Please provide ID for the task to be updated");
        if (!updatedTask)
            return Promise.reject("Please provide updates for the task.");

        if (updatedTask.comments)
            return Promise.reject("No modification of comments is allowed");
        return tasks().then((tasksCollection) => {
            let updatedTaskData = {};

            if (updatedTask.title) {
                updatedTaskData.title = updatedTask.title;
            }

            if (updatedTask.description) {
                updatedTaskData.description = updatedTask.description;
            }

            if (updatedTask.hoursEstimated) {
                updatedTaskData.hoursEstimated = updatedTask.hoursEstimated;
            }
            if (updatedTask.completed !== undefined) {
                updatedTaskData.completed = updatedTask.completed;
            }

            let updateCommand = {
                $set: updatedTaskData
            };

            return tasksCollection.updateOne({
                _id: id
            }, updateCommand).then((result) => {
                return this.getTaskById(id);
            });
        });
    },
    updateTask(id, updatedTask) {
        if (typeof id !== "string" || !id)
            return Promise.reject("Please provide ID for the task to be updated");
        if (!updatedTask)
            return Promise.reject("Please provide updates for the task.");

        if (updatedTask.comments)
            return Promise.reject("Please provide modification of the comments is allowed");

        if (!updatedTask.title)
            return Promise.reject("Please provide title for the task.");

        if (!updatedTask.description)
            return Promise.reject("Please provide description for the task.");

        if (!updatedTask.hoursEstimated)
            return Promise.reject("Please provide estimated hours for the task.");

        if (updatedTask.completed === undefined)
            return Promise.reject("Please provide completed status for the task.");

        return tasks().then((tasksCollection) => {
            return tasksCollection.updateOne({
                _id: id
            }, updatedTask).then((result) => {
                return this.getTaskById(id);
            });
        });
    },
    addComment(taskId, name, comment) {
        if (typeof taskId !== "string" || !taskId)
            return Promise.reject("Please provide id for the task.");
        if (typeof name !== "string" || !name)
            return Promise.reject("Please provide name for the comment.");
        if (typeof comment !== "string" || !comment)
            return Promise.reject("Please provide comment for the comment.");

        return tasks().then((tasksCollection) => {
            return tasksCollection.findOne({ _id: taskId }).then((task) => {
                if (!task)
                    return Promise.reject("Could not find the task.");
                let commentId = uuid.v4();
                return tasksCollection.updateOne({ _id: taskId }, {
                    $addToSet: {
                        comments: {
                            _id: commentId,
                            name: name,
                            comment: comment
                        }
                    }
                }).then((updateInfo) => {
                    if (updateInfo.modifiedCount == 0)
                        return Promise.reject("Could not execute the command.");
                });
            });
        });
    },
    removeComment(commentId, taskId) {
        if (typeof commentId !== "string" || !commentId)
            return Promise.reject("Please provide ID for the comment to be deleted.");
        if (typeof taskId !== "string" || !taskId)
            return Promise.reject("Please provide ID for the task to be deleted.");

        return tasks().then((tasksCollection) => {
            return tasksCollection
                .updateOne({ _id: taskId }, {
                    $pull: {
                        comments: {
                            _id: commentId
                        }
                    }
                })
                .then((updateInfo) => {
                    if (updateInfo.modifiedCount === 0)
                        return Promise.reject("Could not execute the command.");
                });
        });
    }
};

module.exports = exportedMethods;
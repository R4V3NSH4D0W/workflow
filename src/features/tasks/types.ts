import { Models } from "node-appwrite";

export enum TaskStatus{
    BACKLOG="BACKLOG",
    TODO="TODO",
    IN_PROGRESS="IN_PROGRESS",
    IN_REVIEW="IN_REVIEW",
    DONE="DONE",
}

export enum PriorityStatus{
    HIGH="HIGH",
    LOW="LOW",
}

export type Task= Models.Document & {
    name:string;
    status:TaskStatus;
    assigneeId:string;
    projectId:string;
    position:number;
    dueDate:string;
    workspaceId:string;
    description?:string;
    priority?:PriorityStatus;
}
import { sessionMiddleWare } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECT_ID, TASK_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClinet } from "@/lib/app-write";
import { Project } from "@/features/projects/types";

const app = new Hono()
.get("/",
    sessionMiddleWare,
    zValidator("query",
        z.object({
            workspaceId:z.string(),
            projectId:z.string().nullish(),
            assigneeId:z.string().nullish(),
            status:z.nativeEnum(TaskStatus).nullish(),
            search:z.string().nullish(),
            dueDate:z.string().nullish(),
        })
    ),
    async(c)=>{
        const {users} = await createAdminClinet();
        const databases= c.get('databases');
        const user= c.get("user");

        const {
            workspaceId,
            projectId,
            assigneeId,
            search,
            status,
            dueDate
        }=c.req.valid("query");

        const member = await getMember({
            databases,
            workspaceId,
            userId:user?.$id
        });
        if(!member){
            return c.json({error:"unAuthorized"},401);
        }

        const query =[
            Query.equal("workspaceId",workspaceId),
            Query.orderDesc("$createdAt"),
        ];

        if(projectId){
            console.log("projectID",projectId);
            query.push(Query.equal("projectId",projectId))
        }
        if(status){
            console.log("stauts",status);
            query.push(Query.equal("status",status))
        }
        if(assigneeId){
            console.log("assigneId",assigneeId);
            query.push(Query.equal("assigneeId",assigneeId))
        }
        if(dueDate){
            console.log("dueDate",dueDate);
            query.push(Query.equal("dueDate",dueDate))
        }
        if(search){
            console.log("search",search);
            query.push(Query.search("name",search))
        }

        const tasks = await databases.listDocuments<Task>(
            DATABASE_ID,
            TASK_ID,
            query
        );

        const projectIds= tasks.documents.map((task)=>task.projectId);
        const assigneeIds= tasks.documents.map((task)=>task.assigneeId);

        const projects = await databases.listDocuments<Project>(
            DATABASE_ID,
            PROJECT_ID,
            projectIds.length>0? [Query.contains("$id",projectIds)]:[]
        );

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            assigneeIds.length>0? [Query.contains("$id",assigneeIds)]:[]
        );

        const assignees = await Promise.all(
            members.documents.map(async(member)=>{
                const user = await users.get(member.userId);
                return {
                    ...member,
                    name:user.name,
                    email:user.email,
                }
            })
        )

        const populatedTasks =tasks.documents.map((task)=>{
            const project = projects.documents.find((project)=>project.$id === task.projectId);
            const assignee = assignees.find((assignee)=>assignee.$id === task.assigneeId);

            return{
                ...task,
                project,
                assignee,
            }
        });

        return  c.json({
            data: {
                ...tasks,
                documents:populatedTasks,
            }

        })
    }
)
.post("/",
    sessionMiddleWare,
    zValidator("json",createTaskSchema),
    async(c)=>{
        const user = c.get("user");
        const databases= c.get("databases");
        const {name,status,workspaceId,projectId,dueDate,assigneeId}=c.req.valid("json");

        const member = await getMember({
            databases,
            workspaceId,
            userId:user?.$id,
        });
        if(!member){
            return c.json({error:"unauthorized"},401);
        }

        const highestPositionTask = await databases.listDocuments(
            DATABASE_ID,
            TASK_ID,
            [Query.equal("status",status),
                Query.equal("workspaceId",workspaceId),
                Query.orderAsc("position"),
                Query.limit(1)
            ]
        );

        const newPosition = highestPositionTask.documents.length > 0
        ? highestPositionTask.documents[0].position + 1000
        :1000;

        const task = await databases.createDocument(
            DATABASE_ID,
            TASK_ID,
            ID.unique(),
            {
                name,
                status,
                workspaceId,
                projectId,
                dueDate,
                assigneeId,
                position:newPosition,
                // description,
            }
        );
        return c.json({data:task});
    }
)
.delete('/:taskId',
    sessionMiddleWare,
    async(c)=>{
        const user = c.get("user");
        const databases= c.get("databases");
        const {taskId}=c.req.param();

        const task = await databases.getDocument<Task>(
            DATABASE_ID,
            TASK_ID,
            taskId
        );

        const member = await getMember({
            databases,
            workspaceId:task.workspaceId,
            userId:user.$id,
        });

        if(!member){
            return c.json({error:"unAuthorized"},401);
        }

        await databases.deleteDocument(
            DATABASE_ID,
            TASK_ID,
            taskId
        );

        return c.json({data:{
            $id:task.$id
        }});
    }
)
.patch("/:taskId",
    sessionMiddleWare,
    zValidator("json",createTaskSchema.partial()),
    async(c)=>{
        const user = c.get("user");
        const databases= c.get("databases");
        const {taskId}=c.req.param();
        const {name,status,description,projectId,dueDate,assigneeId}=c.req.valid("json");

        const existingTask = await databases.getDocument<Task>(
            DATABASE_ID,
            TASK_ID,
            taskId
        );

        const member = await getMember({
            databases,
            workspaceId:existingTask.workspaceId,
            userId:user?.$id,
        });
        if(!member){
            return c.json({error:"unauthorized"},401);
        }


        const task = await databases.updateDocument(
            DATABASE_ID,
            TASK_ID,
          taskId,
            {
                name,
                status,
                projectId,
                dueDate,
                assigneeId,
                description,
            }
        );
        return c.json({data:task});
    }
)
.get('/:taskId',
    sessionMiddleWare,
    async(c)=>{
        const {taskId}=c.req.param();
        const currnetUser = c.get("user");
        const databases= c.get("databases");
        const {users}= await createAdminClinet();
        const task = await databases.getDocument<Task>(
            DATABASE_ID,
            TASK_ID,
            taskId,
        );
        const currentMember= getMember({
            databases,
            workspaceId:task.workspaceId,
            userId:currnetUser.$id
        });

        if(!currentMember){
            return c.json({error:"unauthorized"},401);
        }
        const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECT_ID,
            task.projectId,
        );

        const member = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            task.assigneeId,
        );
        const user = await users.get(member.userId);

        const assignee={
            ...member,
            name:user.name,
            email:user.email,
        };

        return c.json({
            ...task,
            project,
            assignee
        })
    }
)

export default app;
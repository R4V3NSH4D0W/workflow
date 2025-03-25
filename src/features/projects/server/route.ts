import { DATABASE_ID, IMAGE_BUCKET_ID, PROJECT_ID, TASK_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";
import { endOfMonth,startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
.post('/',
    sessionMiddleWare,
    zValidator("form", createProjectSchema), async(c)=>{
        const databases =c.get("databases");
        const user = c.get("user");
        const storage= c.get("storage");
    
        const {name,image, workspaceId}=c.req.valid("form");

        const member = await getMember({
            databases,
            workspaceId,
            userId:user.$id
        })

        if(!member){
            return c.json({error:"unAuthorized"},401)
        }
    
        let uploadedImageUrl:string|undefined;
    
        if(image instanceof File){
            const file =await storage.createFile(IMAGE_BUCKET_ID,ID.unique(),image);
    
            const arrayBuffer= await storage.getFilePreview(IMAGE_BUCKET_ID,file.$id);
    
            uploadedImageUrl=`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        }
    
        const project = await databases.createDocument(
            DATABASE_ID,
            PROJECT_ID,
            ID.unique(),{
                name,
                imageUrl:uploadedImageUrl,
                workspaceId
    
            }
        );
        return c.json({data:project})
    })
.get('/',sessionMiddleWare,zValidator("query",z.object({workspaceId:z.string()})),
async(c)=>{
    const user = c.get("user");
    const databases= c.get("databases");
    const {workspaceId}= c.req.valid('query');

    if(!workspaceId){
        return c.json({error:"Missing workspace id"},400);
    }

    const member = getMember({
        databases,
        workspaceId,
        userId:user.$id
    });
    if(!member){
        return c.json({error:"unAuthorized"},401)
    }
    const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECT_ID,
        [Query.equal("workspaceId",workspaceId),
            Query.orderDesc("$createdAt")
        ]
    );

    return c.json({data:projects})
}
)
.patch("/:projectId",
    sessionMiddleWare,zValidator("form",updateProjectSchema),
    async(c)=>{

        const databases= c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const {projectId}= c.req.param();
        const {name,image}=c.req.valid("form");

        const existingProject = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECT_ID,
            projectId
        );

        const member = await getMember({
            databases,
            workspaceId:existingProject.workspaceId,
            userId:user.$id});

        if(!member){
            return c.json({error:"unAuthorized"},401)
        }

        let uploadedImageUrl:string|undefined;

        if(image instanceof File){
            const file =await storage.createFile(IMAGE_BUCKET_ID,ID.unique(),image);
    
            const arrayBuffer= await storage.getFilePreview(IMAGE_BUCKET_ID,file.$id);
    
            uploadedImageUrl=`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        }else{
            uploadedImageUrl= image;
        }
        const project = await databases.updateDocument(
            DATABASE_ID,
            PROJECT_ID,
            projectId,{
                name,
                imageUrl:uploadedImageUrl,
            }
        ) 
        
        return c.json({data:project});
    }
)
//TODO Delete Taask
.delete("/:projectId",
    sessionMiddleWare,
    async(c)=>{
        const databases = c.get("databases");
        const user= c.get("user");
        const {projectId}= c.req.param();

        const existingProject = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECT_ID,
            projectId
        );

        const member=  await getMember({
            databases,workspaceId:existingProject.workspaceId,userId:user.$id
        });
        if(!member){
            return c.json({
                error:"unAuthorized"
            },401)
        }
        await databases.deleteDocument(
            DATABASE_ID,
            PROJECT_ID,
            projectId
        )
        return c.json({data:{
            $id:existingProject.$id
        }})
    }
)
.get("/:projectId",sessionMiddleWare, async(c)=>{
    const databases = c.get("databases");
    const user= c.get("user");
    const {projectId}= c.req.param();

    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECT_ID,
        projectId
    );
    const member=  await getMember({
        databases,workspaceId:project.workspaceId,userId:user.$id
    });

    if(!member){
        return c.json({
            error:"unAuthorized"
        },401)
    }

    return c.json({data:project});
})
.get("/:projectId/analytics",
    sessionMiddleWare,
    async(c) => {
        try {
            const databases = c.get("databases");
            const user = c.get("user");
            const { projectId } = c.req.param();

            const project = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECT_ID,
                projectId
            );

            const member = await getMember({
                databases,
                workspaceId: project.workspaceId,
                userId: user.$id
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const now = new Date();
            const thisMonthStart = startOfMonth(now);
            const thisMonthEnd = endOfMonth(now);
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));

            const [
                thisMonthTasks,
                lastMonthTasks,
                thisMonthAssignedTasks,
                lastMonthAssignedTasks,
                thisMonthIncompleteTasks,
                lastMonthIncompleteTasks,
                thisMonthCompletedTasks,
                lastMonthCompletedTasks,
                thisMonthOverdueTasks,
                lastMonthOverdueTasks
            ] = await Promise.all([
                // Total tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Assigned tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.equal("assigneeId", member.$id),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.equal("assigneeId", member.$id),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Incomplete tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Completed tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.equal("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.equal("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Overdue tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.lessThan("dueDate", now.toISOString()),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("projectId", projectId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.lessThan("dueDate", now.toISOString()),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ])
            ]);

            // Calculate metrics with null checks
            const calculateDifference = (current: number, previous: number) => ({
                count: current,
                difference: current - previous
            });

            return c.json({
                data: {
                    tasks: calculateDifference(thisMonthTasks.total, lastMonthTasks.total),
                    assignedTasks: calculateDifference(
                        thisMonthAssignedTasks.total,
                        lastMonthAssignedTasks.total
                    ),
                    completedTasks: calculateDifference(
                        thisMonthCompletedTasks.total,
                        lastMonthCompletedTasks.total
                    ),
                    incompleteTasks: calculateDifference(
                        thisMonthIncompleteTasks.total,
                        lastMonthIncompleteTasks.total
                    ),
                    overdueTasks: calculateDifference(
                        thisMonthOverdueTasks.total,
                        lastMonthOverdueTasks.total
                    )
                }
            });

        } catch (error) {
            console.error("Analytics error:", error);
            return c.json({ error: "Failed to fetch analytics" }, 500);
        }
    }
)
export default app;
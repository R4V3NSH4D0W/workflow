import { Project } from "./types";
import { DATABASE_ID, PROJECT_ID } from "@/config";
import { getMember } from "../members/utils";
import { createSessionClinet } from "@/lib/app-write";

interface GetProjectProps {
    projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
        const { account, databases } = await createSessionClinet();
        const user = await account.get();
        if (!user) {
            throw new Error("unAuthroized");
        }
        const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECT_ID,
            projectId
        ); 

        if (!project) {
            throw new Error("unAuthroized");
        }

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId: project.workspaceId,
        });

        if (!member) {
         throw new Error("unAuthorized")
        }
        return project;
};

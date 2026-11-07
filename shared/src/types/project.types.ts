export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    repositoryUrl?: string;
    userId: string;
}